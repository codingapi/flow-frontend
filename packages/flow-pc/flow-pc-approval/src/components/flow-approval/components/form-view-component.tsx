import React from "react";
import {
    ActiveFormAction,
    useApprovalContext,
    useMockContext,
    type ApprovalFormItem,
} from "@coding-flow/flow-approval-presenter";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {FlowFormView} from "@coding-flow/flow-pc-form";
import {createFormInstance} from "@coding-form/form-engine";
import {detail} from "@/api/record";
import type {FlowContent, FlowTodo, FormInstance} from "@coding-flow/flow-types";

interface FormViewComponentProps {
    onValuesChange?: (values: any) => void;
}

/** 合并审批中一条待办记录对应的表单实例 */
interface MergeFormItem extends ApprovalFormItem {
    form: FormInstance;
    data?: FlowTodo;
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
     * 每条待办记录对应一个表单实例（合并审批可逐条查看）。
     *
     * 注意：createFormInstance 内部执行 Form.useForm()，本质是 hook 工厂，每次调用都会向当前
     * 组件注册 hook（useRef/useMemo 等）。因此每次渲染必须按相同顺序、相同次数调用，
     * 不能用 useMemo 缓存或跳过调用，否则 hook 数量变化会抛
     * `Cannot read properties of undefined (reading 'length')`（areHookInputsEqual）。
     * 这里每次渲染都按待办记录调用一次，仅保留首次创建的实例，保证实例身份稳定
     * （合并审批查看单条时的编辑值与校验都依赖同一个实例）。
     */
    const formItemCache = React.useRef<Map<number | undefined, MergeFormItem>>(new Map());
    const formList: MergeFormItem[] = (todos.length > 0 ? todos : [undefined]).map(item => {
        // 占位调用：维持 hook 调用次数（实例命中缓存时该实例不会被使用）
        const createdForm = createFormInstance(flowForm as any);
        const recordId = item?.recordId;
        const cached = formItemCache.current.get(recordId);
        if (cached) {
            return cached;
        }
        const values = {
            ...context.getInitData(),
            ...item?.data,
            recordId,
        };
        createdForm.setFieldsValue(values);
        const formItem: MergeFormItem = {
            form: createdForm,
            data: item,
            values,
        };
        formItemCache.current.set(recordId, formItem);
        return formItem;
    });

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
