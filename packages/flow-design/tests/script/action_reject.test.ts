import {describe, expect, it} from '@rstest/core';
import {ActionRejectScriptUtils} from '@/script-components/services/action-reject';

describe('ActionRejectScriptUtils', () => {
    it('生成的拒绝脚本应包含可回显的脚本元数据', () => {
        const script = ActionRejectScriptUtils.update({label: '发起节点', value: 'start-node'});

        expect(script).toContain('def run');
        expect(ActionRejectScriptUtils.getType(script)).toBe('start-node');
    });

    it('应识别脚本字段中存放的是正文而非脚本key（兼容历史数据）', () => {
        const script = ActionRejectScriptUtils.update({label: '终止流程', value: 'TERMINATE'});

        // 设计器写入的脚本正文需要被识别为内联脚本，避免被当成脚本key提交
        expect(ActionRejectScriptUtils.isInlineScript(script)).toBe(true);
        // 后端正常保存的脚本key不包含换行与def run
        expect(ActionRejectScriptUtils.isInlineScript('script-20261030-abcdef')).toBe(false);
        expect(ActionRejectScriptUtils.isInlineScript(undefined)).toBe(false);
    });
});