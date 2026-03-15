import React from "react";
import {FlowForm} from "@flow-engine/flow-types";
import {Table} from "@flow-engine/flow-pc-ui";
import {useFormDataContext} from "@/script-components/components/form-data/hooks/use-form-data-context";

interface FormDataListProps {
    form: FlowForm;
}

export const FormDataList: React.FC<FormDataListProps> = (props) => {

    const {state,context} = useFormDataContext();
    const presenter = context.getPresenter();

    return (
        <Table
            title={() => {
                return (
                    <>{presenter.getFormTitle(props.form)}</>
                )
            }}
            rowKey={"code"}
            columns={presenter.getColumns(props.form)}
            dataSource={presenter.getDatasource(props.form,state.formData?.dataBody)}
            pagination={false}
        />
    )

}