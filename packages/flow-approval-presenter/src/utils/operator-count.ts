import {NodeOption} from "@coding-flow/flow-types";

/**
 * 将选人表单值归一化为 userId 数组：
 * 兼容数组（多选/单选组件）与文本输入（逗号分隔字符串）
 */
export const normalizeOperatorIds = (val: unknown): number[] => {
    if (Array.isArray(val)) {
        return val.map(Number).filter(n => !isNaN(n));
    }
    if (val == null || val === '') {
        return [];
    }
    return String(val)
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(Number)
        .filter(n => !isNaN(n));
};

/**
 * 有可选范围时默认全选；存在数量限制时截断到 maxOperatorCount。
 * 单选模式（maxOperatorCount === 1）预填单个值，多选模式预填数组。
 */
export const buildOperatorInitialValues = (options: NodeOption[]): Record<string, any> => {
    return options.reduce<Record<string, any>>((acc, option) => {
        if (option.operators && option.operators.length > 0) {
            let ids = option.operators.map(o => o.userId);
            const maxCount = option.maxOperatorCount ?? -1;
            if (maxCount >= 0 && ids.length > maxCount) {
                ids = ids.slice(0, maxCount);
            }
            acc[option.id] = isSingleOperatorMode(option.maxOperatorCount) ? ids[0] : ids;
        }
        return acc;
    }, {});
};

/**
 * 最大可选人数是否为单选模式（1 表示单选）
 */
export const isSingleOperatorMode = (maxOperatorCount?: number): boolean => {
    return (maxOperatorCount ?? -1) === 1;
};

/**
 * 当前选人场景是否限制了可选人数（maxOperatorCount >= 0，且缺省视为不限制）
 */
export const hasOperatorCountLimit = (maxOperatorCount?: number): boolean => {
    return (maxOperatorCount ?? -1) >= 0;
};