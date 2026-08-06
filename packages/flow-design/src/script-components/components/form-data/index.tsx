import React from "react";
import {FlowForm} from "@coding-flow/flow-types";
import {FormDataList} from "./components/list";
import {Provider} from "react-redux";
import {createFormDataStore, FormDataStore} from "./store";
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
    // 每个 FormDataView 实例持有独立 store，避免多实例共享状态互相覆盖
    const storeRef = React.useRef<FormDataStore | undefined>(undefined);
    if (!storeRef.current) {
        storeRef.current = createFormDataStore();
    }
    return (
        <Provider store={storeRef.current}>
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