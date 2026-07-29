import { ApprovalState, FlowApprovalApi } from "@/typings";
import { FormActionContext, FlowAction } from "@coding-flow/flow-types";
import { ActionInterceptor, ActionInterceptorManager } from "@/interceptor";

export class FlowActionPresenter {

    private readonly api: FlowApprovalApi;
    private readonly formActionContext: FormActionContext;
    private state: ApprovalState;
    private readonly mockKey: string;
    private readonly setLoading: (loading: boolean) => void;
    private readonly interceptorManager: ActionInterceptorManager;

    private submitRecordIds: number[];

    constructor(state: ApprovalState,
        api: FlowApprovalApi,
        formActionContext: FormActionContext,
        mockKey: string,
        setLoading: (loading: boolean) => void) {
        this.state = JSON.parse(JSON.stringify(state));
        this.api = api;
        this.formActionContext = formActionContext;
        this.submitRecordIds = [];
        this.mockKey = mockKey;
        this.setLoading = setLoading;
        this.interceptorManager = new ActionInterceptorManager();
    }


    /**
     * 订阅审批操作拦截器。
     *
     * 所有审批操作按钮（通过/驳回/暂存/加签/委托/退回/转办/自定义）点击后、
     * 真正提交前会依次执行已订阅的拦截器。拦截器支持异步，返回 true 放行、
     * 返回 false 拦截（终止本次操作）。
     *
     * 自定义视图可通过
     * `useApprovalContext().context.getPresenter().getFlowActionPresenter()`
     * 获取本对象后订阅，并在组件卸载时调用返回的函数取消订阅。
     *
     * @param interceptor 拦截器函数
     * @returns 取消订阅函数
     */
    public addActionInterceptor(interceptor: ActionInterceptor): () => void {
        return this.interceptorManager.add(interceptor);
    }

    /**
     * 移除指定审批操作拦截器
     * @param interceptor 待移除的拦截器函数
     */
    public removeActionInterceptor(interceptor: ActionInterceptor): void {
        this.interceptorManager.remove(interceptor);
    }


    public setSubmitRecordIds(submitRecordIds: number[]) {
        this.submitRecordIds = [];
        this.submitRecordIds = submitRecordIds;
    }

    private clearSubmitRecordIds(): void {
        this.submitRecordIds = [];
    }

    public getSubmitRecordIds() {
        return this.submitRecordIds;
    }

    public syncState(state: ApprovalState) {
        this.state = JSON.parse(JSON.stringify(state));
    }

    /**
     * 判断某个动作按钮是否应隐藏（纯函数，单一事实来源）。
     *
     * 规则：动作 id 命中「当前可见按钮集合 actions」则显示（返回 false），
     * 否则隐藏（返回 true）。
     *
     * 视图层应在 render 阶段传入来自响应式 Redux state 的最新 `actions`
     * （即 `state.flow?.actions`），而不是依赖 Presenter 内部快照，
     * 以避免 syncState（effect 中执行）滞后于 render 导致的按钮整体不渲染问题。
     *
     * @param actions 当前可见的动作按钮集合
     * @param actionId 待判断的动作 ID
     */
    public static isActionHidden(actions: FlowAction[], actionId: string): boolean {
        return !actions.some((action) => action.id === actionId);
    }

    public async processNodes() {
        const formData = this.formActionContext.save() as any;
        const recordId = formData.recordId || this.state.flow?.recordId;
        if (formData.recordId) {
            delete formData.recordId;
        }

        const id = recordId || this.state.flow?.workCode || '';
        return await this.api.processNodes({
            id,
            formData,
        }, this.mockKey);
    }


    /**
     * 是否通过操作
     * @param actionId
     * @private
     */
    private isPassAction(actionId: string) {
        const actions = this.state.flow?.actions || [];
        for (const action of actions) {
            if (action.id === actionId) {
                if (action.type === 'PASS') {
                    return true;
                }
                if (action.type === 'CUSTOM') {
                    const triggerType = action.triggerType;
                    if (triggerType === 'PASS') {
                        return true;
                    }
                }
            }
        }
        return false;
    }


    public getAction(actionId: string) {
        const actions = this.state.flow?.actions || [];
        for (const action of actions) {
            if (action.id === actionId) {
                return action;
            }
        }
        return null;
    }


    /**
     * 构建审批动作的上下文数据，供下游消息模板使用。
     * 将所有可访问的状态打包为纯数据对象，下游自行决定如何组织提示信息。
     */
    public buildActionContext(actionId?: string) {
        const flow = this.state.flow;
        const action = actionId ? this.getAction(actionId) : null;
        return {
            flowName: flow?.workTitle ?? '',
            workCode: flow?.workCode ?? '',
            recordId: flow?.recordId ?? null,
            isStartNode: !flow?.recordId,
            actionName: action?.title ?? '',
            nodeType: flow?.nodeType ?? '',
            nodeName: flow?.nodeName ?? '',
            currentOperator: flow?.currentOperator?.name ?? '',
            createOperator: flow?.createOperator?.name ?? '',
            flowState: flow?.flowState ?? 0,
            recordState: flow?.recordState ?? 0,
            title: flow?.title ?? '',
        };
    }


    private async submitAction(actionId: string, formData: any, params?: any) {
        const recordId = formData.recordId || this.state.flow?.recordId;
        const workCode = this.state.flow?.workCode || '';

        if (formData.recordId) {
            delete formData.recordId;
        }

        if (recordId) {
            const request = {
                formData,
                recordId,
                advice: {
                    actionId,
                    ...params
                }
            }
            return await this.api.action(request, this.mockKey);
        } else {
            const createRequest = {
                workCode,
                formData,
                actionId,
            }
            const recordId = await this.api.create(createRequest, this.mockKey);
            console.log('create recordId:', recordId);
            if (recordId) {
                if (this.state.flow) {
                    this.state.flow.recordId = recordId;
                }
                const actionRequest = {
                    formData,
                    recordId,
                    advice: {
                        actionId,
                        ...params
                    }
                }
                return await this.api.action(actionRequest, this.mockKey);
            }
        }
    }

    public getCurrentFormData() {
        return this.formActionContext.save();
    }

    private async executeAction(actionId: string, params?: any) {
        let formData;
        if (this.isPassAction(actionId)) {
            formData = await this.formActionContext.validate();
        } else {
            formData = this.formActionContext.save();
        }
        return await this.submitAction(actionId, formData, params);
    }


    private getFormDataByRecordId(recordId: number) {
        const todoList = this.state.flow?.todos || [];
        for (const item of todoList) {
            if (item.recordId === recordId) {
                return {
                    ...item.data,
                    recordId
                };
            }
        }
        return null;
    }

    public async revoke() {
        this.setLoading(true);
        try {
            const recordId = this.state.flow?.recordId;
            if (recordId) {
                return await this.api.revoke(recordId, this.mockKey);
            }
        } finally {
            this.setLoading(false);
        }
    }

    public async urge() {
        this.setLoading(true);
        try {
            const recordId = this.state.flow?.recordId;
            if (recordId) {
                return await this.api.urge(recordId, this.mockKey);
            }
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * 执行已订阅的审批操作拦截器。
     *
     * 按订阅顺序依次执行（支持异步），任一拦截器返回 false 即短路并返回 false。
     * 除由 action() 在提交前自动调用外，不涉及服务端提交的操作入口
     * （如配置了 triggerFrontEvent 的自定义按钮）也应手动调用本方法，
     * 以保证「点击即拦截」的一致语义。
     *
     * @param actionId 动作 ID
     * @param params 动作附加参数
     * @returns 全部放行返回 true；任一拦截返回 false
     */
    public async interceptAction(actionId: string, params?: any): Promise<boolean> {
        return await this.interceptorManager.intercept({
            actionId,
            action: this.getAction(actionId),
            params,
        });
    }

    public async action(actionId: string, params?: any) {
        // 提交前执行已订阅的拦截器，任一拦截器返回 false 则终止本次操作
        const passed = await this.interceptAction(actionId, params);
        if (!passed) {
            return {
                success: false,
                intercepted: true,
            };
        }

        this.setLoading(true);
        try {
            // 流程合并审批
            const mergeable = this.state.flow?.mergeable || false;
            const submitRecordIds = this.submitRecordIds;
            if (mergeable && submitRecordIds.length > 0) {
                const submitRecordIds = this.submitRecordIds;
                for (const recordId of submitRecordIds) {
                    const formData = this.getFormDataByRecordId(recordId);
                    await this.submitAction(actionId, formData, params);
                }
                this.clearSubmitRecordIds();
                return new Promise((resolve) => {
                    resolve({
                        success: true,
                    });
                })
            } else {
                return await this.executeAction(actionId, params);
            }
        } finally {
            this.setLoading(false);
        }
    }

}