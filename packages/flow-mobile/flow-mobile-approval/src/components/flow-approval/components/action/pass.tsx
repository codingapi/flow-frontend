import React from "react";
import {Form, Toast} from "antd-mobile";
import {PopupModal} from "@coding-flow/flow-mobile-ui";
import {FlowActionProps} from "./type";
import {ApprovalViewPluginAction, DialogContent, useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {SignKeyView} from "@/plugins/view/sign-key-view";
import {EventBus, ViewBindPlugin, FlowMessageKey, FlowMessageRegistry} from "@coding-flow/flow-core";
import {NodeOption} from "@coding-flow/flow-types";
import {OperatorSelectView} from "@/plugins/view/operator-select-view";
import {ManualView} from "@/plugins/view/manual-view";
import {APPROVAL_ACTION_PASS_KEY} from "@/components/flow-approval";
import {AdviceField, useAdvicePolicy} from "@/components/flow-approval/components/advice-field";

/**
 * 通过
 * @param props
 * @constructor
 */
export const PassAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const {state, context} = useApprovalContext()
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

    /**
     * 点击动作按钮。
     *
     * 发起节点默认不弹窗直接提交；但节点策略或宿主策略要求意见必填时必须弹窗，
     * 否则用户没有输入入口，服务端会抛 advice required。
     */
    const handleActionClick = () => {
        if (!isStartNode) {
            openModal();
            return;
        }
        advice.resolvePolicy().then((policy) => {
            if (policy.required) {
                openModal();
            } else {
                handleSubmit();
            }
        });
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
                    Toast.show(
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
            <PopupModal
                title={dialogContent?.title}
                open={modalVisible}
                loading={actionLoading}
                // 审批意见框保持较高高度，与后续弹出的节点选择框形成层级区分
                height="55vh"
                onClose={() => {
                    setModalVisible(false)
                }}
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
            </PopupModal>

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
