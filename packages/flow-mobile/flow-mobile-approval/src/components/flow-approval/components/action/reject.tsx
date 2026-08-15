import React from "react";
import {FlowActionProps} from "./type";
import {Form, TextArea, Toast} from "antd-mobile";
import {DialogContent, useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {PopupModal} from "@coding-flow/flow-mobile-ui";
import {EventBus, ViewBindPlugin, FlowMessageKey, FlowMessageRegistry} from "@coding-flow/flow-core";
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
    const actionLoading = state.actionLoading ?? false;
    const [modalVisible, setModalVisible] = React.useState(false);
    const [dialogContent, setDialogContent] = React.useState<DialogContent | null>(null);
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
            openModal();
        });

        return () => {
            EventBus.getInstance().off(action.id);
        }
    }, []);

    const handleSubmit = (params?: any) => {
        actionPresenter.action(action.id, params).then((res) => {
            if (res.success) {
                Toast.show(
                    FlowMessageRegistry.getInstance().get(
                        FlowMessageKey.APPROVAL_REJECT,
                        actionPresenter.buildActionContext(action.id)
                    )
                );
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
                title={dialogContent?.title ?? "审批拒绝"}
                open={modalVisible}
                loading={actionLoading}
                onClose={() => setModalVisible(false)}
                onOk={() => {
                    // 自定义弹框内容时退化为纯确认框，直接提交（无表单可校验）
                    if (dialogContent?.content) {
                        handleSubmit();
                        return;
                    }
                    form.submit();
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
                            label={"拒绝意见"}
                            required={state.flow?.adviceRequired}
                            rules={adviceRules}
                        >
                            <TextArea placeholder={"请输入拒绝意见"}/>
                        </Form.Item>
                    )}
                </Form>
                )}
            </PopupModal>
        </>
    )
}