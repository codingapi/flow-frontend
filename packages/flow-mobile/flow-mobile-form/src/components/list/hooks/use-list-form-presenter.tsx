import {FlowListProps} from "@/components/list/types";
import React from "react";
import {ListFormPresenter} from "@/components/list/presenter";

export const useListFormPresenter = (props: FlowListProps) => {
    const ref = React.useRef<ListFormPresenter>(undefined);

    if (!ref.current) {
        ref.current = new ListFormPresenter(props.meta, props.formList);
    }
    return ref.current;
}