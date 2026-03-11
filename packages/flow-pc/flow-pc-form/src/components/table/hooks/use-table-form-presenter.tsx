import {FlowTableProps} from "@/components/table/types";
import React from "react";
import {TableFormPresenter} from "@/components/table/presenter";

export const useTableFormPresenter = (props: FlowTableProps) => {
    const ref = React.useRef<TableFormPresenter>(undefined);

    if (!ref.current) {
        ref.current = new TableFormPresenter(props.meta, props.formList);
    }
    return ref.current;
}