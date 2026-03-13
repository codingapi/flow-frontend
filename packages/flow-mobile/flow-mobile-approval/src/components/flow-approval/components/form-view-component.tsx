import React from "react";
import {useApprovalContext} from "@flow-engine/flow-approval-presenter";
import {ViewBindPlugin} from "@flow-engine/flow-core";
import {Form as AntdForm} from "antd-mobile";
import {FlowFormView} from "@flow-engine/flow-mobile-form";

interface FormViewComponentProps {
    onValuesChange?: (values: any) => void;
}

export const FormViewComponent: React.FC<FormViewComponentProps> = (props) => {
    const {state, context} = useApprovalContext();
    const review = state.review || false;
    const ViewComponent = ViewBindPlugin.getInstance().get(state.flow?.view || 'default') || FlowFormView;

    const flowForm = state.flow?.form;
    const fieldPermissions = state.flow?.fieldPermissions || [];

    // 是否可合并审批
    const mergeable = state.flow?.mergeable || false;
    const todos = state.flow?.todos || [];
    const formList = todos.length > 0 ? todos.map(item => {
        return {
            form: AntdForm.useForm()[0],
            data: item,
        }
    }) : [
        {
            form: AntdForm.useForm()[0],
            data: undefined,
        }
    ]

    React.useEffect(() => {
        formList.forEach(item => {
            const formInstance = item.form;
            const formRecord = item.data?.data;
            context.getPresenter().getFormActionContext().addAction({
                save: () => {
                    return formInstance.getFieldsValue();
                },
                key: () => {
                    return 'view-form'
                },
                validate: () => {
                    return new Promise((resolve, reject) => {
                        formInstance.validateFields()
                            .then(resolve)
                            .catch(reject)
                    })
                }
            });
            formInstance.resetFields();
            formInstance.setFieldsValue({
                ...formRecord,
                recordId: item.data?.recordId,
            });
        });
    }, []);

    const handleMergeRecordIdsSelected = (recordIds: number[]) => {
        // 提交所选的流程记录Ids
        context.getPresenter().getFlowActionPresenter().setSubmitRecordIds(recordIds);
    }

    if (ViewComponent && flowForm) {
        if (mergeable) {
            return (
                <ViewComponent
                    mergeable={mergeable}
                    fieldPermissions={fieldPermissions}
                    review={review}
                    meta={flowForm}
                    formList={formList as any}
                    onValuesChange={props.onValuesChange}
                    onMergeRecordIdsSelected={handleMergeRecordIdsSelected}
                />
            )
        }
        return (
            <>
                {formList.map((item, index) => (
                    <ViewComponent
                        key={index}
                        data={item.data}
                        mergeable={mergeable}
                        fieldPermissions={fieldPermissions}
                        review={review}
                        meta={flowForm}
                        form={item.form}
                        onValuesChange={props.onValuesChange}
                    />
                ))}
            </>
        )
    }
}
