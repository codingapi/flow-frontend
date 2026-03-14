import React from "react";
import {FormDataPresenter} from "../presenters";
import {FormDataContentProps, FormDataState} from "../types";

export class FormDataContextScope {
    private readonly presenter: FormDataPresenter;
    private readonly props: FormDataContentProps;

    constructor(presenter: FormDataPresenter, props: FormDataContentProps) {
        this.presenter = presenter;
        this.props = props;
    }

    public syncState(state: FormDataState) {
        this.presenter.syncState(state);
    }

    public getPresenter() {
        return this.presenter;
    }

    public initState() {
        this.presenter.initState();
    }


}


export const FormDataContext = React.createContext<FormDataContextScope | undefined>(undefined);

