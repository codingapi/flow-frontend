import React from "react";
import {FlowListProps} from "@/components/list/types";
import {Button, List, Space} from "antd-mobile";
import {useListFormPresenter} from "@/components/list/hooks/use-list-form-presenter";
import dayjs from "dayjs";
import {FlowFormView} from "@/components/form/view";
import { LeftOutlined } from "@ant-design/icons";


interface FlowSingleListProps extends FlowListProps {
    onChangeMode?: () => void;
    onItemClick?: (recordId: number) => void;
}

export const FlowSingleList: React.FC<FlowSingleListProps> = (props) => {

    const presenter = useListFormPresenter(props);

    const [currentForm, setCurrentForm] = React.useState<any>();

    return (
        <>
            <div
                style={{
                    padding: 10,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                    }}
                >
                    {currentForm && (
                        <Button
                            color="default"
                            size="small"
                            onClick={() => {
                                setCurrentForm(undefined);
                            }}
                        >
                            <Space>
                                <LeftOutlined />
                                返回列表
                            </Space>
                        </Button>
                    )}
                    {!currentForm && (
                        <a
                            onClick={() => {
                                props.onChangeMode?.();
                            }}

                        >批量审批</a>
                    )}
                </div>
            </div>

            {currentForm && (
                <>
                    <FlowFormView
                        form={currentForm.form}
                        data={currentForm.data}
                        meta={props.meta}
                        initData={props.initData}
                        onValuesChange={props.onValuesChange}
                        review={props.review}
                        fieldPermissions={props.fieldPermissions}
                    />
                </>
            )}
            {!currentForm && (
                <List>
                    {presenter.getDatasource(props.initData).map(item => {
                        return (
                            <List.Item
                                onClick={() => {
                                    const form = presenter.getFormDataByRecordId(item.recordId);
                                    if (form) {
                                        setCurrentForm(form);
                                    }
                                }}
                                description={(
                                    <Space>
                                        <span>发起人: {item.submitOperatorName}</span>
                                        <span>提交人: {item.createdOperatorName}</span>
                                        <span>时间: {dayjs(item.createTime).format('YYYY-DD-MM HH:mm:ss')}</span>
                                    </Space>
                                )}
                            >
                                {item.title}
                            </List.Item>
                        )
                    })}
                </List>
            )}

        </>
    )
}