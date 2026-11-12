import {FormActionContext} from "@coding-flow/flow-types";

/**
 * 审批表单动作的固定 key。
 *
 * 与各端表单视图注册的 key 保持一致，切换记录时通过该 key 移除旧动作，
 * 避免 {@link FormActionContext#addAction} 因 key 重复而丢弃新的表单实例。
 */
export const VIEW_FORM_ACTION_KEY = 'view-form';

/**
 * 单条流程记录对应的表单实例。
 *
 * 合并审批中每条待办记录各有一个表单实例，`values` 为该记录下发的表单数据，
 * 用于表单实例尚未挂载（合并列表未「查看」该记录）或已卸载时兜底，
 * 避免提交空 formData 被服务端以必填校验拒绝。
 */
export interface ApprovalFormItem {
    /** 表单实例 */
    form: {
        getFieldsValue(): Record<string, any>;

        validateFields(): Promise<Record<string, any>>;
    };
    /** 记录对应的表单初始数据 */
    values: Record<string, any>;
}

/**
 * 审批表单动作（保存 / 校验）的当前记录跟随器。
 *
 * <p>背景：`FormActionContext` 以固定 key 只保留一个表单动作，而合并审批界面可以切换查看
 * 不同的流程记录。如果注册时逐条记录注册、或始终读取第一条记录的表单实例，就会出现：
 * <ul>
 *     <li>查看第二条记录时，读取的是未挂载的第一条记录表单实例，`getFieldsValue()` 返回 `{}`；</li>
 *     <li>提交请求因此携带 `formData: {}`，被服务端 `Required field formData cannot be empty` 拒绝；</li>
 *     <li>减签等不依赖表单数据的动作也被这条通用校验拦截。</li>
 * </ul>
 *
 * <p>本类只注册一个动作，保存/校验时委托给「当前正在查看或提交的记录」的表单实例，
 * 表单实例未挂载时用记录初始数据兜底。
 */
export class ActiveFormAction {

    private readonly formActionContext: FormActionContext;

    private current?: ApprovalFormItem;

    public constructor(formActionContext: FormActionContext) {
        this.formActionContext = formActionContext;
    }

    /**
     * 注册表单动作。重复调用会先移除旧动作，保证切换组件/重新打开详情时不残留。
     */
    public register(): void {
        this.formActionContext.removeAction(VIEW_FORM_ACTION_KEY);
        this.formActionContext.addAction({
            key: () => VIEW_FORM_ACTION_KEY,
            save: () => this.save(),
            validate: () => this.validate(),
        });
    }

    /**
     * 注销表单动作（组件卸载时调用）。
     */
    public unregister(): void {
        this.current = undefined;
        this.formActionContext.removeAction(VIEW_FORM_ACTION_KEY);
    }

    /**
     * 切换当前正在查看/提交的记录表单。
     *
     * @param item 记录对应的表单实例，为空表示没有可提交的表单
     */
    public switchTo(item?: ApprovalFormItem): void {
        this.current = item;
    }

    /**
     * 当前记录的表单数据。
     *
     * <p>表单实例已挂载时以表单最新值为准（审批人可能编辑过字段）；未挂载时
     * `getFieldsValue()` 返回空对象，此时使用记录下发的初始数据兜底。
     */
    public save(): Record<string, any> {
        const item = this.current;
        if (!item) {
            return {};
        }
        return {...item.values, ...item.form.getFieldsValue()};
    }

    /**
     * 校验当前记录的表单，返回表单数据（口径与 {@link #save()} 一致）。
     */
    public validate(): Promise<Record<string, any>> {
        const item = this.current;
        if (!item) {
            return Promise.resolve({});
        }
        return item.form.validateFields()
            .then(values => ({...item.values, ...values}));
    }
}
