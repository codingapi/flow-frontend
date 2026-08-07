import {afterEach, describe, expect, test} from "@rstest/core";
import {cleanup, render, screen} from "@testing-library/react";
import {FlowApprovalOperator} from "@coding-flow/flow-types";
import {FlowOperatorItem} from "@/components/flow-approval/components/flow-time-node";

const createOperator = (overrides: Partial<FlowApprovalOperator> = {}): FlowApprovalOperator => ({
    advice: '',
    signKey: '',
    approveTime: 0,
    actionName: '',
    actionType: '',
    flowOperator: {userId: 1, name: '张三', flowManager: false},
    ...overrides,
});

describe.sequential('PC 审批记录操作人展示（自动跳过）', () => {

    afterEach(() => {
        // 清理每一次测试产生的数据
        cleanup();
    });

    test('autoSkip 记录展示为自动跳过，不展示审批时间与动作', () => {
        render(
            <FlowOperatorItem
                operator={createOperator({autoSkip: true, approveTime: 1700000000000, actionName: '通过'})}
                approveState="PASS"
            />
        );

        expect(screen.getByText('自动跳过: 张三')).toBeTruthy();
        expect(screen.queryByText(/通过/)).toBeNull();
    });

    test('autoSkip 缺省（旧数据）时按实际审批人展示', () => {
        render(
            <FlowOperatorItem
                operator={createOperator({approveTime: 1700000000000, actionName: '通过'})}
                approveState="PASS"
            />
        );

        expect(screen.getByText(/审批人: 张三/)).toBeTruthy();
        expect(screen.getByText(/通过/)).toBeTruthy();
    });

    test('autoSkip=false 的真实审批记录仍展示审批信息', () => {
        render(
            <FlowOperatorItem
                operator={createOperator({autoSkip: false, approveTime: 1700000000000, actionName: '同意'})}
                approveState="PASS"
            />
        );

        expect(screen.getByText(/审批人: 张三/)).toBeTruthy();
        expect(screen.getByText(/同意/)).toBeTruthy();
    });
});