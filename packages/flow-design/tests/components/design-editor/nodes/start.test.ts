import {describe, expect, it} from '@rstest/core';
import {StartNodeRegistry} from '@/components/design-editor/nodes/start';

describe('StartNodeRegistry', () => {
    it('开始节点标题应允许编辑（issue #181）', () => {
        expect(StartNodeRegistry.meta?.editTitleDisable).not.toBe(true);
    });

    it('开始节点其余能力限制应保持不变', () => {
        expect(StartNodeRegistry.meta?.isStart).toBe(true);
        expect(StartNodeRegistry.meta?.deleteDisable).toBe(true);
        expect(StartNodeRegistry.meta?.copyDisable).toBe(true);
        expect(StartNodeRegistry.meta?.addDisable).toBe(true);
    });
});
