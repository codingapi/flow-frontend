import React, {useState} from "react";
import {Modal, Table, Radio, Space, Alert} from "antd";
import type {TableProps} from "antd";
import {FlowForm} from "@coding-flow/flow-types";
import {ImportFormViewPlugin} from "@coding-flow/flow-design";

const mockFormList: FlowForm[] = [
    {
        code: "leave_form",
        name: "请假申请表单",
        fields: [
            { id: "1", code: "reason", name: "请假原因", type: "string", dataType: "STRING", required: true, hidden: false },
            { id: "2", code: "days", name: "请假天数", type: "integer", dataType: "INTEGER", required: true, hidden: false },
        ],
        subForms: []
    },
    {
        code: "expense_form",
        name: "报销申请表单",
        fields: [
            { id: "1", code: "amount", name: "报销金额", type: "double", dataType: "DOUBLE", required: true, hidden: false },
            { id: "2", code: "description", name: "报销说明", type: "string", dataType: "STRING", required: false, hidden: false },
        ],
        subForms: []
    },
    {
        code: "trip_form",
        name: "出差申请表单",
        fields: [
            { id: "1", code: "destination", name: "出差地点", type: "string", dataType: "STRING", required: true, hidden: false },
            { id: "2", code: "startDate", name: "开始日期", type: "date", dataType: "STRING", required: true, hidden: false },
        ],
        subForms: []
    }
];

export const ImportFormView: React.FC<ImportFormViewPlugin> = (props) => {
    const [selectedForm, setSelectedForm] = useState<FlowForm | null>(null);

    const columns: TableProps<FlowForm>['columns'] = [
        { title: '表单名称', dataIndex: 'name' },
        { title: '表单编码', dataIndex: 'code' },
        {
            title: '字段数量',
            render: (_, record) => record.fields?.length || 0
        },
    ];

    return (
        <Modal
            title="选择表单并导入配置"
            open={props.open}
            onCancel={props.onCancel}
            onOk={() => selectedForm && props.onSelect(selectedForm)}
            okText="导入"
            okButtonProps={{disabled: !selectedForm}}
        >
            <Space direction="vertical" style={{width: '100%'}} size="middle">
                <Alert
                    message="选择要导入的表单"
                    description="将选中表单的字段和子表导入到当前流程表单中"
                    type="info"
                    showIcon
                />
                <Table
                    columns={columns}
                    dataSource={mockFormList}
                    rowKey="code"
                    pagination={{pageSize: 10}}
                    rowSelection={{
                        type: 'radio',
                        onChange: (_, selectedRows) => setSelectedForm(selectedRows[0] || null)
                    }}
                />
            </Space>
        </Modal>
    );
};