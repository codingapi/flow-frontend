import {describe, expect, it} from '@rstest/core';
import {
    buildOperatorInitialValues,
    hasOperatorCountLimit,
    isSingleOperatorMode,
    normalizeOperatorIds,
} from '@/utils/operator-count';
import {NodeOption} from '@coding-flow/flow-types';

const buildOption = (overrides: Partial<NodeOption> = {}): NodeOption => ({
    id: 'node-1',
    name: '审批节点',
    type: 'approval',
    display: true,
    ...overrides,
});

describe('normalizeOperatorIds', () => {

    it('数组输入返回相同 id 数组', () => {
        expect(normalizeOperatorIds([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('逗号分隔字符串输入解析为 id 数组', () => {
        expect(normalizeOperatorIds('1,2,3')).toEqual([1, 2, 3]);
    });

    it('容忍字符串中的空格', () => {
        expect(normalizeOperatorIds('1, 2 , 3')).toEqual([1, 2, 3]);
    });

    it('过滤非数字片段', () => {
        expect(normalizeOperatorIds('1,a,3')).toEqual([1, 3]);
    });

    it('单个数字输入解析为单元素数组', () => {
        expect(normalizeOperatorIds(5)).toEqual([5]);
    });

    it('空值返回空数组', () => {
        expect(normalizeOperatorIds('')).toEqual([]);
        expect(normalizeOperatorIds(undefined)).toEqual([]);
        expect(normalizeOperatorIds(null)).toEqual([]);
    });
});

describe('buildOperatorInitialValues', () => {

    it('无可选范围时不生成初始值', () => {
        const values = buildOperatorInitialValues([buildOption()]);
        expect(values).toEqual({});
    });

    it('无数量限制时默认全选', () => {
        const option = buildOption({
            operators: [
                {userId: 1, name: '张三', flowManager: false},
                {userId: 2, name: '李四', flowManager: false},
            ],
        });
        const values = buildOperatorInitialValues([option]);
        expect(values['node-1']).toEqual([1, 2]);
    });

    it('maxOperatorCount 为 1 时预填单值（单选）', () => {
        const option = buildOption({
            maxOperatorCount: 1,
            operators: [
                {userId: 1, name: '张三', flowManager: false},
                {userId: 2, name: '李四', flowManager: false},
            ],
        });
        const values = buildOperatorInitialValues([option]);
        expect(values['node-1']).toEqual(1);
    });

    it('maxOperatorCount 小于可选人数时截断', () => {
        const option = buildOption({
            maxOperatorCount: 2,
            operators: [
                {userId: 1, name: '张三', flowManager: false},
                {userId: 2, name: '李四', flowManager: false},
                {userId: 3, name: '王五', flowManager: false},
            ],
        });
        const values = buildOperatorInitialValues([option]);
        expect(values['node-1']).toEqual([1, 2]);
    });

    it('maxOperatorCount 大于可选人数时保持全选', () => {
        const option = buildOption({
            maxOperatorCount: 5,
            operators: [
                {userId: 1, name: '张三', flowManager: false},
                {userId: 2, name: '李四', flowManager: false},
            ],
        });
        const values = buildOperatorInitialValues([option]);
        expect(values['node-1']).toEqual([1, 2]);
    });
});

describe('isSingleOperatorMode / hasOperatorCountLimit', () => {

    it('maxOperatorCount 为 1 时单选', () => {
        expect(isSingleOperatorMode(1)).toBe(true);
        expect(isSingleOperatorMode(2)).toBe(false);
        expect(isSingleOperatorMode(-1)).toBe(false);
        expect(isSingleOperatorMode(undefined)).toBe(false);
    });

    it('maxOperatorCount 非负数时限制数量', () => {
        expect(hasOperatorCountLimit(1)).toBe(true);
        expect(hasOperatorCountLimit(0)).toBe(true);
        expect(hasOperatorCountLimit(-1)).toBe(false);
        expect(hasOperatorCountLimit(undefined)).toBe(false);
    });
});