import React from "react";
import {Form, TextArea, Toast} from "antd-mobile";
import {PopupModal} from "@flow-engine/flow-mobile-ui";
import {FlowActionProps} from "./type";
import {useApprovalContext} from "@flow-engine/flow-approval-presenter";
import {SignKeyView} from "@/plugins/view/sign-key-view";
import {EventBus} from "@flow-engine/flow-core";


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

    const isStartNode = state.flow?.nodeType === 'START';

    const currentOperator = state.flow?.currentOperator;

    const [form] = Form.useForm();

    React.useEffect(()=>{
        EventBus.getInstance().on(action.id,()=>{
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
    },[]);

    const handleSubmit = (params?: any) => {
        actionPresenter.action(action.id, params).then((res) => {
            if (res.success) {
                Toast.show("操作成功");
                setModalVisible(false);
                context.close();
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
            <PopupModal
                open={modalVisible}
                onClose={() => {
                    setModalVisible(false)
                }}
                onOk={()=>{
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
            </PopupModal>
        </>
    )
}