import { FlowAction, FlowContent } from "@coding-flow/flow-types";

/**
 * 审批意见默认长度上限。
 *
 * 与默认视图保持一致，宿主未显式指定 maxLength 时使用该值。
 */
export const DEFAULT_ADVICE_MAX_LENGTH = 500;

/**
 * 审批意见策略。
 *
 * 全部字段可选，未提供的字段沿用节点策略（服务端下发的 adviceRequired / adviceHidden）。
 * 典型场景：通过时隐藏意见框并静默填入「同意」，驳回时提供快捷意见模板。
 */
export interface AdvicePolicy {
    /** 是否隐藏意见输入框（隐藏时建议同时提供 defaultContent，以便静默提交） */
    hidden?: boolean;
    /** 意见是否必填；隐藏时该配置不生效 */
    required?: boolean;
    /** 默认意见（打开弹框时预填，隐藏时作为静默提交的内容） */
    defaultContent?: string;
    /** 快捷意见模板（由宿主决定合并规则与来源） */
    templates?: string[];
    /** 意见最大长度，缺省使用 {@link DEFAULT_ADVICE_MAX_LENGTH} */
    maxLength?: number;
}

/**
 * 审批意见策略提供器执行上下文。
 *
 * 与 {@link ActionInterceptorContext} 对齐，额外提供当前流程内容，
 * 便于宿主按「动作 + 节点」组织策略：
 * - 按 actionId 匹配：区分同为 CUSTOM 的不同自定义按钮；
 * - 按 actionType 匹配：通过 `context.action?.type` 对所有同类型按钮统一配置；
 * - 按节点匹配：通过 `context.flow?.nodeType` 区分发起节点与审批节点。
 */
export interface AdvicePolicyContext {
    /** 触发的动作 ID */
    actionId: string;
    /** 触发的动作对象（未找到时为 null） */
    action: FlowAction | null;
    /** 当前流程内容（发起节点等场景可能为空） */
    flow?: FlowContent | null;
}

/**
 * 审批意见策略提供器。
 *
 * 返回 AdvicePolicy 表示覆盖；返回 null / undefined 表示不覆盖（沿用节点策略）。
 * 支持同步与异步。
 */
export type AdvicePolicyProvider = (
    context: AdvicePolicyContext
) => AdvicePolicy | null | undefined | Promise<AdvicePolicy | null | undefined>;

/**
 * 合并后的生效意见策略（节点策略 + 宿主策略）。
 */
export interface ResolvedAdvicePolicy {
    /** 是否隐藏意见输入框 */
    hidden: boolean;
    /** 意见是否必填（隐藏时恒为 false） */
    required: boolean;
    /** 默认意见内容 */
    defaultContent: string;
    /** 快捷意见模板（已去重） */
    templates: string[];
    /** 意见最大长度 */
    maxLength: number;
}

/**
 * 合并节点策略与宿主策略，得到最终生效的意见策略。
 *
 * 规则：
 * 1. `hidden` 以宿主策略优先，未提供时沿用节点策略；
 * 2. `required` 以宿主策略优先，但隐藏意见时恒为 false，避免用户无输入入口却被拦截；
 * 3. `defaultContent` / `templates` / `maxLength` 仅在宿主提供时生效；
 * 4. `templates` 去重并保持声明顺序，`maxLength` 非正数时回退默认值。
 *
 * @param base 节点策略（来自服务端下发的流程内容）
 * @param policy 宿主策略（可为空）
 * @returns 生效的意见策略
 */
export const mergeAdvicePolicy = (
    base: { hidden?: boolean; required?: boolean },
    policy?: AdvicePolicy | null,
): ResolvedAdvicePolicy => {
    const hidden = policy?.hidden ?? base.hidden ?? false;
    const required = hidden ? false : (policy?.required ?? base.required ?? false);
    const defaultContent = policy?.defaultContent ?? '';
    const templates = Array.from(new Set((policy?.templates ?? []).filter((item) => !!item)));
    const maxLength = policy?.maxLength && policy.maxLength > 0
        ? policy.maxLength
        : DEFAULT_ADVICE_MAX_LENGTH;
    return {
        hidden,
        required,
        defaultContent,
        templates,
        maxLength,
    };
};

/**
 * 审批意见策略提供器管理器。
 *
 * 通过订阅方式注册提供器，按订阅顺序依次执行，首个返回非 null 策略者命中并短路。
 * 典型用法：自定义视图通过
 * `useApprovalContext().context.getPresenter().getFlowActionPresenter()` 获取 Presenter，
 * 调用 `addAdvicePolicyProvider(provider)` 订阅，返回的函数用于取消订阅。
 */
export class AdvicePolicyManager {

    private providers: AdvicePolicyProvider[] = [];

    /**
     * 订阅策略提供器
     * @param provider 提供器函数
     * @returns 取消订阅函数
     */
    public add(provider: AdvicePolicyProvider): () => void {
        this.providers.push(provider);
        return () => {
            this.remove(provider);
        };
    }

    /**
     * 移除指定提供器
     * @param provider 待移除的提供器函数
     */
    public remove(provider: AdvicePolicyProvider): void {
        const index = this.providers.findIndex(item => item === provider);
        if (index !== -1) {
            this.providers.splice(index, 1);
        }
    }

    /**
     * 清空全部提供器
     */
    public clear(): void {
        this.providers = [];
    }

    /**
     * 当前订阅的提供器数量
     */
    public size(): number {
        return this.providers.length;
    }

    /**
     * 按订阅顺序依次执行所有提供器（支持异步）。
     * 首个返回非 null 策略者命中并立即返回；全部未命中返回 null。
     * @param context 提供器上下文
     * @returns 命中的策略；未命中返回 null
     */
    public async resolve(context: AdvicePolicyContext): Promise<AdvicePolicy | null> {
        for (const provider of this.providers) {
            const policy = await provider(context);
            if (policy != null) {
                return policy;
            }
        }
        return null;
    }

}
