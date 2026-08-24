import {describe, expect, it} from '@rstest/core';
import {
    normalizeResettable,
    normalizeShowParentProcessRecords
} from '@/components/design-editor/node-components/strategy/sub-process';

describe('SubProcessStrategy', () => {
    it('历史节点未配置时默认关闭主流程记录展示', () => {
        expect(normalizeShowParentProcessRecords(undefined)).toBe(false);
    });

    it('显式开启时允许展示主流程记录', () => {
        expect(normalizeShowParentProcessRecords(true)).toBe(true);
    });

    it('历史节点未配置时默认关闭子流程重置能力', () => {
        expect(normalizeResettable(undefined)).toBe(false);
    });

    it('显式开启时允许重置子流程', () => {
        expect(normalizeResettable(true)).toBe(true);
    });
});
