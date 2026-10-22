import {describe, expect, it} from '@rstest/core';
import {RouterNodeRegistry} from '@/components/design-editor/nodes/router';

describe('RouterNodeRegistry', () => {
    it('路由节点不再限制只能添加到条件分支下（issue #230）', () => {
        // 节点列表以 registry.canAdd?.(...) ?? true 判断是否可添加，
        // 未实现 canAdd 即表示任意可添加节点处均可添加路由节点
        expect(RouterNodeRegistry.canAdd).toBeUndefined();
    });

    it('路由节点其余能力限制应保持不变', () => {
        expect(RouterNodeRegistry.meta?.copyDisable).toBe(true);
        expect(RouterNodeRegistry.meta?.addDisable).toBe(false);
        expect(RouterNodeRegistry.meta?.expandable).toBe(false);
    });
});