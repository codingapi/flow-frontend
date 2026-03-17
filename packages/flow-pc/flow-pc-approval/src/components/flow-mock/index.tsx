import React from "react";
import {useMockPresenter} from "@/components/flow-mock/hooks/use-mock-presenter";
import {FlowMockContext} from "@coding-flow/flow-approval-presenter";
import {MockTodoPage} from "@/components/flow-mock/components/todo";


export const FlowMock = () => {

    const {state, presenter} = useMockPresenter();

    if (state) {
        return (
            <FlowMockContext.Provider value={state}>
                <MockTodoPage
                    onCleanMock={() => {
                        presenter.cleanMock();
                        window.close();
                    }}
                />
            </FlowMockContext.Provider>
        )
    }
}