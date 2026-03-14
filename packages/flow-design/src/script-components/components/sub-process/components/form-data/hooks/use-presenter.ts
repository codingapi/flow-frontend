import {FlowForm} from "@flow-engine/flow-types";
import {FormDataPresenter} from "../presenter";

export const usePresenter=(form:FlowForm)=>{
    return new FormDataPresenter(form);
}

