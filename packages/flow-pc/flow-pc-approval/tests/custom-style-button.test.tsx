import {afterEach, describe, expect, test} from "@rstest/core";
import {cleanup, render} from "@testing-library/react";
import {CustomStyleButton} from "@/components/flow-approval/components/custom-style-button";
import {FlowActionDisplay} from "@coding-flow/flow-types";

const buildDisplay = (style?: string): FlowActionDisplay => ({
    title: '通过',
    style: style as string,
    icon: '',
});

describe.sequential('CustomStyleButton 审批按钮样式', () => {

    afterEach(() => {
        cleanup();
    });

    test('display.style 中的颜色应渲染为带 # 的 CSS 颜色', () => {
        const {container} = render(
            <CustomStyleButton
                title="通过"
                display={buildDisplay(JSON.stringify({backgroundColor: '1677ff', borderColor: 'ff4d4f'}))}
                onClick={() => undefined}
            />
        );

        const button = container.querySelector('button') as HTMLButtonElement;
        expect(button).toBeTruthy();
        expect(button.style.backgroundColor).toEqual('rgb(22, 119, 255)');
        expect(button.style.borderColor).toEqual('rgb(255, 77, 79)');
    });

    test('display.style 非法时不应抛异常，按无自定义样式渲染', () => {
        const {container} = render(
            <CustomStyleButton
                title="通过"
                display={buildDisplay('primary')}
                onClick={() => undefined}
            />
        );

        const button = container.querySelector('button') as HTMLButtonElement;
        expect(button).toBeTruthy();
        expect(button.style.backgroundColor).toEqual('');
    });

    test('未传 display 时使用按钮名称渲染，不抛异常', () => {
        const {container} = render(
            <CustomStyleButton
                title="通过"
                onClick={() => undefined}
            />
        );

        const button = container.querySelector('button') as HTMLButtonElement;
        // antd 会在两个中文字符之间插入空格，此处忽略空白字符
        expect(button.textContent?.replace(/\s+/g, '')).toEqual('通过');
    });
});
