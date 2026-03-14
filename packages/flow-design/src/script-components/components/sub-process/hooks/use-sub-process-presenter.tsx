import React from "react";
import {SubProcessPresenter} from "@/script-components/components/sub-process/presenters";
import {SubProcessViewProps} from "@/script-components/components/sub-process/typings";

export const useSubProcessPresenter = (props:SubProcessViewProps) => {

    const ref = React.useRef<SubProcessPresenter>(undefined);

    if (!ref.current) {
        ref.current = new SubProcessPresenter(props);
    }

    return ref.current;
}