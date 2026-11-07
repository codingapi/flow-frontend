import {afterEach, describe, expect, test} from "@rstest/core";
import {cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {ManualView} from "@/plugins/view/manual-view";
import {NodeOption} from "@coding-flow/flow-types";

// antd 的响应式监听在 jsdom 下缺少 matchMedia，这里补齐以免渲染 Select 时报错
if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
}

const options = [
    {id: 'node-1', name: '分支A'},
    {id: 'node-2', name: '分支B'},
] as NodeOption[];

describe.sequential('PC 人工节点选择弹窗（issue #247）', () => {

    afterEach(() => {
        // 清理每一次测试产生的数据
        cleanup();
    });

    test('首次展示可选下级节点', () => {
        render(<ManualView options={options} onChange={() => undefined}/>);

        expect(screen.getByText('请选择下级节点')).toBeTruthy();
        expect(screen.getByText('下级节点')).toBeTruthy();
    });

    test('取消关闭弹窗时回调空值，父组件据此清空可选项，再次点击可通过时弹窗可重新打开', async () => {
        const changes: string[] = [];
        const {unmount} = render(
            <ManualView options={options} onChange={(value) => changes.push(value)}/>
        );

        const closeButton = document.querySelector('.ant-modal-close') as HTMLElement;
        expect(closeButton).toBeTruthy();
        fireEvent.click(closeButton);

        // 取消必须回调空值，父组件 PassAction 依赖该回调执行 setOptions([]) 卸载组件
        await waitFor(() => expect(changes).toEqual(['']));

        // 父组件清空后重新挂载（模拟再次提交后返回可选项），弹窗应重新可见
        unmount();
        render(<ManualView options={options} onChange={() => undefined}/>);
        expect(screen.getByText('请选择下级节点')).toBeTruthy();
    });
});
