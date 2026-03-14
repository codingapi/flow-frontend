import React from "react";
import {FlowForm} from "@flow-engine/flow-types";
import {usePresenter} from "./hooks/use-presenter";
import {FormDataList} from "./list";
import { Tabs } from "antd";


interface FormDataViewProps {
    form?: FlowForm;
    value?: any;
    onChange?: (value: any) => void;
}

export const FormDataView: React.FC<FormDataViewProps> = (props) => {
    const form = props.form;
    if (form) {
        const presenter = usePresenter(form);
        return (
            <>
                <FormDataList
                    form={form}
                />
                {presenter.hasSubForms() && (
                    <Tabs
                        items={presenter.getTabs()}
                    />
                )}
            </>
        )
    }
}