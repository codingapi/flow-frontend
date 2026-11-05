import React from "react";
import { Form, Input } from "antd";
import type { FormInstance } from "antd";
import type { FlowAction } from "@coding-flow/flow-types";
import {
    isAdviceVisible,
    ResolvedAdvicePolicy,
    useApprovalContext,
    withDefaultAdvice as mergeDefaultAdvice,
} from "@coding-flow/flow-approval-presenter";
import { ViewBindPlugin } from "@coding-flow/flow-core";
import { APPROVAL_ADVICE_VIEW_KEY } from "@/components/flow-approval";

const { TextArea } = Input;

/**
 * 审批意见字段状态。
 *
 * 统一封装「解析策略 → 生成校验规则 → 预填默认意见 → 提交时补齐默认意见」的公共逻辑，
 * 供通过 / 拒绝 / 退回 / 转办 / 委派 / 加签等动作视图复用。
 */
export interface AdviceFieldState {
    /** 生效的意见策略（未解析完成时为 null，此时回退节点策略） */
    policy: ResolvedAdvicePolicy | null;
    /** 重新解析策略（弹框打开前调用） */
    resolvePolicy: () => Promise<ResolvedAdvicePolicy>;
    /** 重置策略（弹框关闭或再次打开前调用） */
    resetPolicy: () => void;
    /** 意见是否必填 */
    required: boolean;
    /** 意见框是否隐藏 */
    hidden: boolean;
    /**
     * 意见框是否展示。
     *
     * - `always=true`（通过 / 拒绝）：保持原有行为，只要未隐藏即展示；
     * - `always=false`（退回 / 转办 / 委派 / 加签）：仅在节点要求必填或宿主提供策略时展示，
     *   避免对存量用户凭空多出一个输入框。
     */
    visible: boolean;
    /** 提交参数补默认意见 */
    withDefaultAdvice: (params?: any) => any;
    /** 表单预填默认意见（仅当意见为空时写入） */
    applyDefaultAdvice: (form: FormInstance) => void;
}

/**
 * 审批意见字段 Hook。
 *
 * @param actionId 动作 ID
 * @param always  是否始终保持「未隐藏即展示」的默认行为（通过 / 拒绝为 true）
 */
export const useAdvicePolicy = (actionId: string, always = false): AdviceFieldState => {

    const { state, context } = useApprovalContext();
    const presenter = context.getPresenter().getFlowActionPresenter();

    const [policy, setPolicy] = React.useState<ResolvedAdvicePolicy | null>(null);
    const policyRef = React.useRef<ResolvedAdvicePolicy | null>(null);

    const resetPolicy = React.useCallback(() => {
        policyRef.current = null;
        setPolicy(null);
    }, []);

    const resolvePolicy = React.useCallback(() => {
        return presenter.resolveAdvicePolicy(actionId).then((next) => {
            policyRef.current = next;
            setPolicy(next);
            return next;
        });
    }, [presenter, actionId]);

    const required = policy?.required ?? state.flow?.adviceRequired ?? false;

    const hidden = policy?.hidden ?? state.flow?.adviceHidden ?? false;

    const visible = isAdviceVisible({ hidden, required, hasPolicy: policy != null, always });

    const withDefaultAdvice = React.useCallback((params?: any) => {
        return mergeDefaultAdvice(params, policyRef.current?.defaultContent);
    }, []);

    const applyDefaultAdvice = React.useCallback((form: FormInstance) => {
        const defaultContent = policyRef.current?.defaultContent;
        if (!defaultContent) {
            return;
        }
        if (!form.getFieldValue('advice')) {
            form.setFieldsValue({ advice: defaultContent });
        }
    }, []);

    return {
        policy,
        resolvePolicy,
        resetPolicy,
        required,
        hidden,
        visible,
        withDefaultAdvice,
        applyDefaultAdvice,
    };
};

export interface AdviceFieldProps {
    /** 当前动作（透传给自定义意见视图） */
    action: FlowAction;
    /** 生效的意见策略 */
    policy: ResolvedAdvicePolicy | null;
    /** 是否展示（由 {@link useAdvicePolicy} 的 visible 决定） */
    visible: boolean;
    /** 是否必填 */
    required: boolean;
    /** 字段标题 */
    label?: string;
    /** 占位文案 */
    placeholder?: string;
}

/**
 * 审批意见字段。
 *
 * 注册了 `APPROVAL_ADVICE_VIEW_KEY` 时渲染自定义视图，否则渲染默认输入框；
 * 值由 Form.Item 注入的 value / onChange 受控，提交链路与校验保持默认实现。
 */
export const AdviceField: React.FC<AdviceFieldProps> = (props) => {

    const { action, policy, visible, required, label = '审批意见', placeholder = '请输入审批意见' } = props;

    const AdviceView = ViewBindPlugin.getInstance().get(APPROVAL_ADVICE_VIEW_KEY);

    if (!visible) {
        return null;
    }

    return (
        <Form.Item
            name={"advice"}
            label={label}
            required={required}
            rules={required ? [{ required: true, message: placeholder }] : []}
        >
            {AdviceView ? (
                <AdviceView action={action} policy={policy} />
            ) : (
                <TextArea
                    placeholder={placeholder}
                    maxLength={policy?.maxLength}
                    showCount={!!policy?.maxLength}
                />
            )}
        </Form.Item>
    );
};
