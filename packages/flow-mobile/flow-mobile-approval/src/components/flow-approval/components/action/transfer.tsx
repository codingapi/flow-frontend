import React from "react";
import {FlowActionProps} from "./type";
import {Form, Toast, Modal} from "antd-mobile";
import {useApprovalContext} from "@flow-engine/flow-approval-presenter";
import {TransferView} from "@/plugins/view/transfer-view";
import {CustomStyleButton} from "@/components/flow-approval/components/custom-style-button";
import { EventBus } from "@flow-engine/flow-core";
import { PopupModal } from "@flow-engine/flow-mobile-ui";

/**
 * 转办
 * @param props
 * @constructor
 */
export const TransferAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const {context} = useApprovalContext();
    const [form] = Form.useForm();

    const actionPresenter = context.getPresenter().getFlowActionPresenter();

    const [modalVisible, setModalVisible] = React.useState(false);

    React.useEffect(()=>{
        EventBus.getInstance().on(action.id,()=>{
            form.resetFields();
            setModalVisible(true);
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
    return (
        <>
            <PopupModal
                title={"转办审批"}
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
                        label={"转办人员"}
                        required={true}
                        rules={[
                            {
                                required: true,
                                message:'转办人员不能为空'
                            }
                        ]}
                    >
                        <TransferView/>
                    </Form.Item>
                </Form>
            </PopupModal>
        </>
    )
}