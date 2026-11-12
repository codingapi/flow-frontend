import { ApprovalState, FlowApprovalApi } from "@/typings";
import { FormActionContext, FlowAction, FlowSubProcessResetRequest } from "@coding-flow/flow-types";
import {
    ActionInterceptor,
    ActionInterceptorManager,
    AdvicePolicyManager,
    AdvicePolicyProvider,
    DialogContent,
    DialogContentManager,
    DialogContentProvider,
    mergeAdvicePolicy,
    ResolvedAdvicePolicy,
} from "@/interceptor";

export class FlowActionPresenter {

    private readonly api: FlowApprovalApi;
    private readonly formActionContext: FormActionContext;
    private state: ApprovalState;
    private readonly mockKey: string;
    private readonly setLoading: (loading: boolean) => void;
    private readonly interceptorManager: ActionInterceptorManager;
    private readonly dialogContentManager: DialogContentManager;
    private readonly advicePolicyManager: AdvicePolicyManager;

    private submitRecordIds: number[];

    /**
     * 发起流程（create）成功后创建的记录 ID。
     *
     * 背景：发起流程时前端先 create 再立即 action。若仅修改 presenter 内部快照
     * （this.state.flow.recordId），后续 Redux state 变化触发的 syncState 会用
     * 未含 recordId 的 Redux state 覆盖内部快照，导致选人后再次提交时重复走
     * create 分支，产生重复的流程记录（issue-195 双待办问题）。
     * 该字段为 presenter 实例级持久状态，不受 syncState 覆盖影响。
     */
    private createdRecordId: number | null = null;

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
        this.dialogContentManager = new DialogContentManager();
        this.advicePolicyManager = new AdvicePolicyManager();
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

    /**
     * 订阅审批弹框内容提供器。
     *
     * 各审批操作按钮弹框渲染时，会通过 {@link resolveDialogContent} 触发已订阅的提供器，
     * 首个返回非 null 内容的提供器命中，用于覆盖弹框标题与中间内容
     * （典型场景：隐藏审批意见后弹框退化为确认框，定制确认文案）。
     *
     * 自定义视图可通过
     * `useApprovalContext().context.getPresenter().getFlowActionPresenter()`
     * 获取本对象后订阅，并在组件卸载时调用返回的函数取消订阅。
     *
     * @param provider 内容提供器函数
     * @returns 取消订阅函数
     */
    public addDialogContentProvider(provider: DialogContentProvider): () => void {
        return this.dialogContentManager.add(provider);
    }

    /**
     * 移除指定审批弹框内容提供器
     * @param provider 待移除的内容提供器函数
     */
    public removeDialogContentProvider(provider: DialogContentProvider): void {
        this.dialogContentManager.remove(provider);
    }

    /**
     * 解析指定动作的弹框内容。
     *
     * 按订阅顺序执行内容提供器，首个命中者返回；未命中返回 null（使用默认渲染）。
     * 上下文携带 actionId 与 action 对象（含 type），由提供器内部选择过滤键。
     *
     * @param actionId 动作 ID
     * @returns 命中的弹框内容；未命中返回 null
     */
    public async resolveDialogContent(actionId: string): Promise<DialogContent | null> {
        const action = this.getAction(actionId);
        return await this.dialogContentManager.resolve({
            actionId,
            action,
        });
    }


    /**
     * 订阅审批意见策略提供器。
     *
     * 各审批动作弹框打开前会通过 {@link resolveAdvicePolicy} 触发已订阅的提供器，
     * 宿主可据此按动作类型决定：是否隐藏意见框、是否必填、默认意见与快捷模板。
     * 首个返回非 null 策略的提供器命中，未命中时沿用节点策略
     * （服务端下发的 adviceRequired / adviceHidden）。
     *
     * 自定义视图可通过
     * `useApprovalContext().context.getPresenter().getFlowActionPresenter()`
     * 获取本对象后订阅，并在组件卸载时调用返回的函数取消订阅。
     *
     * @param provider 策略提供器函数
     * @returns 取消订阅函数
     */
    public addAdvicePolicyProvider(provider: AdvicePolicyProvider): () => void {
        return this.advicePolicyManager.add(provider);
    }

    /**
     * 移除指定审批意见策略提供器
     * @param provider 待移除的策略提供器函数
     */
    public removeAdvicePolicyProvider(provider: AdvicePolicyProvider): void {
        this.advicePolicyManager.remove(provider);
    }

    /**
     * 解析指定动作的生效意见策略。
     *
     * 节点策略（adviceRequired / adviceHidden）与宿主策略合并：
     * 宿主策略优先，但隐藏意见时必填恒为 false，避免用户无输入入口却被服务端拦截。
     * 未订阅提供器时直接返回节点策略对应的结果。
     *
     * @param actionId 动作 ID
     * @returns 生效的意见策略
     */
    public async resolveAdvicePolicy(actionId: string): Promise<ResolvedAdvicePolicy> {
        const action = this.getAction(actionId);
        const flow = this.state.flow;
        const policy = await this.advicePolicyManager.resolve({
            actionId,
            action,
            flow,
        });
        return mergeAdvicePolicy({
            hidden: flow?.adviceHidden ?? false,
            required: flow?.adviceRequired ?? false,
        }, policy);
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

    /**
     * 动作是否支持合并批量提交。
     *
     * 由服务端 detail 响应的 `action.batchable` 声明，缺省视为支持（兼容旧版本服务端）。
     * 减签等「目标按流程实例隔离」的动作声明为 false：合并审批时不循环提交多个勾选记录，
     * 只提交当前打开详情的那条流程记录，避免把 A 流程的候选人错配到 B 流程。
     *
     * @param actionId 动作 ID
     */
    public isBatchable(actionId: string): boolean {
        const action = this.getAction(actionId);
        return action?.batchable !== false;
    }

    public syncState(state: ApprovalState) {
        this.state = JSON.parse(JSON.stringify(state));
    }

    /**
     * 获取 presenter 内部的最新状态快照（用于异步回调中基于最新状态做更新）。
     */
    public getState(): ApprovalState {
        return this.state;
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


    private async submitAction(actionId: string, formData: any, params?: any, fixedRecordId?: number) {
        // 合并审批中已进入单条流程时，提交目标固定为该条记录
        const recordId = fixedRecordId || this.state.mergeSingleRecordId || formData.recordId || this.createdRecordId || this.state.flow?.recordId;
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
                // 记录到实例字段，避免 syncState 覆盖内部快照后重复 create（issue-195）
                this.createdRecordId = recordId;
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

    /**
     * 校验指定动作的业务表单。
     *
     * 通过动作（PASS 及其 triggerType = PASS 的自定义动作）提交前会校验表单必填项，
     * 与 {@link executeAction} 的提交校验保持一致；其他动作不校验表单字段
     * （服务端也仅对 PassAction 做表单校验），直接放行。
     *
     * 视图层应在打开审批意见框之前调用本方法做预校验，避免「先弹框、填完意见后
     * 才提示表单必填」的交互错位（issue-246）；自定义拦截器也可据此手动触发校验。
     *
     * @param actionId 动作 ID
     * @returns 校验通过（或该动作无需校验）返回 true；校验失败返回 false
     */
    public async validateActionForm(actionId: string): Promise<boolean> {
        if (!this.isPassAction(actionId)) {
            return true;
        }
        try {
            await this.formActionContext.validate();
            return true;
        } catch {
            return false;
        }
    }

    private async executeAction(actionId: string, params?: any, fixedRecordId?: number) {
        let formData;
        if (this.isPassAction(actionId)) {
            formData = await this.formActionContext.validate();
        } else {
            formData = this.formActionContext.save();
        }
        return await this.submitAction(actionId, formData, params, fixedRecordId);
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
     * 子流程数据重置（独立能力，非审批动作）。
     *
     * 仅当详情数据 `resetSubProcess` 标识为 true 时可调用：将选中实例流程id对应的
     * 已完成子流程聚合组重置，主流程退回子流程节点重新等待。
     *
     * @param resetInstanceProcessIds 选中重建的子流程实例流程id列表
     * @param advice 重置说明（可选）
     */
    public async resetSubProcess(resetInstanceProcessIds: string[], advice?: string) {
        this.setLoading(true);
        try {
            const recordId = this.state.flow?.recordId;
            if (recordId) {
                const body: FlowSubProcessResetRequest = { recordId, resetInstanceProcessIds, advice };
                return await this.api.resetSubProcess(body, this.mockKey);
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
            const batchable = this.isBatchable(actionId);
            const submitRecordIds = this.submitRecordIds;
            if (mergeable && this.state.mergeSingleRecordId != null) {
                // 已从合并列表进入单条流程：所有动作都只提交这条记录（submitAction 内部取 mergeSingleRecordId）
                return await this.executeAction(actionId, params);
            }
            if (mergeable && !batchable) {
                // 不支持批量的动作（如减签）只提交当前详情的记录，忽略合并勾选
                return await this.executeAction(actionId, params, this.state.flow?.recordId);
            }
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