import React from "react";
import {FlowActionProps} from "./type";
import {Form, Input, message, Modal} from "antd";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {SignKeyView} from "@/plugins/view/sign-key-view";
import {CustomStyleButton} from "@/components/flow-approval/components/custom-style-button";
import {NodeOption} from "@coding-flow/flow-types";
import {OperatorSelectView} from "@/plugins/view/operator-select-view";

const {TextArea} = Input;

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

    const [responseType, setResponseType] = React.useState<string | null>(null);

    const isStartNode = state.flow?.nodeType === 'START';

    const currentOperator = state.flow?.currentOperator;

    const [form] = Form.useForm();

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
                    message.success("操作成功");
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

    return (
        <>
            <CustomStyleButton
                display={props.action.display}
                onClick={() => {
                    if(props.onClickCheck?.(action.id)) {
                        if (isStartNode) {
                            handleSubmit();
                        } else {
                            form.resetFields();
                            setModalVisible(true);
                        }
                    }
                }}
                title={action.title}
            />

            <Modal
                title={"审批通过"}
                open={modalVisible}
                destroyOnHidden
                onCancel={() => setModalVisible(false)}
                onOk={() => {
                    form.submit();
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
                            />
                        </Form.Item>
                    )}
                </Form>

            </Modal>

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
        </>
    )
}
