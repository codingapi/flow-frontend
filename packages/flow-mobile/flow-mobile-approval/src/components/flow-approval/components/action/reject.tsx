import React from "react";
import {FlowActionProps} from "./type";
import {Form, TextArea, Toast} from "antd-mobile";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {PopupModal} from "@coding-flow/flow-mobile-ui";
import {EventBus, ViewBindPlugin} from "@coding-flow/flow-core";
import {APPROVAL_ACTION_REJECT_KEY} from "@/components/flow-approval";

/**
 * 拒绝
 * @param props
 * @constructor
 */
export const RejectAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const {state, context} = useApprovalContext()
    const actionPresenter = context.getPresenter().getFlowActionPresenter();
    const [modalVisible, setModalVisible] = React.useState(false);
    const [form] = Form.useForm();


    React.useEffect(() => {
        EventBus.getInstance().on(action.id, () => {
            form.resetFields();
            setModalVisible(true);
        });

        return () => {
            EventBus.getInstance().off(action.id);
        }
    }, []);

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

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_REJECT_KEY);

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
                title={"审批拒绝"}
                open={modalVisible}
                onClose={() => setModalVisible(false)}
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
                        label={"拒绝意见"}
                        required={state.flow?.adviceRequired}
                        rules={adviceRules}
                    >
                        <TextArea placeholder={"请输入拒绝意见"}/>
                    </Form.Item>
                </Form>
            </PopupModal>
        </>
    )
}