import React, {useContext} from "react";
import {useDispatch, useSelector} from "react-redux";
import {FormDataPresenter} from "../presenters/form-data-presenter";
import {FormDataReduxState, updateState} from "../store";
import {FormDataContext, FormDataContextScope} from "../context";
import {FormDataContentProps} from "@/script-components/components/form-data/types";


export const useFormDataContext = ()=>{
    const context = useContext(FormDataContext);
    const state = useSelector((state: FormDataReduxState) => state.formData);
    if (!context) {
        throw new Error("ConditionContext must be used within useContext");
    }
    return {
        state,
        context,
    };
}

export const createFormDataContext = (props:FormDataContentProps) => {

    const dispatch = useDispatch();

    const state = useSelector((state: FormDataReduxState) => state.formData);

    const ref = React.useRef<FormDataContextScope>(undefined);

    if (!ref.current) {
        const presenter = new FormDataPresenter(props,state, (prevState) => {
            dispatch(updateState(prevState));
            return prevState;
        });

        ref.current = new FormDataContextScope(presenter,props);
        ref.current.initState();
    }

    React.useEffect(() => {
        if (ref.current) {
            ref.current.syncState(state);
        }
    }, [state])


    return {
        state,
        context: ref.current,
    }
}