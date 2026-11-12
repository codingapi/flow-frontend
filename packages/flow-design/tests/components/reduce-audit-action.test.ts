import { describe, expect, it } from "@rstest/core";
import { ActionFactory } from "@/script-components/components/action/components/factory";

/**
 * 减签动作配置（后端 issue #266 / 前端 issue-72）
 *
 * 设计器动作列表依赖 actionOptions 展示类型名称，配置弹窗依赖 ActionFactory 选择表单。
 */
describe('设计器减签动作', () => {

    it('REDUCE_AUDIT 应映射到减签动作表单', () => {
        // when
        const form = ActionFactory.getInstance().getActionForm('REDUCE_AUDIT');

        // then
        expect(form).toBeTruthy();
    });

    it('未注册的动作类型应返回 undefined', () => {
        // when
        const form = ActionFactory.getInstance().getActionForm('UNKNOWN_ACTION' as never);

        // then
        expect(form).toBeUndefined();
    });
});
