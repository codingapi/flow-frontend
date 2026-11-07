import {afterEach, describe, expect, test} from "@rstest/core";
import {cleanup, render} from "@testing-library/react";
import {CustomStyleButton} from "@/components/flow-approval/components/custom-style-button";

describe.sequential('移动端 CustomStyleButton 审批按钮样式', () => {

    afterEach(() => {
        cleanup();
    });

    test('按钮名称优先取动作标题，与 PC 端保持一致', () => {
        const {container} = render(
            <CustomStyleButton
                title="同意"
                display={{title: '通过', style: '', icon: ''}}
                onClick={() => undefined}
            />
        );

        expect(container.textContent).toEqual('同意');
    });

    test('display.style 中的颜色应渲染为带 # 的 CSS 颜色', () => {
        const {container} = render(
            <CustomStyleButton
                title="通过"
                display={{title: '通过', style: JSON.stringify({backgroundColor: '1677ff'}), icon: ''}}
                onClick={() => undefined}
            />
        );

        const button = container.querySelector('.adm-button') as HTMLButtonElement;
        expect(button).toBeTruthy();
        expect(button.style.backgroundColor).toEqual('rgb(22, 119, 255)');
    });

    test('display.style 非法时不应抛异常', () => {
        const {container} = render(
            <CustomStyleButton
                title="通过"
                display={{title: '通过', style: 'primary', icon: ''}}
                onClick={() => undefined}
            />
        );

        expect(container.textContent).toEqual('通过');
    });
});
