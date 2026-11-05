import React from "react";
import { Input, Space, Tag, Typography } from "antd";
import type { FlowAction } from "@coding-flow/flow-types";
import type { ResolvedAdvicePolicy } from "@coding-flow/flow-approval-presenter";

const { TextArea } = Input;

/**
 * 用户级常用意见（示例数据）。
 *
 * 实际接入时替换为宿主自己的接口，例如：
 * GET /api/host/flow-advice-templates?operatorId=xxx
 * 引擎不存储用户偏好，只负责渲染插槽与透传策略。
 */
const USER_ADVICE_TEMPLATES = [
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
 * 2. USER_ADVICE_TEMPLATES —— 宿主侧的用户级常用意见。
 */
export const AdviceView: React.FC<AdviceViewProps> = (props) => {

    const { value, onChange, action, policy } = props;

    const templates = React.useMemo(() => {
        const merged = [
            ...(policy?.templates ?? []),
            ...USER_ADVICE_TEMPLATES,
        ];
        return Array.from(new Set(merged));
    }, [policy?.templates]);

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
                    常用意见{action?.type ? `（${action.type}）` : ''}
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
