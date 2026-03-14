import React from "react";
import {FlowForm} from "@flow-engine/flow-types";
import {Table} from "@flow-engine/flow-pc-ui";
import {useFormDataContext} from "@/script-components/components/form-data/hooks/use-form-data-context";

interface FormDataListProps {
    form: FlowForm;
}

export const FormDataList: React.FC<FormDataListProps> = (props) => {

    const {context} = useFormDataContext();
    const presenter = context.getPresenter();

    return (
        <Table
            title={() => {
                return (
                    <>{presenter.getFormTitle(props.form)}</>
                )
            }}
            columns={presenter.getColumns(props.form)}
            dataSource={presenter.getDatasource(props.form)}
            pagination={false}
        />
    )

}