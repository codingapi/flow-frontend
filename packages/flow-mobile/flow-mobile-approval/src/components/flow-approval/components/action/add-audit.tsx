import React from "react";
import {FlowActionProps} from "./type";
import {Form, Toast} from "antd-mobile";
import {ApprovalViewPluginAction, DialogContent, useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {AddAuditView} from "@/plugins/view/add-audit-view";
import {PopupModal} from "@coding-flow/flow-mobile-ui";
import {EventBus, ViewBindPlugin, FlowMessageKey, FlowMessageRegistry} from "@coding-flow/flow-core";
import {APPROVAL_ACTION_ADD_AUDIT_KEY} from "@/components/flow-approval";

/**
 * 加签
 * @param props
 * @constructor
 */
export const AddAuditAction: React.FC<FlowActionProps> = (props) => {

    const action = props.action;
    const {state, context} = useApprovalContext();
    const [form] = Form.useForm();

    const actionPresenter = context.getPresenter().getFlowActionPresenter();
    const actionLoading = state.actionLoading ?? false;

    const [modalVisible, setModalVisible] = React.useState(false);
    const [dialogContent, setDialogContent] = React.useState<DialogContent | null>(null);

    const actionRef = React.useRef<ApprovalViewPluginAction>(null);

    /** 打开弹框：解析自定义弹框内容（标题/中间内容），并重置表单 */
    const openModal = () => {
        form.resetFields();
        setDialogContent(null);
        actionPresenter.resolveDialogContent(action.id).then(setDialogContent);
        setModalVisible(true);
    }

    const handlerOK = ()=>{
        // 自定义弹框内容时退化为纯确认框，直接提交（无表单可校验）
        if(dialogContent?.content){
            handleSubmit();
            return;
        }
        if(actionRef.current){
            actionRef.current.onValidate().then(res=>{
                if(res){
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
                Toast.show(
                    FlowMessageRegistry.getInstance().get(
                        FlowMessageKey.APPROVAL_ADD_AUDIT,
                        actionPresenter.buildActionContext(action.id)
                    )
                );
                setModalVisible(false);
                context.close();
            }
        });
    }

    React.useEffect(()=>{
        EventBus.getInstance().on(action.id,()=>{
            openModal();
        });

        return () => {
            EventBus.getInstance().off(action.id);
        }
    },[]);

    const ActionView = ViewBindPlugin.getInstance().get(APPROVAL_ACTION_ADD_AUDIT_KEY);

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
                title={dialogContent?.title ?? "加签审批"}
                open={modalVisible}
                loading={actionLoading}
                onClose={() => setModalVisible(false)}
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
                    <Form.Item
                        name={"forwardOperatorIds"}
                        label={"加签人员"}
                        required={true}
                        rules={[
                            {
                                required: true,
                                message:'加签人员不能为空'
                            }
                        ]}
                    >
                        <AddAuditView
                            action={actionRef}
                            maxOperatorCount={action.maxOperatorCount}
                        />
                    </Form.Item>
                </Form>
                )}
            </PopupModal>
        </>
    )
}