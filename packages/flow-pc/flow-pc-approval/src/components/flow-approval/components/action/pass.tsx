import React from "react";
import { FlowActionProps } from "./type";
import { Form, message } from "antd";
import { ApprovalViewPluginAction, DialogContent, useApprovalContext } from "@coding-flow/flow-approval-presenter";
import { SignKeyView } from "@/plugins/view/sign-key-view";
import { CustomStyleButton } from "@/components/flow-approval/components/custom-style-button";
import { NodeOption } from "@coding-flow/flow-types";
import { OperatorSelectView } from "@/plugins/view/operator-select-view";
import { ManualView } from "@/plugins/view/manual-view";
import { APPROVAL_ACTION_PASS_KEY } from "@/components/flow-approval";
import { AdviceField, useAdvicePolicy } from "@/components/flow-approval/components/advice-field";
import { ViewBindPlugin, FlowMessageKey, FlowMessageRegistry, EventBus } from "@coding-flow/flow-core";
import { ResizableModal } from "@/components/flow-approval/components/resizable-modal";

/**
 * 通过
 * @param props
 * @constructor
 */
export const PassAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const { state, context } = useApprovalContext()
    const actionPresenter = context.getPresenter().getFlowActionPresenter();

    const [modalVisible, setModalVisible] = React.useState(false);

    const [dialogContent, setDialogContent] = React.useState<DialogContent | null>(null);

    /** 审批意见策略（节点策略 + 宿主策略合并结果），通过动作保持「未隐藏即展示」 */
    const advice = useAdvicePolicy(action.id, true);

    const [options, setOptions] = React.useState<NodeOption[]>([]);

    const [request, setRequest] = React.useState<any>({});

    const [responseType, setResponseType] = React.useState<string | null>(null);

    const isStartNode = state.flow?.nodeType === 'START';

    const actionLoading = state.actionLoading ?? false;

    const currentOperator = state.flow?.currentOperator;

    const [form] = Form.useForm();

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

    /** 预填策略默认意见：仅在意见框为空时写入，避免覆盖用户已输入内容 */
    React.useEffect(() => {
        if (modalVisible) {
            advice.applyDefaultAdvice(form);
        }
    }, [modalVisible, advice.policy]);

    const handleSubmit = (params?: any) => {
        actionPresenter.action(action.id, advice.withDefaultAdvice(params)).then((res) => {
            if (res.success) {
                const resOptions = res.data?.options || [];
                if (resOptions.length > 0) {
                    const resType = res.data?.responseType || 'OPERATOR_SELECT';
                    setRequest(params);
                    setOptions(resOptions);
                    setResponseType(resType);
                } else {
                    message.success(
                        FlowMessageRegistry.getInstance().get(
                            FlowMessageKey.APPROVAL_PASS,
                            actionPresenter.buildActionContext(action.id)
                        )
                    );
                    setModalVisible(false);
                    context.close();
                }
            }
        });
    }

    /**
     * 点击动作按钮。
     *
     * 发起节点默认不弹窗直接提交；但节点策略或宿主策略要求意见必填时必须弹窗，
     * 否则用户没有输入入口，服务端会抛 advice required。
     *
     * 弹框前先校验业务表单（issue-246）：校验失败时由表单直接展示错误并终止，
     * 避免用户填完审批意见后才被提示表单必填项缺失。
     */
    const handleActionClick = async () => {
        if (!props.onClickCheck?.(action.id)) {
            return;
        }
        const formValid = await actionPresenter.validateActionForm(action.id);
        if (!formValid) {
            return;
        }
        if (!isStartNode) {
            openModal();
            return;
        }
        const policy = await advice.resolvePolicy();
        if (policy.required) {
            openModal();
        } else {
            handleSubmit();
        }
    }

    React.useEffect(() => {
        EventBus.getInstance().on(action.id, () => {
            handleActionClick();
        });

        return () => {
            EventBus.getInstance().off(action.id);
        }
    }, []);

    const actionRef = React.useRef<ApprovalViewPluginAction>(null);

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

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_PASS_KEY);

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
                    display={props.action.display}
                    loading={actionLoading}
                    disabled={actionLoading}
                    onClick={handleActionClick}
                    title={action.title}
                />
            )}

            <ResizableModal
                title={dialogContent?.title ?? "审批通过"}
                open={modalVisible}
                destroyOnHidden
                maskClosable={false}
                confirmLoading={actionLoading}
                mask={{
                    closable: false,
                }}
                onCancel={() => setModalVisible(false)}
                onOk={() => {
                    handlerOK();
                }}
            >
                {/* 审批意见框通过内容 padding 撑高，与后续弹出的节点选择框形成层级区分，
                    避免被完全遮挡。padding 只增加少量高度，内容依旧紧凑，不会像
                    minHeight 固定高度那样在内容不满时产生大片空白。 */}
                <div
                    style={{
                        padding: 16,
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
                    {state.flow?.signRequired && currentOperator && (
                        <Form.Item
                            name={"signKey"}
                            label={"审批签名"}
                            required={state.flow?.signRequired}
                            rules={[
                                {
                                    required: true,
                                    message: '请设置审批签名'
                                }
                            ]}
                        >
                            <SignKeyView
                                current={currentOperator}
                                action={actionRef}
                            />
                        </Form.Item>
                    )}
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
                </div>

            </ResizableModal>

            {options && options.length > 0 && responseType === 'OPERATOR_SELECT' && (
                <OperatorSelectView
                    options={options}
                    onChange={(operatorSelectMap) => {
                        setOptions([]);
                        setResponseType(null);
                        if (Object.keys(operatorSelectMap).length > 0) {
                            handleSubmit({
                                ...request,
                                operatorSelectMap,
                            });
                        }
                    }}
                />
            )}

            {options && options.length > 0 && responseType !== 'OPERATOR_SELECT' && (
                <ManualView
                    options={options}
                    onChange={(value) => {
                        setOptions([]);
                        setResponseType(null);
                        if (value) {
                            handleSubmit({
                                ...request,
                                manualNodeId: value,
                            });
                        }
                    }}
                />
            )}
        </>
    )
}
