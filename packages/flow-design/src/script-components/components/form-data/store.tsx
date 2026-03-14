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
export const formDataStore = configureStore({
    reducer: {
        formData: formDataSlice.reducer
    },
});

export type FormDataReduxState = ReturnType<typeof formDataStore.getState>;