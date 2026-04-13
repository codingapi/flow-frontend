import React from "react";
import {useApprovalContext} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {FlowFormView} from "@coding-flow/flow-pc-form";
import {createFormInstance} from "@coding-form/form-engine";

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
                    const data = formInstance.getFieldsValue();
                    console.log('save:', data);
                    return data;
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
                ...context.getInitData(),
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
                    initData={context.getInitData()}
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
                        initData={context.getInitData()}
                        meta={flowForm}
                        form={item.form as any}
                        onValuesChange={props.onValuesChange}
                    />
                ))}
            </>
        )
    }
}
