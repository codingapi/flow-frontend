import React from "react";
import {useApprovalContext, useMockContext} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {FlowFormView} from "@coding-flow/flow-pc-form";
import {createFormInstance} from "@coding-form/form-engine";
import {detail} from "@/api/record";
import type {FlowContent} from "@coding-flow/flow-types";

interface FormViewComponentProps {
    onValuesChange?: (values: any) => void;
}

export const FormViewComponent: React.FC<FormViewComponentProps> = (props) => {
    const {state, context} = useApprovalContext();
    const review = state.review || false;
    const ViewComponent = ViewBindPlugin.getInstance().get(state.flow?.view || 'default') || FlowFormView;
    const viewCode = state.flow?.code;

    const flowForm = state.flow?.form;
    const fieldPermissions = state.flow?.fieldPermissions || [];

    const formMeta = React.useMemo(() => {
        return context.convertMeta(flowForm || undefined, fieldPermissions);
    }, [flowForm,fieldPermissions]);

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

    const mockKey = useMockContext();

    // 合并审批进入单条流程前保存的原始按钮/选人范围，返回合并列表时恢复
    const mergeOriginFlow = React.useRef<FlowContent>();

    /**
     * 合并审批中查看单条流程。
     *
     * 合并列表的按钮与候选人来自「打开详情的那条记录」，查看某一条流程时必须切换成
     * 该记录自己的 actions / currentNodeOperators，否则减签等按流程实例计算的动作无法操作。
     */
    const handleMergeRecordView = (recordId?: number) => {
        const presenter = context.getPresenter();
        if (!recordId) {
            if (mergeOriginFlow.current) {
                presenter.updateState({
                    flow: mergeOriginFlow.current,
                    mergeSingleRecordId: undefined,
                });
                mergeOriginFlow.current = undefined;
            }
            return;
        }
        const currentFlow = presenter.getState().flow;
        if (!mergeOriginFlow.current) {
            mergeOriginFlow.current = currentFlow;
        }
        detail(recordId + '', mockKey).then((res) => {
            if (res.success && res.data) {
                const single = res.data as FlowContent;
                const latestFlow = presenter.getState().flow || currentFlow;
                presenter.updateState({
                    mergeSingleRecordId: recordId,
                    flow: {
                        ...(latestFlow as FlowContent),
                        recordId: single.recordId,
                        actions: single.actions,
                        actionList: single.actionList,
                        currentNodeOperators: single.currentNodeOperators,
                    },
                });
            }
        });
    }

    if (ViewComponent && formMeta) {
        if (mergeable) {
            return (
                <ViewComponent
                    mergeable={mergeable}
                    fieldPermissions={fieldPermissions}
                    review={review}
                    meta={formMeta}
                    initData={context.getInitData()}
                    formList={formList as any}
                    onValuesChange={props.onValuesChange}
                    onMergeRecordIdsSelected={handleMergeRecordIdsSelected}
                    onMergeRecordView={handleMergeRecordView}
                    viewCode={viewCode}
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
                        meta={formMeta}
                        form={item.form as any}
                        onValuesChange={props.onValuesChange}
                        viewCode={viewCode}
                    />
                ))}
            </>
        )
    }
}
