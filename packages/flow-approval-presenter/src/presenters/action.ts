import { ApprovalState, FlowApprovalApi } from "@/typings";
import { FormActionContext } from "@coding-flow/flow-types";

export class FlowActionPresenter {

    private readonly api: FlowApprovalApi;
    private readonly formActionContext: FormActionContext;
    private state: ApprovalState;
    private readonly mockKey: string;
    private readonly setLoading: (loading: boolean) => void;

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

    public async action(actionId: string, params?: any) {
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