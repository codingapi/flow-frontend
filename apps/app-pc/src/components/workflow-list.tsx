import {Table, type TableProps} from "@coding-flow/flow-pc-ui";
import {type ActionType} from "@coding-flow/flow-core";
import React from "react";
import {Button, message, Popconfirm, Space} from "antd";
import {DesignImport, DesignPanel} from "@coding-flow/flow-design";
import {changeState, list, remove} from "@/api/workflow.ts";
import dayjs from "dayjs";

export const WorkflowList = () => {

    const actionType = React.useRef<ActionType>(null);
    const [currentId, setCurrentId] = React.useState<string>('');
    const [editable, setEditable] = React.useState<boolean>(false);
    const [importVisible, setImportVisible] = React.useState<boolean>(false);


    const handleChangeState = (id: any) => {
        changeState(id).then(res => {
            if (res.success) {
                message.success('状态已变更');
                actionType.current?.reload();
            }
        })
    }

    const handleRemove = (id: any) => {
        remove(id).then(res => {
            if (res.success) {
                message.success('流程已删除');
                actionType.current?.reload();
            }
        })
    }

    const columns: TableProps<any>['columns'] = [
        {
            dataIndex: 'id',
            title: '编号',
            hidden: true,
        },
        {
            dataIndex: 'title',
            title: '流程标题',
        },
        {
            dataIndex: 'code',
            title: '流程编码',
        },
        {
            dataIndex: 'createdTime',
            title: '创建时间',
            render: (value) => {
                return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        {
            dataIndex: 'updatedTime',
            title: '更新时间',
            render: (value) => {
                return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        {
            dataIndex: 'enable',
            title: '状态',
            render: (value, record) => {
                if (value) {
                    return (
                        <Popconfirm
                            title={"确认要禁用吗？"}
                            onConfirm={() => {
                                handleChangeState(record.id);
                            }}
                        >
                            <a>启用</a>
                        </Popconfirm>
                    )
                } else {
                    return (
                        <Popconfirm
                            title={"确认要启用吗？"}
                            onConfirm={() => {
                                handleChangeState(record.id);
                            }}
                        >
                            <a>禁用</a>
                        </Popconfirm>
                    )
                }
            }
        },
        {
            dataIndex: 'option',
            title: '操作',
            render: (_: any, record) => {
                return (
                    <Space>
                        <a onClick={() => {
                            setCurrentId(record.id);
                            setEditable(true);
                        }}>编辑</a>
                        <Popconfirm
                            title={"确认要删除该流程吗？"}
                            onConfirm={() => {
                                handleRemove(record.id);
                            }}
                        >
                            <a>删除</a>
                        </Popconfirm>
                    </Space>
                )
            }
        }
    ];

    return (
        <div>
            <Table
                rowKey={"id"}
                actionType={actionType}
                toolBarRender={() => {
                    return [
                        <Button
                            key={"mock"}
                            onClick={() => {
                                window.open('/#/mock', '_blank')
                            }}>
                            流程模拟
                        </Button>,
                        <Button
                            key={"import"}
                            onClick={() => {
                                setImportVisible(true);
                            }}>
                            导入流程
                        </Button>,
                        <Button
                            key={"create"}
                            type={'primary'}
                            onClick={() => {
                                setCurrentId('');
                                setEditable(true);
                            }}>
                            创建流程
                        </Button>
                    ]
                }}
                columns={columns}
                request={(request) => {
                    return list(request) as any;
                }}
            />

            <DesignPanel
                id={currentId}
                open={editable}
                onClose={() => {
                    setCurrentId('')
                    setEditable(false);
                    actionType.current?.reload();
                }}
            />

            <DesignImport
                open={importVisible}
                onClose={()=>{
                    setImportVisible(false);
                    actionType.current?.reload();
                }}
            />
        </div>
    )
}
