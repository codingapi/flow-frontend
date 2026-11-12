import { FlowList } from "@/components/list";
import { FormViewProps } from "@coding-flow/flow-types";
import React from "react";
import { FlowFormView as FormView } from "./view";

export const FlowFormView: React.FC<FormViewProps> = (props) => {
  const form = props.form;

  const formList = props.formList || [];

  if (props.mergeable) {
    return (
      <FlowList
        formList={formList}
        initData={props.initData}
        meta={props.meta}
        onValuesChange={props.onValuesChange}
        review={props.review}
        fieldPermissions={props.fieldPermissions}
        onMergeRecordIdsSelected={props.onMergeRecordIdsSelected}
        onMergeRecordView={props.onMergeRecordView}
      />
    );
  }

  if (form) {
    return (
      <FormView
        form={form}
        data={props.data}
        meta={props.meta}
        initData={props.initData}
        onValuesChange={props.onValuesChange}
        review={props.review}
        fieldPermissions={props.fieldPermissions}
      />
    );
  }
};
