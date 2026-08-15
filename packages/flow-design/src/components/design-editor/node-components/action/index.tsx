import React from "react";
import { Button, Form, Popconfirm, Space, Switch, Typography } from "antd";
import { Table } from "@coding-flow/flow-pc-ui";
import { useNodeRenderContext } from "@/components/design-editor/hooks/use-node-render-context";
import { PlusOutlined } from "@ant-design/icons";
import { actionOptions } from "@coding-flow/flow-types";
import { ActionConfigModal } from "@/script-components/modal/action-config-modal";
import { FlowActionListPresenter } from "./presenter";
import { createCustomAction } from "@/api/workflow";

interface ActionTableProps {
    value: any[];
    onChange: (data: any[]) => void;
}

export const ActionTable: React.FC<ActionTableProps> = (props) => {
    const { node } = useNodeRenderContext();
    const presenter = new FlowActionListPresenter(props.value, props.onChange);
    const datasource = presenter.getDatasource();
    const [visible, setVisible] = React.useState(false);
    const [form] = Form.useForm();

    const columns = React.useCallback(() => {
        return [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                render: (value: string) => {
                    return (
                        <Typography.Text
                            copyable={{ text: value, tooltips: ["复制按钮 ID", "已复制"] }}
                        >
                            {value}
                        </Typography.Text>
                    )
                }
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                render: (value: string) => {
                    const type = actionOptions.find(item => item.value === value);
                    return type?.label
                }
            },
            {
                title: '启用',
                dataIndex: 'enable',
                key: 'enable',
                render: (_: any, record: any) => {
                    return (
                        <Switch
                            size="small"
                            value={record.enable}
                            onChange={(value) => {
                                presenter.enable(record.id, value);
                            }}
                        />
                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (_: any, record: any) => {
                    if (record.enable) {
                        return (
                            <Space>
                                <a
                                    onClick={() => {
                                        form.resetFields();
                                        form.setFieldsValue(record);
                                        setVisible(true);
                                    }}
                                >
                                    编辑
                                </a>
                                <a
                                    onClick={() => {
                                        presenter.sort(record.id, -1)
                                    }}
                                >
                                    ↑
                                </a>
                                <a
                                    onClick={() => {
                                        presenter.sort(record.id, 1)
                                    }}
                                >
                                    ↓
                                </a>
                                {record.type === 'CUSTOM' && (
                                    <Popconfirm
                                        title={"确认删除吗？"}
                                        onConfirm={() => {
                                            presenter.delete(record.id);
                                        }}
                                    >
                                        <a>
                                            删除
                                        </a>
                                    </Popconfirm>
                                )}
                            </Space>
                        )
                    }
                }
            },
        ];
    }, [props.value]);

    return (
        <>
            <Table
                toolBarRender={() => [
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() => {
                            form.resetFields();
                            createCustomAction().then(res => {
                                if (res.success) {
                                    const data = res.data;
                                    form.setFieldsValue(data);
                                    setVisible(true);
                                }
                            })
                        }}
                    >
                        自定义按钮
                    </Button>
                ]}
                columns={columns()}
                dataSource={datasource}
                style={{
                    width: "100%",
                }}
                pagination={false}
            />

            <ActionConfigModal
                nodeId={node.id}
                open={visible}
                manager={presenter.getFlowActionManager()}
                form={form}
                onCancel={() => {
                    setVisible(false);
                }}
                onFinish={(values) => {
                    presenter.update(values);
                }}
            />
        </>
    )
}