import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {initStateData, ApprovalState} from "@/typings";
import { original } from 'immer';

export type ApprovalStoreAction = {
    updateState: (state: ApprovalState, action: PayloadAction<Partial<ApprovalState> | ((prev: ApprovalState) => Partial<ApprovalState>)>) => void;
}

export const approvalSlice = createSlice<ApprovalState, ApprovalStoreAction, "approval", {}>({
    name: 'approval',
    initialState: {
        ...initStateData
    },
    reducers: {
        updateState: (state, action) => {
            if(typeof action.payload === 'function') {
                const currentState = original(state) as ApprovalState;
                Object.assign(state, action.payload(currentState));
            }else {
                Object.assign(state, action.payload);
            }
        },
    },
});


export const {
    updateState,
} = approvalSlice.actions;
export const approvalStore = configureStore({
    reducer: {
        approval: approvalSlice.reducer
    },
});

export type ApprovalReduxState = ReturnType<typeof approvalStore.getState>;