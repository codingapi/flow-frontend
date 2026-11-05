import React from "react";
import {Form, TextArea, Toast} from "antd-mobile";
import {PopupModal} from "@coding-flow/flow-mobile-ui";
import {FlowActionProps} from "./type";
import {ApprovalViewPluginAction, DialogContent, ResolvedAdvicePolicy, useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {SignKeyView} from "@/plugins/view/sign-key-view";
import {EventBus, ViewBindPlugin, FlowMessageKey, FlowMessageRegistry} from "@coding-flow/flow-core";
import {NodeOption} from "@coding-flow/flow-types";
import {OperatorSelectView} from "@/plugins/view/operator-select-view";
import {ManualView} from "@/plugins/view/manual-view";
import {APPROVAL_ACTION_PASS_KEY, APPROVAL_ADVICE_VIEW_KEY} from "@/components/flow-approval";

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

    /** 生效的审批意见策略（节点策略 + 宿主策略合并结果） */
    const [advicePolicy, setAdvicePolicy] = React.useState<ResolvedAdvicePolicy | null>(null);

    /** 提交链路通过 ref 读取策略，避免 EventBus 监听器闭包捕获旧值 */
    const advicePolicyRef = React.useRef<ResolvedAdvicePolicy | null>(null);
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

    React.useEffect(() => {
        EventBus.getInstance().on(action.id, () => {
            if (isStartNode) {
                handleSubmit();
            } else {
                openModal();
            }
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


    /**
     * 补充策略默认意见。
     *
     * 意见框隐藏（或发起节点未弹窗）时表单不会产生 advice 字段，
     * 此处以策略默认内容补齐，避免命中服务端意见必填校验。
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

    const adviceRequired = advicePolicy?.required ?? state.flow?.adviceRequired ?? false;

    const adviceHidden = advicePolicy?.hidden ?? state.flow?.adviceHidden ?? false;

    const adviceRules = adviceRequired ? [
        {
            required: true,
            message: '请输入审批意见'
        }
    ] : [];

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_PASS_KEY);

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
                    {!adviceHidden && (
                        <Form.Item
                            name={"advice"}
                            label={"审批意见"}
                            required={adviceRequired}
                            rules={adviceRules}
                        >
                            {AdviceView ? (
                                <AdviceView action={action} policy={advicePolicy}/>
                            ) : (
                                <TextArea placeholder={"请输入审批意见"}/>
                            )}
                        </Form.Item>
                    )}

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
