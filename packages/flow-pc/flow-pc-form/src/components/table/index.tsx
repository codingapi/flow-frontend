import React from "react";
import {FlowTableProps} from "@/components/table/types";
import {useTableFormPresenter} from "@/components/table/hooks/use-table-form-presenter";
import {Button, Flex, Table} from "antd";
import {FormData} from "@flow-engine/flow-types";
import {FormView} from "@/components/form/view";
import { CaretLeftOutlined } from "@ant-design/icons";

export const FlowTable: React.FC<FlowTableProps> = (props) => {

    const presenter = useTableFormPresenter(props);

    const [recordIdList,setRecordIdList] = React.useState<any[]>([]);

    const [currentForm,setCurrentForm] = React.useState<FormData>();

    const columns = React.useMemo(() => {
        const columns = presenter.getColumns();
        const option = {
            key: 'option',
            valueType: 'option',
            title: '操作',
            render: (_:any,record:any) => {
                return (
                    <a
                        onClick={() => {
                            const formData = presenter.getFormDataByRecordId(record.recordId);
                            if(formData){
                                setCurrentForm(formData);
                            }
                        }}
                    >
                        查看
                    </a>
                )
            }
        }
        return [...columns, option];
    }, []);

    return (
        <>

            {!currentForm && (
                <Table
                    columns={columns}
                    dataSource={presenter.getDatasource()}
                    rowKey={"recordId"}
                    rowSelection={{
                        type: "checkbox",
                        onChange: (selectedRowId) => {
                            setRecordIdList(selectedRowId);
                        }
                    }}
                />
            )}

            {currentForm && (
                <>
                    <div
                        style={{
                            width: "100%",
                        }}
                    >
                        <Flex
                            justify={"end"}
                            align={"end"}
                            style={{
                                width: "100%",
                            }}
                        >
                            <Button
                                icon={<CaretLeftOutlined />}
                                onClick={()=>{
                                    setCurrentForm(undefined);
                                }}
                            >返回</Button>
                        </Flex>
                    </div>

                    <FormView
                        form={currentForm.form}
                        data={currentForm.data}
                        meta={props.meta}
                        onValuesChange={props.onValuesChange}
                        review={props.review}
                        fieldPermissions={props.fieldPermissions}
                    />
                </>
            )}
        </>
    )
}