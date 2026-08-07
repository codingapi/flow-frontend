import {afterEach, describe, expect, test} from "@rstest/core";
import {cleanup, render, screen} from "@testing-library/react";
import {ResizableModal} from "@/components/flow-approval/components/resizable-modal";

describe.sequential('ResizableModal 审批弹框', () => {

    afterEach(() => {
        // 清理每一次测试产生的数据
        cleanup();
    });

    test('默认宽度为 640px（比 antd 默认 520 更宽）', () => {
        render(
            <ResizableModal open title="审批通过">
                <div>审批意见</div>
            </ResizableModal>
        );

        const modal = document.querySelector('.ant-modal') as HTMLElement;
        expect(modal).toBeTruthy();
        expect(modal.style.width).toEqual('640px');
        expect(screen.getByText('审批通过')).toBeTruthy();
    });

    test('支持自定义宽度透传', () => {
        render(
            <ResizableModal open width={800} title="请选择操作人">
                <div>内容</div>
            </ResizableModal>
        );

        const modal = document.querySelector('.ant-modal') as HTMLElement;
        expect(modal.style.width).toEqual('800px');
    });

    test('弹框支持拖拽调整宽高（resize）', () => {
        render(
            <ResizableModal open title="审批通过">
                <div>内容</div>
            </ResizableModal>
        );

        const modal = document.querySelector('.ant-modal') as HTMLElement;
        expect(modal.style.resize).toEqual('both');
        expect(modal.style.overflow).toEqual('auto');
        expect(modal.style.minWidth).toEqual('480px');
        expect(modal.style.minHeight).toEqual('320px');
    });
});