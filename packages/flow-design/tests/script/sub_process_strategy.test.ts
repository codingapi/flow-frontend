import {describe, expect, it} from '@rstest/core';
import {normalizeShowParentProcessRecords} from '@/components/design-editor/node-components/strategy/sub-process';

describe('SubProcessStrategy', () => {
    it('历史节点未配置时默认关闭主流程记录展示', () => {
        expect(normalizeShowParentProcessRecords(undefined)).toBe(false);
    });

    it('显式开启时允许展示主流程记录', () => {
        expect(normalizeShowParentProcessRecords(true)).toBe(true);
    });
});
