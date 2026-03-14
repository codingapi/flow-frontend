import React from "react";
import {FlowForm} from "@flow-engine/flow-types";
import {Table} from "@flow-engine/flow-pc-ui";
import {useFlowFormPresenter} from "../hooks/use-flow-form-presenter";

interface FormDataListProps{
    form: FlowForm;
}

export const FormDataList:React.FC<FormDataListProps> = (props) => {

    const presenter = useFlowFormPresenter(props.form);

    return (
        <Table
            title={()=>{
                return (
                    <>{presenter.getFormTitle()}</>
                )
            }}
            columns={presenter.getColumns()}
            dataSource={presenter.getDatasource()}
            pagination={false}
        />
    )

}