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

    it('默认结果脚本应等待本次创建的全部子流程', () => {
        expect(SCRIPT_DEFAULT_SUB_PROCESS_RESULT).toContain('findSubProcessRecords');
        expect(SCRIPT_DEFAULT_SUB_PROCESS_RESULT).toContain('getSubProcessTotal');
    });
});
