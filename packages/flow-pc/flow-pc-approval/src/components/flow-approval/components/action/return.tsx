import React from "react";
import { FlowActionProps } from "./type";
import { Form, message } from "antd";
import { ApprovalViewPluginAction, DialogContent, useApprovalContext } from "@coding-flow/flow-approval-presenter";
import { ReturnView } from "@/plugins/view/return-view";
import { CustomStyleButton } from "@/components/flow-approval/components/custom-style-button";
import { APPROVAL_ACTION_RETURN_KEY } from "@/components/flow-approval";
import { AdviceField, useAdvicePolicy } from "@/components/flow-approval/components/advice-field";
import { ViewBindPlugin, FlowMessageKey, FlowMessageRegistry, EventBus } from "@coding-flow/flow-core";
import { ResizableModal } from "@/components/flow-approval/components/resizable-modal";

/**
 * 退回
 * @param props
 * @constructor
 */
export const ReturnAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const { state, context } = useApprovalContext();
    const [form] = Form.useForm();

    const actionPresenter = context.getPresenter().getFlowActionPresenter();
    const actionLoading = state.actionLoading ?? false;

    const [modalVisible, setModalVisible] = React.useState(false);
    const [dialogContent, setDialogContent] = React.useState<DialogContent | null>(null);

    /** 审批意见策略（节点策略 + 宿主策略合并结果） */
    const advice = useAdvicePolicy(action.id);


    const actionRef = React.useRef<ApprovalViewPluginAction>(null);

    /** 打开弹框：先解析自定义弹框内容（标题/中间内容）与意见策略，再渲染，避免意见框闪烁 */
    const openModal = () => {
        form.resetFields();
        setDialogContent(null);
        advice.resetPolicy();
        Promise.all([
            actionPresenter.resolveDialogContent(action.id),
            advice.resolvePolicy(),
        ]).then(([content]) => {
            setDialogContent(content);
            setModalVisible(true);
        }).catch(() => {
            setModalVisible(true);
        });
    }

    const handlerOK = () => {
        // 自定义弹框内容时退化为纯确认框，直接提交（无表单可校验）
        if (dialogContent?.content) {
            handleSubmit();
            return;
        }
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

    /** 预填策略默认意见：仅在意见框为空时写入，避免覆盖用户已输入内容 */
    React.useEffect(() => {
        if (modalVisible) {
            advice.applyDefaultAdvice(form);
        }
    }, [modalVisible, advice.policy]);

    const handleSubmit = (params?: any) => {
        actionPresenter.action(action.id, advice.withDefaultAdvice(params)).then((res) => {
            if (res.success) {
                message.success(
                    FlowMessageRegistry.getInstance().get(
                        FlowMessageKey.APPROVAL_RETURN,
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
                openModal();
            }
        });

        return () => {
            EventBus.getInstance().off(action.id);
        }
    }, []);

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_RETURN_KEY);

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
                            openModal();
                        }
                    }}
                    title={action.title}
                />
            )}

            <ResizableModal
                title={dialogContent?.title ?? "退回审批"}
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
                {dialogContent?.content ? (
                    dialogContent.content
                ) : (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => {
                        handleSubmit(values);
                    }}
                >
                    <Form.Item
                        name={"backNodeId"}
                        label={"退回节点"}
                        required={true}
                        rules={[
                            {
                                required: true,
                                message: '退回节点不能为空'
                            }
                        ]}
                    >
                        <ReturnView
                            action={actionRef}
                        />
                    </Form.Item>

                    <AdviceField
                        action={action}
                        policy={advice.policy}
                        visible={advice.visible}
                        required={advice.required}
                        label={"审批意见"}
                        placeholder={"请输入审批意见"}
                    />
                </Form>
                )}
            </ResizableModal>
        </>
    )
}