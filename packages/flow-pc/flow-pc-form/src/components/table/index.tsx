import React from "react";
import {FlowTableProps} from "@/components/table/types";
import {useTableFormPresenter} from "@/components/table/hooks/use-table-form-presenter";
import {Button, Flex, Table} from "antd";
import {FormData} from "@coding-flow/flow-types";
import {FlowFormView as FormView} from "@/components/form/view";
import {CaretLeftOutlined} from "@ant-design/icons";

export const FlowTable: React.FC<FlowTableProps> = (props) => {

    const presenter = useTableFormPresenter(props);

    const [recordIdList, setRecordIdList] = React.useState<any[]>([]);

    const [currentForm, setCurrentForm] = React.useState<FormData>();

    const columns = React.useMemo(() => {
        const columns = presenter.getColumns();
        const option = {
            key: 'option',
            valueType: 'option',
            title: '操作',
            render: (_: any, record: any) => {
                return (
                    <a
                        onClick={() => {
                            const formData = presenter.getFormDataByRecordId(record.recordId);
                            if (formData) {
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

    // 回掉登记当前选中中的合并流程
    React.useEffect(() => {
        if (recordIdList.length > 0) {
            props.onMergeRecordIdsSelected?.(recordIdList);
        }
    }, [recordIdList]);

    // 切换是触发右侧节点列表的筛选
    React.useEffect(() => {
        if (currentForm) {
            const data = currentForm.form.getFieldsValue();
            props.onValuesChange?.(data);
        }
    }, [currentForm])

    return (
        <>
            {!currentForm && (
                <Table
                    columns={columns}
                    dataSource={presenter.getDatasource(props.initData)}
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
                                icon={<CaretLeftOutlined/>}
                                onClick={() => {
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