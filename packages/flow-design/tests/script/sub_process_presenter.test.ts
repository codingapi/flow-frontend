import {describe, expect, it} from '@rstest/core';
import {SubProcessPresenter} from '@/script-components/components/sub-process/presenters';
import {SCRIPT_DEFAULT_SUB_PROCESS_RESULT} from '@/script-components/default-script';

describe('SubProcessPresenter', () => {
    it('应将多条子流程配置生成为创建请求列表', () => {
        let script = '';
        const presenter = new SubProcessPresenter({
            value: '',
            onChange: value => {
                script = value;
            },
        });

        presenter.updateScript({
            processes: [
                {
                    workId: 'leave-child',
                    actionId: 'submit-1',
                    operatorId: 1,
                    formData: JSON.stringify({dataBody: {data: {type: 'annual'}}}),
                },
                {
                    workId: 'expense-child',
                    actionId: 'submit-2',
                    operatorId: 2,
                    formData: JSON.stringify({dataBody: {data: {amount: 100}}}),
                },
            ],
        });

        expect(script).toContain("return [");
        expect(script).toContain("request.toCreateRequest('leave-child', 1, 'submit-1'");
        expect(script).toContain("request.toCreateRequest('expense-child', 2, 'submit-2'");
        expect(presenter.parserScript(script).processes).toHaveLength(2);
    });

    it('应将历史单子流程元数据兼容为配置列表', () => {
        const presenter = new SubProcessPresenter({value: '', onChange: () => undefined});
        const legacyScript = `
            // @SCRIPT_META {"workId":"legacy","actionId":"submit","operatorId":1,"formData":""}
            def run(request){ return request.toCreateRequest() }
        `;

        const result = presenter.parserScript(legacyScript);

        expect(result.processes).toEqual([
            {workId: 'legacy', actionId: 'submit', operatorId: 1, formData: ''},
        ]);
    });

    it('配置子流程标题时生成 5 参调用并可 round-trip 回填（issue #197）', () => {
        let script = '';
        const presenter = new SubProcessPresenter({
            value: '',
            onChange: value => {
                script = value;
            },
        });

        presenter.updateScript({
            processes: [
                {
                    workId: 'leave-child',
                    actionId: 'submit-1',
                    operatorId: 1,
                    formData: JSON.stringify({dataBody: {data: {type: 'annual'}}}),
                    workTitle: '端午请假批次',
                },
            ],
        });

        expect(script).toContain("request.toCreateRequest('leave-child', 1, 'submit-1'");
        expect(script).toContain(", '端午请假批次')");
        const parsed = presenter.parserScript(script);
        expect(parsed.processes).toHaveLength(1);
        expect(parsed.processes[0].workTitle).toBe('端午请假批次');
    });

    it('未配置子流程标题时仍生成 4 参调用', () => {
        let script = '';
        const presenter = new SubProcessPresenter({
            value: '',
            onChange: value => {
                script = value;
            },
        });

        presenter.updateScript({
            processes: [
                {
                    workId: 'leave-child',
                    actionId: 'submit-1',
                    operatorId: 1,
                },
            ],
        });

        expect(script).toContain("request.toCreateRequest('leave-child', 1, 'submit-1', '')");
        expect(script).not.toContain("', '端午请假批次')");
        expect(presenter.parserScript(script).processes[0].workTitle).toBeUndefined();
    });

    it('历史 @SCRIPT_META 无 workTitle 字段时解析不报错且字段为 undefined', () => {
        const presenter = new SubProcessPresenter({value: '', onChange: () => undefined});
        const legacyScript = `
            // @SCRIPT_META {"processes":[{"workId":"legacy","actionId":"submit","operatorId":1,"formData":""}]}
            def run(request){ return request.toCreateRequest() }
        `;

        const result = presenter.parserScript(legacyScript);

        expect(result.processes).toHaveLength(1);
        expect(result.processes[0].workTitle).toBeUndefined();
    });

    it('子流程标题含单引号时转义保证脚本字面量完整', () => {
        let script = '';
        const presenter = new SubProcessPresenter({
            value: '',
            onChange: value => {
                script = value;
            },
        });

        presenter.updateScript({
            processes: [
                {
                    workId: 'leave-child',
                    actionId: 'submit-1',
                    operatorId: 1,
                    workTitle: "端午'批次",
                },
            ],
        });

        expect(script).toContain("'端午\\'批次'");
    });

    it('默认结果脚本应等待本次创建的全部子流程', () => {
        expect(SCRIPT_DEFAULT_SUB_PROCESS_RESULT).toContain('findSubProcessRecords');
        expect(SCRIPT_DEFAULT_SUB_PROCESS_RESULT).toContain('getSubProcessTotal');
    });

    it('自身生成的脚本变更不应判定为外部变更（issue #183：避免输入时表单自动刷新）', () => {
        let emitted = '';
        const presenter = new SubProcessPresenter({
            value: '',
            onChange: value => {
                emitted = value;
            },
        });

        // 初始状态下，任何非空脚本都视为外部变更（需要回填表单）
        expect(presenter.isExternalChange('// @SCRIPT_META {"processes":[]}')).toBe(true);

        // 空值不视为外部变更
        expect(presenter.isExternalChange('')).toBe(false);
        expect(presenter.isExternalChange(undefined)).toBe(false);

        // 自身通过 updateScript 生成脚本后，同一脚本不再视为外部变更
        presenter.updateScript({
            processes: [{workId: 'leave', actionId: 'submit', operatorId: 1}],
        });
        expect(emitted).not.toBe('');
        expect(presenter.isExternalChange(emitted)).toBe(false);

        // 其他脚本（如切换到别的节点配置）仍视为外部变更
        expect(presenter.isExternalChange('// @SCRIPT_META {"processes":[{"workId":"other"}]}')).toBe(true);
    });
});
