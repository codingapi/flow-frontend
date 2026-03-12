import React from "react";
import {State,ApprovalLayoutProps} from "@/typings";
import {ApprovalPresenter} from "@/presenters";

export class ApprovalContextScope {
    private readonly presenter: ApprovalPresenter;
    private readonly props: ApprovalLayoutProps;


    constructor(presenter: ApprovalPresenter, props: ApprovalLayoutProps) {
        this.presenter = presenter;
        this.props = props;
    }

    public syncState(state: State) {
        this.presenter.syncState(state);
    }

    public getPresenter() {
        return this.presenter;
    }


    public close() {
        this.props.onClose?.();
    }

    public initialState() {
        this.presenter.initialState({
            flow: this.props.content,
            review: this.props.review,
        });
    }
}


export const ApprovalContext = React.createContext<ApprovalContextScope | undefined>(undefined);

