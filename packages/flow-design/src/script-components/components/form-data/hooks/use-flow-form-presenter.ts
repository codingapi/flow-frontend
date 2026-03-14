import {FlowForm} from "@flow-engine/flow-types";
import {FlowFormPresenter} from "../presenters";

export const useFlowFormPresenter=(form:FlowForm)=>{
    return new FlowFormPresenter(form);
}

