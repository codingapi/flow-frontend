import React from "react";
import {useMockPresenter} from "@/components/flow-mock/hooks/use-mock-presenter";
import {FlowMockContext} from "@/context";
import {MockTodoPage} from "@/components/flow-mock/components/todo";


export const FlowMock = () => {

    const {state} = useMockPresenter();

    return (
        <FlowMockContext.Provider value={state}>
            <MockTodoPage/>
        </FlowMockContext.Provider>
    )
}