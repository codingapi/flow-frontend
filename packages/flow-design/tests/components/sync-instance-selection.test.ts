import {describe, expect, it} from "@rstest/core";
import {toProcessIds} from "@/components/design-sync-instance/selection";
import type {RunningInstanceItem} from "@/api/workflow";

/**
 * 运行中实例强制同步（后端 issue #281）
 *
 * 选择弹窗按「开始节点记录」代表一个流程实例，提交时只传流程id；
 * 跨页勾选可能重复返回同一实例，需要去重并过滤空值。
 */
describe('强制同步实例选择', () => {

    const row = (processId: string): RunningInstanceItem => ({
        processId,
        recordId: 1,
    });

    it('应返回选中实例的流程id', () => {
        // when
        const processIds = toProcessIds([row('p1'), row('p2')]);

        // then
        expect(processIds).toEqual(['p1', 'p2']);
    });

    it('应对重复的流程id去重', () => {
        // when
        const processIds = toProcessIds([row('p1'), row('p1'), row('p2')]);

        // then
        expect(processIds).toEqual(['p1', 'p2']);
    });

    it('应过滤空流程id', () => {
        // when
        const processIds = toProcessIds([row(''), row('p1')]);

        // then
        expect(processIds).toEqual(['p1']);
    });

    it('未选择时应返回空数组', () => {
        // when
        const processIds = toProcessIds([]);

        // then
        expect(processIds).toEqual([]);
    });
});
