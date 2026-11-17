import type {RunningInstanceItem} from "@/api/workflow";

/**
 * 汇总选中实例的流程id。
 *
 * <p>跨页勾选时 antd Table 会返回多行数据（同一实例以开始节点记录代表一行），
 * 这里按 processId 去重并过滤空值，避免重复提交同一实例。</p>
 */
export const toProcessIds = (rows: RunningInstanceItem[]): string[] => {
    const processIds = rows
        .map((row) => row.processId)
        .filter((processId): processId is string => !!processId);
    return Array.from(new Set(processIds));
}
