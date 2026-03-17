import React from "react";
import {FormViewProps} from "@coding-flow/flow-types";
import {FormView} from "./view";
import {FlowList} from "@/components/list";

export const FlowFormView: React.FC<FormViewProps> = (props) => {

    const form = props.form;

    const formList = props.formList || [];

    if(props.mergeable){
        return (
            <FlowList
                formList={formList}
                meta={props.meta}
                onValuesChange={props.onValuesChange}
                review={props.review}
                fieldPermissions={props.fieldPermissions}
                onMergeRecordIdsSelected={props.onMergeRecordIdsSelected}
            />
        )
    }

    if(form) {
        return (
            <FormView
                form={form}
                data={props.data}
                meta={props.meta}
                onValuesChange={props.onValuesChange}
                review={props.review}
                fieldPermissions={props.fieldPermissions}
            />
        )
    }
};