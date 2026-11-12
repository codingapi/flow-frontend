import { FlowAction } from "@coding-flow/flow-types";
import { ApprovalState } from "@coding-flow/flow-approval-presenter";

export class LayoutPresenter {

    private static readonly MAX_OPTION_SIZE = 3;
    private readonly state: ApprovalState;
    private readonly actions: FlowAction[];
    private readonly actionList: FlowAction[];
    private readonly review: boolean;

    constructor(state: ApprovalState) {
        this.state = state;
        // 合并列表（确实有多条流程合并、且未进入单条流程）只保留支持批量的动作；
        // 减签等按流程实例计算的动作需进入单条流程后操作。
        // mergeable 只是节点合并策略开关，单条记录时同样为 true，不能作为隐藏依据。
        const mergedList = (state.flow?.mergeable || false)
            && state.mergeSingleRecordId == null
            && (state.flow?.todos?.length ?? 0) > 1;
        const filterActions = (items: FlowAction[]) => {
            if (!mergedList) {
                return items;
            }
            return items.filter(action => action.batchable !== false);
        };
        this.actions = filterActions(state.flow?.actions || []);
        this.actionList = filterActions(state.flow?.actionList || []);
        this.review = state.review || false;
    }


    public hasFooter(): boolean {
        if (this.review) {
            if (this.state.flow?.revoke) {
                return true;
            }
            if (this.state.flow?.urge) {
                return true;
            }
            return false;
        }
        return true;
    }

    public isReview(): boolean {
        return this.review;
    }


    public getActions(): FlowAction[] {
        return this.actions;
    }


    public hiddenAction(actionId: string) {
        for (const action of this.actions) {
            if (action.id === actionId) {
                return false;
            }
        }
        return true;
    }

    public getFooterOptions() {
        const options: FlowAction[] = [];
        for (let i = 0; i < this.actionList.length; i++) {
            const action = this.actionList[i];
            const hiddenAction = this.hiddenAction(action.id);
            if (i < LayoutPresenter.MAX_OPTION_SIZE) {
                if (!hiddenAction) {
                    options.push(action);
                }
            }
        }
        return options;
    }


    public hasMoreOptions() {
        return this.actions.length > LayoutPresenter.MAX_OPTION_SIZE;
    }

    public getMoreOptions() {
        return this.actions.slice(LayoutPresenter.MAX_OPTION_SIZE);
    }


}