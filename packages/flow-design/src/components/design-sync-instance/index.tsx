import React from "react";
import {Alert, message, Modal, type TableColumnsType} from "antd";
import {Table} from "@coding-flow/flow-pc-ui";
import {FlowMessageKey, FlowMessageRegistry} from "@coding-flow/flow-core";
import {forceSync, runningInstances, type ForceSyncResult, type RunningInstanceItem} from "@/api/workflow";
import {toProcessIds} from "./selection";
import styles from "./design_sync_instance.module.scss";

export interface DesignSyncInstanceProps {
    /** 是否展示 */
    open: boolean;
    /** 当前设计的流程编码 */
    workCode: string;
    /** 关闭 */
    onClose: () => void;
}

const columns: TableColumnsType<RunningInstanceItem> = [
    {
        title: '流程标题',
        dataIndex: 'title',
        ellipsis: true,
    },
    {
        title: '发起人',
        dataIndex: 'createOperatorName',
        width: 140,
        render: (value: string | undefined) => value || '-',
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 200,
        render: (value: number | undefined) => (value ? new Date(value).toLocaleString() : '-'),
    },
];

/**
 * 运行中实例强制同步最新流程设计。
 *
 * <p>只同步勾选的流程实例，未勾选的实例继续使用原运行时快照；
 * 后端会校验流程结构与运行实例一致，新增/删除节点、调整节点顺序或删除已有按钮时不允许同步。</p>
 */
export const DesignSyncInstance: React.FC<DesignSyncInstanceProps> = (props) => {

    const [selectedRows, setSelectedRows] = React.useState<RunningInstanceItem[]>([]);
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (!props.open) {
            setSelectedRows([]);
            setSubmitting(false);
        }
    }, [props.open]);

    const submit = async () => {
        const processIds = toProcessIds(selectedRows);
        if (processIds.length === 0) {
            message.warning(
                FlowMessageRegistry.getInstance().get(FlowMessageKey.DESIGN_FORCE_SYNC_NO_SELECTED)
            );
            return;
        }
        setSubmitting(true);
        try {
            const response = await forceSync({
                workCode: props.workCode,
                processIds,
            });
            if (response.success) {
                const result = response.data as ForceSyncResult | undefined;
                message.success(
                    FlowMessageRegistry.getInstance().get(FlowMessageKey.DESIGN_FORCE_SYNC_SUCCESS, {
                        count: result?.syncedProcessIds?.length ?? 0,
                        skipped: result?.skippedProcessIds?.length ?? 0,
                    })
                );
                props.onClose();
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={"强制同步运行中实例"}
            open={props.open}
            width={860}
            destroyOnHidden={true}
            okText={"同步"}
            cancelText={"取消"}
            confirmLoading={submitting}
            onOk={submit}
            onCancel={props.onClose}
        >
            <Alert
                className={styles.notice}
                type={"warning"}
                showIcon={true}
                message={"同步说明"}
                description={"同步使用已保存的最新流程设计，修改设计后请先保存。仅勾选的运行中实例会改用最新配置，未勾选的实例保持原配置不变；新增或删除节点、调整节点顺序、删除已有按钮时不允许同步。"}
            />
            <Table<RunningInstanceItem>
                rowKey={"processId"}
                columns={columns}
                request={async (params) => {
                    const response = await runningInstances({
                        workCode: props.workCode,
                        current: params.current,
                        pageSize: params.pageSize,
                    });
                    return {
                        data: response.data ?? [],
                        success: response.success,
                        total: response.total ?? 0,
                    };
                }}
                rowSelection={{
                    selectedRowKeys: toProcessIds(selectedRows),
                    onChange: (_keys, rows) => {
                        setSelectedRows(rows);
                    },
                }}
            />
        </Modal>
    );
}
