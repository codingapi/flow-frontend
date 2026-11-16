import { FlowContent } from "@coding-flow/flow-types";

/**
 * 退回节点下拉选项
 */
export interface ReturnNodeOption {
    label: string;
    value: string;
}

/**
 * 构建退回候选节点。
 *
 * <p>优先使用后端 `backNodes`：它只包含当前记录真实执行过的历史节点，并已按“最近优先”排序
 * （例如停留在 C 节点时为 B、A），避免从流程定义的全量节点 `nodes` 中截取时把未走过、
 * 甚至位于当前节点之后的节点也列出来（issue #270）。</p>
 *
 * <p>`backNodes` 为空数组表示明确没有可退回节点（如开始节点），此时不再回退；
 * 只有旧版后端完全不下发该字段时才回退到原有“按定义顺序截取到当前节点”的兼容逻辑。</p>
 *
 * @param flow 流程详情内容
 * @returns 退回候选节点选项，最近优先
 */
export const buildReturnNodeOptions = (flow?: FlowContent): ReturnNodeOption[] => {
    if (!flow) {
        return [];
    }
    if (flow.backNodes) {
        return flow.backNodes.map(node => ({
            label: node.name,
            value: node.id,
        }));
    }
    const options: ReturnNodeOption[] = [];
    for (const node of flow.nodes || []) {
        if (node.id === flow.nodeId) {
            break;
        }
        if (node.display) {
            options.push({
                label: node.name,
                value: node.id,
            });
        }
    }
    return options;
};
