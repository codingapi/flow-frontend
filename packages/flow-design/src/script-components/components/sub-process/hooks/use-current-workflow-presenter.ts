import {useDesignContext} from "@/components/design-panel/hooks/use-design-context";
import {CurrentWorkflowPresenter} from "@/script-components/components/sub-process/presenters";

export const useCurrentWorkflowPresenter = () => {
    const {state} = useDesignContext();
    return new CurrentWorkflowPresenter(state.workflow);
}