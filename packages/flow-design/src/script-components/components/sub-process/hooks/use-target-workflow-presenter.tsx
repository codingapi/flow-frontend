import React from "react";
import {TargetWorkflowPresenter} from "@/script-components/components/sub-process/presenters/target-workflow-presenter";
import {SubProcessViewState} from "@/script-components/components/sub-process/typings";
import {SubProcessViewApiImpl} from "@/script-components/components/sub-process/models";

export const useTargetWorkflowPresenter = () => {

    const ref = React.useRef<TargetWorkflowPresenter>(undefined);

    const [state, setState] = React.useState<SubProcessViewState>({
        workflows: [],
        actions: []
    });

    if (!ref.current) {
        ref.current = new TargetWorkflowPresenter(state, setState, new SubProcessViewApiImpl());
        ref.current.initState();
    }


    React.useEffect(() => {
        if (ref.current) {
            ref.current.syncState(state);
        }
    }, [state]);


    return {
        state,
        presenter: ref.current,
    }

}