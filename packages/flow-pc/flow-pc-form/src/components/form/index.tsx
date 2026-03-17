import React from "react";
import {FormViewProps} from "@coding-flow/flow-types";
import {FormView} from "@/components/form/view";
import {FlowTable} from "@/components/table";

export const FlowFormView: React.FC<FormViewProps> = (props) => {

    const form = props.form;

    const formList = props.formList || [];

    if(props.mergeable){
        return (
            <FlowTable
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

