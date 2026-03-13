import React from "react";
import {FlowActionProps} from "./type";
import {Form, Toast} from "antd-mobile";
import {useApprovalContext} from "@flow-engine/flow-approval-presenter";
import {DelegateView} from "@/plugins/view/delegate-view";
import {EventBus} from "@flow-engine/flow-core";
import {PopupModal} from "@flow-engine/flow-mobile-ui";

/**
 * 委派
 * @param props
 * @constructor
 */
export const DelegateAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const {context} = useApprovalContext();
    const [form] = Form.useForm();

    const actionPresenter = context.getPresenter().getFlowActionPresenter();

    const [modalVisible, setModalVisible] = React.useState(false);

    const handleSubmit = (params?: any) => {
        actionPresenter.action(action.id, params).then((res) => {
            if (res.success) {
                Toast.show("操作成功");
                setModalVisible(false);
                context.close();
            }
        });
    }

    React.useEffect(()=>{
        EventBus.getInstance().on(action.id,()=>{
            form.resetFields();
            setModalVisible(true);
        });

        return () => {
            EventBus.getInstance().off(action.id);
        }
    },[]);

    return (
        <>
            <PopupModal
                title={"委派审批"}
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
                        name={"forwardOperatorIds"}
                        label={"委派人员"}
                        required={true}
                        rules={[
                            {
                                required: true,
                                message:'委派人员不能为空'
                            }
                        ]}
                    >
                        <DelegateView/>
                    </Form.Item>
                </Form>
            </PopupModal>
        </>
    )
}