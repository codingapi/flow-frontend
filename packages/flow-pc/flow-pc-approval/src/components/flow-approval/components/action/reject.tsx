import React from "react";
import { FlowActionProps } from "./type";
import { Form, Input, message } from "antd";
import { DialogContent, ResolvedAdvicePolicy, useApprovalContext } from "@coding-flow/flow-approval-presenter";
import { CustomStyleButton } from "@/components/flow-approval/components/custom-style-button";
import { APPROVAL_ACTION_REJECT_KEY, APPROVAL_ADVICE_VIEW_KEY } from "@/components/flow-approval";
import { ViewBindPlugin, FlowMessageKey, FlowMessageRegistry, EventBus } from "@coding-flow/flow-core";
import { ResizableModal } from "@/components/flow-approval/components/resizable-modal";

const { TextArea } = Input;

/**
 * 拒绝
 * @param props
 * @constructor
 */
export const RejectAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const { state, context } = useApprovalContext()
    const actionPresenter = context.getPresenter().getFlowActionPresenter();
    const actionLoading = state.actionLoading ?? false;
    const [modalVisible, setModalVisible] = React.useState(false);
    const [dialogContent, setDialogContent] = React.useState<DialogContent | null>(null);

    /** 生效的审批意见策略（节点策略 + 宿主策略合并结果） */
    const [advicePolicy, setAdvicePolicy] = React.useState<ResolvedAdvicePolicy | null>(null);

    /** 提交链路通过 ref 读取策略，避免 EventBus 监听器闭包捕获旧值 */
    const advicePolicyRef = React.useRef<ResolvedAdvicePolicy | null>(null);

    const [form] = Form.useForm();

    /** 打开弹框：先解析自定义弹框内容（标题/中间内容）与意见策略，再渲染，避免意见框闪烁 */
    const openModal = () => {
        form.resetFields();
        setDialogContent(null);
        setAdvicePolicy(null);
        advicePolicyRef.current = null;
        Promise.all([
            actionPresenter.resolveDialogContent(action.id),
            actionPresenter.resolveAdvicePolicy(action.id),
        ]).then(([content, policy]) => {
            setDialogContent(content);
            advicePolicyRef.current = policy;
            setAdvicePolicy(policy);
            setModalVisible(true);
        }).catch(() => {
            setModalVisible(true);
        });
    }

    /** 预填策略默认意见：仅在意见框为空时写入，避免覆盖用户已输入内容 */
    React.useEffect(() => {
        if (modalVisible && advicePolicy?.defaultContent) {
            const current = form.getFieldValue('advice');
            if (!current) {
                form.setFieldsValue({ advice: advicePolicy.defaultContent });
            }
        }
    }, [modalVisible, advicePolicy]);

    /**
     * 补充策略默认意见。
     *
     * 意见框隐藏时表单不会产生 advice 字段，此处以策略默认内容补齐，
     * 避免命中服务端意见必填校验。
     */
    const withAdvicePolicy = (params?: any) => {
        if (params?.advice != null) {
            return params;
        }
        const defaultContent = advicePolicyRef.current?.defaultContent;
        if (!defaultContent) {
            return params;
        }
        return {
            ...(params || {}),
            advice: defaultContent,
        };
    }

    const handleSubmit = (params?: any) => {
        actionPresenter.action(action.id, withAdvicePolicy(params)).then((res) => {
            if (res.success) {
                message.success(
                    FlowMessageRegistry.getInstance().get(
                        FlowMessageKey.APPROVAL_REJECT,
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

    const adviceRequired = advicePolicy?.required ?? state.flow?.adviceRequired ?? false;

    const adviceHidden = advicePolicy?.hidden ?? state.flow?.adviceHidden ?? false;

    const adviceRules = adviceRequired ? [
        {
            required: true,
            message: '请输入审批意见'
        }
    ] : [];


    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_REJECT_KEY);

    const AdviceView = ViewBindPlugin.getInstance().get(APPROVAL_ADVICE_VIEW_KEY);

    if (ActionView) {
        return (
            <ActionView
                {...props}
            />
        )
    }

    return (
        <>
            {
                !props.hidden && (
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
                )
            }

            <ResizableModal
                title={dialogContent?.title ?? "审批拒绝"}
                open={modalVisible}
                confirmLoading={actionLoading}
                maskClosable={false}
                mask={{
                    closable: false,
                }}
                onCancel={() => setModalVisible(false)}
                onOk={() => {
                    // 自定义弹框内容时退化为纯确认框，直接提交（无表单可校验）
                    if (dialogContent?.content) {
                        handleSubmit();
                        return;
                    }
                    form.submit();
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
                    {!adviceHidden && (
                        <Form.Item
                            name={"advice"}
                            label={"拒绝意见"}
                            required={adviceRequired}
                            rules={adviceRules}
                        >
                            {AdviceView ? (
                                <AdviceView action={action} policy={advicePolicy} />
                            ) : (
                                <TextArea placeholder={"请输入拒绝意见"} />
                            )}
                        </Form.Item>
                    )}
                </Form>
                )}
            </ResizableModal>
        </>
    )
}