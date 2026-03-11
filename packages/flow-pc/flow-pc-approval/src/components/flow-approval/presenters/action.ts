import {FlowApprovalApi, State} from "@/components/flow-approval/typings";
import {FormActionContext} from "@flow-engine/flow-types";
import {GroovyScriptConvertorUtil} from "@flow-engine/flow-core";

export class FlowActionPresenter {

    private readonly api: FlowApprovalApi;
    private readonly formActionContext: FormActionContext;
    private state: State;

    private submitRecordIds: number[];

    constructor(state: State,
                api: FlowApprovalApi,
                formActionContext: FormActionContext) {
        this.state = state;
        this.api = api;
        this.formActionContext = formActionContext;
        this.submitRecordIds = [];
    }


    public setSubmitRecordIds(submitRecordIds: number[]) {
        this.submitRecordIds = [];
        this.submitRecordIds = submitRecordIds;
    }

    private clearSubmitRecordIds(): void {
        this.submitRecordIds = [];
    }

    public syncState(state: State) {
        this.state = state;
    }

    public async processNodes() {
        const formData = this.formActionContext.save() as any;

        const recordId = formData.recordId || this.state.flow?.recordId;
        if (formData.recordId) {
            delete formData.recordId;
        }

        const id = recordId || this.state.flow?.workId || '';
        return await this.api.processNodes({
            id,
            formData,
        });
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
                    const script = action.script || '';
                    const returnData = GroovyScriptConvertorUtil.getReturnScript(script);
                    if (returnData.includes('PASS')) {
                        return true;
                    }
                }
            }
        }
        return false;
    }


    private async submitAction(actionId: string, formData: any, params?: any) {
        const recordId = formData.recordId || this.state.flow?.recordId;
        const workId = this.state.flow?.workId;

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
            return await this.api.action(request);
        } else {
            const createRequest = {
                workId,
                formData,
                actionId,
            }
            const recordId = await this.api.create(createRequest);
            const actionRequest = {
                formData,
                recordId,
                advice: {
                    actionId,
                    ...params
                }
            }
            return await this.api.action(actionRequest);
        }
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
        const recordId = this.state.flow?.recordId;
        if (recordId) {
            return await this.api.revoke(recordId);
        }
    }

    public async urge() {
        const recordId = this.state.flow?.recordId;
        if (recordId) {
            return await this.api.urge(recordId);
        }
    }

    public async action(actionId: string, params?: any) {
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
    }

}