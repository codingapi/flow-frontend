import React from "react";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {FlowFormView} from "@coding-flow/flow-mobile-form";
import { createFormInstance } from "@coding-form/form-engine";

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
            form: createFormInstance(flowForm as any),
            data: item,
        }
    }) : [
        {
            form: createFormInstance(flowForm as any),
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
                    initData={context.getInitData()}
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
                        initData={context.getInitData()}
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
