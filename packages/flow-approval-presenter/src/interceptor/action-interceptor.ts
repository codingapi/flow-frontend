import { FlowAction } from "@coding-flow/flow-types";

/**
 * 审批动作拦截器执行上下文
 */
export interface ActionInterceptorContext {
    /** 触发的动作 ID */
    actionId: string;
    /** 触发的动作对象（未找到时为 null） */
    action: FlowAction | null;
    /** 动作附加参数 */
    params?: any;
}

/**
 * 审批动作拦截器。
 *
 * 返回 true（或 resolve 为 true 的 Promise）表示放行，继续执行后续审批流程；
 * 返回 false（或 resolve 为 false 的 Promise）表示拦截，终止本次操作。
 * 支持同步与异步执行。
 */
export type ActionInterceptor = (context: ActionInterceptorContext) => boolean | Promise<boolean>;

/**
 * 审批动作拦截器管理器。
 *
 * 通过订阅方式注册拦截器，在所有审批操作按钮点击后、真正提交前依次执行。
 * 典型用法：自定义视图通过
 * `useApprovalContext().context.getPresenter().getFlowActionPresenter()` 获取 Presenter，
 * 调用 `addActionInterceptor(interceptor)` 订阅，返回的函数用于取消订阅。
 */
export class ActionInterceptorManager {

    private interceptors: ActionInterceptor[] = [];

    /**
     * 订阅拦截器
     * @param interceptor 拦截器函数
     * @returns 取消订阅函数
     */
    public add(interceptor: ActionInterceptor): () => void {
        this.interceptors.push(interceptor);
        return () => {
            this.remove(interceptor);
        };
    }

    /**
     * 移除指定拦截器
     * @param interceptor 待移除的拦截器函数
     */
    public remove(interceptor: ActionInterceptor): void {
        const index = this.interceptors.findIndex(item => item === interceptor);
        if (index !== -1) {
            this.interceptors.splice(index, 1);
        }
    }

    /**
     * 清空全部拦截器
     */
    public clear(): void {
        this.interceptors = [];
    }

    /**
     * 当前订阅的拦截器数量
     */
    public size(): number {
        return this.interceptors.length;
    }

    /**
     * 按订阅顺序依次执行所有拦截器（支持异步）。
     * 任一拦截器返回 false 时立即短路，不再执行后续拦截器。
     * @param context 拦截器上下文
     * @returns 全部放行返回 true；任一拦截返回 false
     */
    public async intercept(context: ActionInterceptorContext): Promise<boolean> {
        for (const interceptor of this.interceptors) {
            const pass = await interceptor(context);
            if (!pass) {
                return false;
            }
        }
        return true;
    }

}
