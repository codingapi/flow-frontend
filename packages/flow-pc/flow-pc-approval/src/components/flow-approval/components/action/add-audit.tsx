import React from "react";
import { FlowActionProps } from "./type";
import { Form, message } from "antd";
import { ApprovalViewPluginAction, useApprovalContext } from "@coding-flow/flow-approval-presenter";
import { AddAuditView } from "@/plugins/view/add-audit-view";
import { CustomStyleButton } from "@/components/flow-approval/components/custom-style-button";
import { ViewBindPlugin, FlowMessageKey, FlowMessageRegistry, EventBus } from "@coding-flow/flow-core";
import { ResizableModal } from "@/components/flow-approval/components/resizable-modal";
import { APPROVAL_ACTION_ADD_AUDIT_KEY } from "@/components/flow-approval";

/**
 * 加签
 * @param props
 * @constructor
 */
export const AddAuditAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const { state, context } = useApprovalContext();
    const [form] = Form.useForm();

    const actionPresenter = context.getPresenter().getFlowActionPresenter();
    const actionLoading = state.actionLoading ?? false;

    const [modalVisible, setModalVisible] = React.useState(false);

    const actionRef = React.useRef<ApprovalViewPluginAction>(null);

    const handlerOK = () => {
        if (actionRef.current) {
            actionRef.current.onValidate().then(res => {
                if (res) {
                    form.submit();
                }
            })
            return;
        }
        form.submit();
    }

    const handleSubmit = (params?: any) => {
        actionPresenter.action(action.id, params).then((res) => {
            if (res.success) {
                message.success(
                    FlowMessageRegistry.getInstance().get(
                        FlowMessageKey.APPROVAL_ADD_AUDIT,
                        actionPresenter.buildActionContext(action.id)
                    )
                );
                setModalVisible(false);
                context.close();
            }
        });
    }

    React.useEffect(() => {
        EventBus.getInstance().on(action.id, () => {
            if (props.onClickCheck?.(action.id)) {
                form.resetFields();
                setModalVisible(true);
            }
        });

        return () => {
            EventBus.getInstance().off(action.id);
        }
    }, []);

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_ADD_AUDIT_KEY);

    if (ActionView) {
        return (
            <ActionView
                {...props}
            />
        )
    }


    return (
        <>
            {!props.hidden && (
                <CustomStyleButton
                    loading={actionLoading}
                    disabled={actionLoading}
                    display={props.action.display}
                    onClick={() => {
                        if (props.onClickCheck?.(action.id)) {
                            form.resetFields();
                            setModalVisible(true);
                        }
                    }}
                    title={action.title}
                />
            )}

            <ResizableModal
                title={"加签审批"}
                open={modalVisible}
                confirmLoading={actionLoading}
                maskClosable={false}
                mask={{
                    closable: false,
                }}
                onCancel={() => setModalVisible(false)}
                onOk={() => {
                    handlerOK();
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        handleSubmit(values);
                    }}
                >
                    <Form.Item
                        name={"forwardOperatorIds"}
                        label={"加签人员"}
                        required={true}
                        rules={[
                            {
                                required: true,
                                message: '加签人员不能为空'
                            }
                        ]}
                    >
                        <AddAuditView
                            action={actionRef}
                            maxOperatorCount={action.maxOperatorCount}
                        />
                    </Form.Item>
                </Form>
            </ResizableModal>
        </>
    )
}