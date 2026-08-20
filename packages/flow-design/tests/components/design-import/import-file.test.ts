import {describe, expect, it} from '@rstest/core';
import {
    readImportWorkflowCode,
    readImportWorkflowInfo,
    validateResetImportCode
} from '@/components/design-import/import-file';

const toDataUrl = (value: unknown): string => {
    const json = JSON.stringify(value);
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
    });
    return `data:application/json;base64,${globalThis.btoa(binary)}`;
};

describe('流程导入文件编码校验', () => {
    it('读取包含多版本和脚本资源的V1迁移包编码', () => {
        const file = toDataUrl({
            format: 'flow-engine-workflow',
            schemaVersion: 1,
            workflow: {
                code: 'expense-approval',
                title: '费用审批流程',
                currentVersion: 'v3.0'
            },
            versions: [
                {versionName: 'v1.0', nodes: [{id: 'start'}, {id: 'approval-a'}]},
                {versionName: 'v2.0', nodes: [{id: 'start'}, {id: 'condition'}, {id: 'approval-b'}]},
                {versionName: 'v3.0', nodes: [{id: 'start'}, {id: 'parallel'}, {id: 'end'}]}
            ],
            groovyScripts: {
                'script-condition': 'def run(request) { return true }',
                'script-operator': 'def run(request) { return [1L] }'
            }
        });

        expect(readImportWorkflowInfo(file)).toEqual({
            code: 'expense-approval',
            title: '费用审批流程'
        });
        expect(readImportWorkflowCode(file)).toBe('expense-approval');
        expect(validateResetImportCode(file, 'expense-approval')).toBe('expense-approval');
    });

    it('兼容读取历史单流程文件编码', () => {
        const file = toDataUrl({
            id: 'workflow-1',
            code: 'legacy-leave',
            title: '历史请假流程',
            nodes: [{id: 'start'}, {id: 'approval'}, {id: 'end'}]
        });

        expect(readImportWorkflowInfo(file)).toEqual({
            code: 'legacy-leave',
            title: '历史请假流程'
        });
    });

    it('拒绝使用不同流程编码执行重置导入', () => {
        const file = toDataUrl({
            format: 'flow-engine-workflow',
            schemaVersion: 1,
            workflow: {code: 'source-workflow'},
            versions: [{versionName: 'v1.0'}],
            groovyScripts: {}
        });

        expect(() => validateResetImportCode(file, 'current-workflow'))
            .toThrow('导入流程编码“source-workflow”与当前流程编码“current-workflow”不一致');
    });
});
