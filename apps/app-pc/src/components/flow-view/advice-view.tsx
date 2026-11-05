import React from "react";
import { Input, Space, Tag, Typography } from "antd";
import type { FlowAction } from "@coding-flow/flow-types";
import { ResolvedAdvicePolicy, useApprovalContext } from "@coding-flow/flow-approval-presenter";

const { TextArea } = Input;

/**
 * 按流程编码区分的常用意见（示例数据）。
 *
 * workCode 即流程设计编码（流程内容 FlowContent.workCode），不同流程可配置各自的模板；
 * 实际接入时替换为宿主自己的接口，例如：
 * GET /api/host/flow-advice-templates?workCode=xxx&operatorId=xxx
 * 引擎不存储用户偏好与业务文案，只负责渲染插槽与透传策略。
 */
const WORKFLOW_ADVICE_TEMPLATES: Record<string, string[]> = {
    leave: ['同意，准假', '请补充请假事由', '假期余额不足，建议调整'],
    expense: ['金额已核对，同意报销', '发票信息不完整，请补充', '超出预算标准，请说明'],
};

/** 未匹配到流程编码时的兜底常用意见 */
const DEFAULT_ADVICE_TEMPLATES = [
    '同意，按计划执行',
    '已核实，同意',
    '请补充相关材料',
];

export interface AdviceViewProps {
    /** 由 Form.Item 注入的受控值 */
    value?: string;
    /** 由 Form.Item 注入的值变更回调 */
    onChange?: (value: string) => void;
    /** 当前审批动作（含 type，可用于区分通过/驳回等） */
    action?: FlowAction;
    /** 生效的意见策略（节点策略 + 宿主策略合并结果） */
    policy?: ResolvedAdvicePolicy | null;
}

/**
 * 自定义审批意见输入框。
 *
 * 通过 ViewBindPlugin 注册到 APPROVAL_ADVICE_VIEW_KEY 后，只替换意见输入框本身，
 * 提交链路、必填校验、签名、选人等默认逻辑保持不变（见 §3.10）。
 *
 * 快捷意见来源：
 * 1. policy.templates —— 由 AdvicePolicyProvider 按动作类型下发；
 * 2. 宿主常用意见 —— 按流程编码（workCode）区分，未命中时使用兜底模板。
 */
export const AdviceView: React.FC<AdviceViewProps> = (props) => {

    const { value, onChange, action, policy } = props;

    const { state } = useApprovalContext();

    // 流程编码 / 流程标题：同一套引擎页面服务多个流程时，据此区分模板
    const workCode = state.flow?.workCode ?? '';
    const flowTitle = state.flow?.workTitle ?? '';

    const templates = React.useMemo(() => {
        const hostTemplates = WORKFLOW_ADVICE_TEMPLATES[workCode] ?? DEFAULT_ADVICE_TEMPLATES;
        const merged = [
            ...(policy?.templates ?? []),
            ...hostTemplates,
        ];
        return Array.from(new Set(merged));
    }, [policy?.templates, workCode]);

    return (
        <div>
            <TextArea
                rows={4}
                showCount
                maxLength={policy?.maxLength ?? 500}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder="请输入审批意见"
            />
            <div style={{ marginTop: 8 }}>
                <Typography.Text type="secondary" style={{ marginRight: 8 }}>
                    常用意见（{flowTitle || workCode || '通用'} · {action?.type ?? '-'}）
                </Typography.Text>
                <Space size={[4, 4]} wrap>
                    {templates.map((template) => (
                        <Tag
                            key={template}
                            color={value === template ? 'blue' : undefined}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onChange?.(template)}
                        >
                            {template}
                        </Tag>
                    ))}
                </Space>
            </div>
        </div>
    );
};
