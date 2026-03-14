import React from "react";
import {FormDataPresenter} from "../presenters";
import {FlowForm} from "@flow-engine/flow-types";
import {FormDataState} from "../types";

export class FormDataContextScope {
    private readonly presenter: FormDataPresenter;
    private readonly form: FlowForm;

    constructor(presenter: FormDataPresenter, form: FlowForm) {
        this.presenter = presenter;
        this.form = form;
    }

    public syncState(state: FormDataState) {
        this.presenter.syncState(state);
    }

    public getPresenter() {
        return this.presenter;
    }

    public initState() {
        this.presenter.initState(this.form);
    }

}


export const FormDataContext = React.createContext<FormDataContextScope | undefined>(undefined);

