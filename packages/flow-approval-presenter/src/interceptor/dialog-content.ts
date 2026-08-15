import { FlowAction } from "@coding-flow/flow-types";
import React from "react";

/**
 * 审批弹框内容覆盖结果。
 *
 * 提供器可选择性返回 title / content 以覆盖默认弹框的标题与中间内容；
 * 未提供的字段仍使用默认渲染（title 用各动作组件的默认标题，content 用审批意见框/签名表单）。
 */
export interface DialogContent {
    /** 弹框标题（缺省用动作组件的默认标题，如「审批通过」） */
    title?: React.ReactNode;
    /** 弹框中间内容（提供后整块替换默认表单区域，确定按钮直接提交） */
    content?: React.ReactNode;
}

/**
 * 审批弹框内容提供器执行上下文。
 *
 * 与 {@link ActionInterceptorContext} 对齐，仅提供 actionId 与 action 对象：
 * - 按 actionId 匹配：适合对单个按钮定制（区分两个同为 CUSTOM 的自定义按钮）；
 * - 按 actionType 匹配：通过 `context.action?.type` 判断，适合对所有同类型按钮统一定制。
 */
export interface DialogContentProviderContext {
    /** 触发的动作 ID */
    actionId: string;
    /** 触发的动作对象（未找到时为 null） */
    action: FlowAction | null;
}

/**
 * 审批弹框内容提供器。
 *
 * 返回 DialogContent 表示覆盖；返回 null / undefined 表示不覆盖（使用默认渲染）。
 * 支持同步与异步（返回 DialogContent 或 Promise<DialogContent | null | undefined>）。
 */
export type DialogContentProvider = (
    context: DialogContentProviderContext
) => DialogContent | null | undefined | Promise<DialogContent | null | undefined>;

/**
 * 审批弹框内容提供器管理器。
 *
 * 通过订阅方式注册提供器，按订阅顺序依次执行，首个返回非 null 内容者命中并短路。
 * 典型用法：自定义视图通过
 * `useApprovalContext().context.getPresenter().getFlowActionPresenter()` 获取 Presenter，
 * 调用 `addDialogContentProvider(provider)` 订阅，返回的函数用于取消订阅。
 */
export class DialogContentManager {

    private providers: DialogContentProvider[] = [];

    /**
     * 订阅内容提供器
     * @param provider 提供器函数
     * @returns 取消订阅函数
     */
    public add(provider: DialogContentProvider): () => void {
        this.providers.push(provider);
        return () => {
            this.remove(provider);
        };
    }

    /**
     * 移除指定提供器
     * @param provider 待移除的提供器函数
     */
    public remove(provider: DialogContentProvider): void {
        const index = this.providers.findIndex(item => item === provider);
        if (index !== -1) {
            this.providers.splice(index, 1);
        }
    }

    /**
     * 清空全部提供器
     */
    public clear(): void {
        this.providers = [];
    }

    /**
     * 当前订阅的提供器数量
     */
    public size(): number {
        return this.providers.length;
    }

    /**
     * 按订阅顺序依次执行所有提供器（支持异步）。
     * 首个返回非 null 内容者命中并立即返回；全部未命中返回 null。
     * @param context 提供器上下文
     * @returns 命中的内容；未命中返回 null
     */
    public async resolve(context: DialogContentProviderContext): Promise<DialogContent | null> {
        for (const provider of this.providers) {
            const content = await provider(context);
            if (content != null) {
                return content;
            }
        }
        return null;
    }

}