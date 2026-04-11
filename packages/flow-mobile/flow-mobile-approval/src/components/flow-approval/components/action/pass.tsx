import React from "react";
import {Form, TextArea, Toast} from "antd-mobile";
import {PopupModal} from "@coding-flow/flow-mobile-ui";
import {FlowActionProps} from "./type";
import {ApprovalViewPluginAction, useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {SignKeyView} from "@/plugins/view/sign-key-view";
import {EventBus, ViewBindPlugin} from "@coding-flow/flow-core";
import {NodeOption} from "@coding-flow/flow-types";
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
    const [options, setOptions] = React.useState<NodeOption[]>([]);
    const [request, setRequest] = React.useState<any>({});

    const isStartNode = state.flow?.nodeType === 'START';

    const currentOperator = state.flow?.currentOperator;

    const [form] = Form.useForm();

    React.useEffect(() => {
        EventBus.getInstance().on(action.id, () => {
            if (isStartNode) {
                handleSubmit();
            } else {
                form.resetFields();
                setModalVisible(true);
            }
        });

        return () => {
            EventBus.getInstance().off(action.id);
        }
    }, []);

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
                const options = res.data?.options || [];
                if (options.length > 0) {
                    setRequest(params);
                    setOptions(options);
                } else {
                    Toast.show("操作成功");
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
                open={modalVisible}
                onClose={() => {
                    setModalVisible(false)
                }}
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
                        name={"advice"}
                        label={"审批意见"}
                        required={state.flow?.adviceRequired}
                        rules={adviceRules}
                    >
                        <TextArea placeholder={"请输入审批意见"}/>
                    </Form.Item>

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
            </PopupModal>


            {options && options.length > 0 && (
                <ManualView
                    options={options}
                    onChange={(value) => {
                        setOptions([]);
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