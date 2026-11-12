import React from "react";
import {ActiveFormAction, useApprovalContext, useMockContext} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {FlowFormView} from "@coding-flow/flow-pc-form";
import {createFormInstance} from "@coding-form/form-engine";
import {detail} from "@/api/record";
import type {FlowContent, FlowTodo} from "@coding-flow/flow-types";

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

    /**
     * 每条待办记录对应一个表单实例。
     *
     * 必须按待办记录记忆化：合并审批查看单条流程会刷新按钮/候选人并触发重渲染，
     * 若每次渲染都重建表单实例，被查看记录的表单初始数据会丢失（初始值只写入一次），
     * 提交时取到的是空表单。
     */
    const formList = React.useMemo(() => {
        const createItem = (item?: FlowTodo) => {
            const values = {
                ...context.getInitData(),
                ...item?.data,
                recordId: item?.recordId,
            };
            return {
                form: createFormInstance(flowForm as any),
                data: item,
                values,
                initialized: false,
            }
        }
        return todos.length > 0 ? todos.map(item => createItem(item)) : [createItem(undefined)];
    }, [flowForm, todos]);

    /**
     * 表单动作（保存/校验）跟随「当前查看或提交的记录」。
     *
     * FormActionContext 以固定 key 只保留一个动作，不能逐条记录注册（后注册的会被丢弃），
     * 也不能恒定读取第一条记录的表单实例：合并审批查看第二条记录时，第一条记录的表单已卸载，
     * getFieldsValue() 返回 {}，提交会因 formData 为空被服务端拒绝。
     */
    const activeForm = React.useRef<ActiveFormAction>();

    React.useEffect(() => {
        const formAction = new ActiveFormAction(context.getPresenter().getFormActionContext());
        activeForm.current = formAction;
        formAction.register();
        return () => formAction.unregister();
    }, []);

    React.useEffect(() => {
        formList.forEach(item => {
            if (item.initialized) {
                return;
            }
            item.initialized = true;
            item.form.resetFields();
            item.form.setFieldsValue(item.values);
        });
        // 默认提交「打开详情的那条记录」；合并审批查看单条流程时由 handleMergeRecordView 切换
        activeForm.current?.switchTo(
            formList.find(item => item.data?.recordId === state.flow?.recordId) || formList[0]
        );
    }, [formList, state.flow?.recordId]);

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
        // 同步切换提交所用的表单实例（详情刷新是异步的，期间提交不能落到上一条记录的表单上）
        activeForm.current?.switchTo(formList.find(item => item.data?.recordId === recordId));
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
