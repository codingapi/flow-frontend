import React from "react";
import {FlowForm} from "@coding-flow/flow-types";
import {FormDataList} from "./components/list";
import {Provider} from "react-redux";
import {formDataStore} from "./store";
import {FormDataContext} from "@/script-components/components/form-data/context";
import {
    createFormDataContext,
    useFormDataContext
} from "@/script-components/components/form-data/hooks/use-form-data-context";
import {FormDataContentProps} from "./types";


interface FormDataViewProps {
    form?: FlowForm;
    value?: string;
    onChange?: (value: string) => void;
}

const FormDataContent: React.FC<FormDataContentProps> = (props) => {
    const {state,context} = useFormDataContext();
    const presenter = context.getPresenter();

    React.useEffect(()=>{
        presenter.updateFormData(state);
    },[state]);

    return (
        <>
            <FormDataList
                form={props.form}
            />
        </>
    )
}

const FormDataContextContent:React.FC<FormDataContentProps> = (props) => {

    const {context} = createFormDataContext(props);

    return (
        <FormDataContext.Provider value={context}>
            <FormDataContent {...props} />
        </FormDataContext.Provider>
    )

}

const FormDataReduxContent: React.FC<FormDataContentProps> = (props) => {
    return (
        <Provider store={formDataStore}>
            <FormDataContextContent {...props} />
        </Provider>
    )
}

export const FormDataView: React.FC<FormDataViewProps> = (props) => {
    const form = props.form;
    if (form) {
        return (
            <FormDataReduxContent {...props} form={form} />
        )
    }
}