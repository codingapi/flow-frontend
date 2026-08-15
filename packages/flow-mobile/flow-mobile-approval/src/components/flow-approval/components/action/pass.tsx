import React from "react";
import {Form, TextArea, Toast} from "antd-mobile";
import {PopupModal} from "@coding-flow/flow-mobile-ui";
import {FlowActionProps} from "./type";
import {ApprovalViewPluginAction, DialogContent, useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {SignKeyView} from "@/plugins/view/sign-key-view";
import {EventBus, ViewBindPlugin, FlowMessageKey, FlowMessageRegistry} from "@coding-flow/flow-core";
import {NodeOption} from "@coding-flow/flow-types";
import {OperatorSelectView} from "@/plugins/view/operator-select-view";
import {ManualView} from "@/plugins/view/manual-view";
import {APPROVAL_ACTION_PASS_KEY} from "@/components/flow-approval";

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
    const [options, setOptions] = React.useState<NodeOption[]>([]);
    const [request, setRequest] = React.useState<any>({});
    const [responseType, setResponseType] = React.useState<string | null>(null);

    const isStartNode = state.flow?.nodeType === 'START';
    const actionLoading = state.actionLoading ?? false;

    const currentOperator = state.flow?.currentOperator;

    const [form] = Form.useForm();

    /** 打开弹框：解析自定义弹框内容（标题/中间内容），并重置表单 */
    const openModal = () => {
        form.resetFields();
        setDialogContent(null);
        actionPresenter.resolveDialogContent(action.id).then(setDialogContent);
        setModalVisible(true);
    }

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


    const handleSubmit = (params?: any) => {
        actionPresenter.action(action.id, params).then((res) => {
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

    const adviceRules = state.flow?.adviceRequired ? [
        {
            required: state.flow?.adviceRequired || false,
            message: '请输入审批意见'
        }
    ] : [];

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
                    {!state.flow?.adviceHidden && (
                        <Form.Item
                            name={"advice"}
                            label={"审批意见"}
                            required={state.flow?.adviceRequired}
                            rules={adviceRules}
                        >
                            <TextArea placeholder={"请输入审批意见"}/>
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
