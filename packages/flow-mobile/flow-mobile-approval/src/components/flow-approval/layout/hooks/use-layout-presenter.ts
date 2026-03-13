import {useApprovalContext} from "@flow-engine/flow-approval-presenter";
import {LayoutPresenter} from "../presenter";

export const useLayoutPresenter = () => {
    const {state} = useApprovalContext()
    return new LayoutPresenter(state);
}