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
        this.actions = state.flow?.actions || [];
        this.actionList = state.flow?.actionList || [];
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