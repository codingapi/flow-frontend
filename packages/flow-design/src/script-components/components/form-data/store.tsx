import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FormDataState} from "./types";
import { original } from 'immer';

export type FormDataStoreAction = {
    updateState: (state: FormDataState, action: PayloadAction<Partial<FormDataState> | ((prev: FormDataState) => Partial<FormDataState>)>) => void;
}

export const formDataSlice = createSlice<FormDataState, FormDataStoreAction, "formData", {}>({
    name: 'formData',
    initialState: {

    },
    reducers: {
        updateState: (state, action) => {
            if(typeof action.payload === 'function') {
                const currentState = original(state) as FormDataState;
                Object.assign(state, action.payload(currentState));
            }else {
                Object.assign(state, action.payload);
            }
        },
    },
});


export const {
    updateState,
} = formDataSlice.actions;

/**
 * 按实例创建表单数据 store。
 * 每个 FormDataView 使用独立的 store，避免多个子流程配置项共享模块级单例 store
 * 导致表单数据互相覆盖、输入时被刷新。
 */
export const createFormDataStore = () => configureStore({
    reducer: {
        formData: formDataSlice.reducer
    },
});

export type FormDataStore = ReturnType<typeof createFormDataStore>;

export type FormDataReduxState = ReturnType<FormDataStore['getState']>;