import React, {useState} from "react";
import {Table, TableProps} from "@flow-engine/flow-pc-ui";
import {Button, Flex, Form, Popconfirm, Space} from "antd";
import {dataTypeOptions} from "@flow-engine/flow-types";
import {useDesignContext} from "@/components/design-panel/hooks/use-design-context";
import {WorkflowFormManager} from "@/components/design-panel/manager/form";
import {DeleteOutlined, FolderAddOutlined, PlusOutlined} from "@ant-design/icons";
import {FormFieldModal} from "./model";
import { SubFormModal } from "./sub-form";

interface FormTableProps {
    name: string;
    code: string;
    mainForm: boolean;
}
export const FormTable: React.FC<FormTableProps> = (props) => {

    const name = props.name;
    const {state, context} = useDesignContext();
    const workflowFormManager = new WorkflowFormManager(state.workflow.form);
    const presenter = context.getPresenter();
    const [fieldForm] = Form.useForm();
    const [editable, setEditable] = useState(false);

    const [subForm] = Form.useForm();
    const [subFormVisible, setSubFormVisible] = useState(false);

    const columns: TableProps<any>['columns'] = [
        {
            dataIndex: 'id',
            title: 'id',
            hidden: true,
        },
        {
            dataIndex: 'name',
            title: '字段名称',
        },
        {
            dataIndex: 'code',
            title: '字段编码'
        },
        {
            dataIndex: 'type',
            title: '字段类型',
        },
        {
            dataIndex: 'dataType',
            title: '数据类型',
            render: (value, record) => {
                let label = '';
                for (const option of dataTypeOptions) {
                    if (option.value == value) {
                        label = option.label;
                    }
                }
                return label
            }
        },
        {
            dataIndex: 'required',
            title: '是否为空',
            render: (value) => {
                return value ? '必填' : '非必填'
            }
        },
        {
            dataIndex: 'hidden',
            title: '是否隐藏',
            render: (value) => {
                return value ? '隐藏' : '展示'
            }
        },
        {
            dataIndex: 'placeholder',
            title: '输入提示'
        },
        {
            dataIndex: 'attributes',
            title: '属性数量',
            render: (value) => {
                return value?value.length:0
            }
        },
        {
            dataIndex: 'option',
            title: '操作',
            render: (_, record) => {
                return (
                    <Space>
                        <a onClick={() => {
                            fieldForm.resetFields();
                            fieldForm.setFieldsValue(record);
                            setEditable(true);
                        }}>编辑</a>
                        <Popconfirm
                            title={"确认要删除该字段吗？"}
                            onConfirm={() => {
                                presenter.removeWorkflowFormField(props.code, record.code);
                            }}
                        >
                            <a>删除</a>
                        </Popconfirm>
                    </Space>
                )
            }
        },
    ];


    return (
        <>
            <Table
                columns={columns}
                rowKey={"id"}
                dataSource={workflowFormManager.getFormFields(props.code)}
                title={() => {
                    return (
                        <Flex
                            justify={'space-between'}
                            align={'center'}
                        >
                            <Space>
                                {name}
                            </Space>
                            <Space>
                                {props.mainForm && (
                                    <Button
                                        icon={<FolderAddOutlined />}
                                        onClick={() => {
                                            subForm.resetFields();
                                            setSubFormVisible(true)
                                        }}>
                                        添加子表
                                    </Button>
                                )}
                                {!props.mainForm && (
                                    <Popconfirm
                                        title={"确认要删除子表吗？"}
                                        onConfirm={() => {
                                            presenter.removeWorkflowSubForm(props.code);
                                        }}
                                    >
                                        <Button
                                            icon={<DeleteOutlined />}
                                            danger={true}
                                        >删除子表</Button>
                                    </Popconfirm>
                                )}
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        fieldForm.resetFields();
                                        setEditable(true);
                                    }}
                                >添加字段</Button>
                            </Space>

                        </Flex>
                    )
                }}
            />

            <SubFormModal
                form={subForm}
                open={subFormVisible}
                onFinish={(values) => {
                    presenter.addWorkflowSubForm(values);
                }}
                onClose={() => {
                    setSubFormVisible(false)
                }}
            />

            <FormFieldModal
                open={editable}
                form={fieldForm}
                onClose={() => {
                    setEditable(false);
                }}
                onFinish={(values) => {
                    presenter.updateWorkflowFormField(props.code, values);
                    setEditable(false);
                }}
            />
        </>
    )
}