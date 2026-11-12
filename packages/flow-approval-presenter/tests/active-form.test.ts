import {describe, expect, it, rs} from "@rstest/core";
import {FormActionContext} from "@coding-flow/flow-types";
import {ActiveFormAction, ApprovalFormItem, VIEW_FORM_ACTION_KEY} from "@/utils/active-form";

/**
 * 合并审批表单取数（bug：查看第二条流程后减签提交 formData 为 {}）
 *
 * 合并审批中每条流程记录各有一个表单实例，而 FormActionContext 只允许一个同名动作，
 * 因此必须跟随「当前正在查看/提交的记录」切换表单实例，否则会读到其它记录（或未挂载）的
 * 表单实例，取到 {}，被服务端 `Required field formData cannot be empty` 拒绝。
 */

/** 构造一条记录的表单实例：live 模拟表单实例当前值（未挂载时为 {}） */
const buildItem = (values: any, live: any = {}): ApprovalFormItem => ({
    form: {
        getFieldsValue: rs.fn(() => live),
        validateFields: rs.fn(async () => live),
    },
    values,
});

describe('合并审批表单动作', () => {

    it('切换记录后保存的是当前记录的表单实例数据', () => {
        // given 合并组内两条记录，表单一（记录1）已编辑，表单二（记录2）为原始数据
        const formActionContext = new FormActionContext();
        const activeForm = new ActiveFormAction(formActionContext);
        activeForm.register();

        const first = buildItem({recordId: 1, days: 22, desc: '22'}, {recordId: 1, days: 22, desc: '22'});
        const second = buildItem({recordId: 3658, days: 3, desc: '病假'}, {recordId: 3658, days: 3, desc: '病假'});

        // when 默认第一条，随后查看第二条记录
        activeForm.switchTo(first);
        activeForm.switchTo(second);

        // then 提交目标必须是第二条记录的表单数据
        expect(formActionContext.save()).toEqual({recordId: 3658, days: 3, desc: '病假'});
    });

    it('表单实例未挂载时用记录初始数据兜底，不提交空 formData', () => {
        // given 查看第二条记录后又返回合并列表，此时表单实例已卸载，getFieldsValue 返回 {}
        const formActionContext = new FormActionContext();
        const activeForm = new ActiveFormAction(formActionContext);
        activeForm.register();
        activeForm.switchTo(buildItem({recordId: 3658, days: 3, desc: '病假'}, {}));

        // when
        const formData = formActionContext.save();

        // then 不能用空对象提交（服务端会以 formData 必填拒绝）
        expect(formData).toEqual({recordId: 3658, days: 3, desc: '病假'});
    });

    it('表单实例已挂载时以表单最新值覆盖初始数据', () => {
        // given 审批人改写了表单字段
        const activeForm = new ActiveFormAction(new FormActionContext());
        activeForm.register();
        activeForm.switchTo(buildItem({recordId: 3658, days: 3, desc: '病假'}, {recordId: 3658, days: 5}));

        // when
        const formData = activeForm.save();

        // then 以输入为准，未挂载字段保留初始数据
        expect(formData).toEqual({recordId: 3658, days: 5, desc: '病假'});
    });

    it('校验动作同样跟随当前记录的表单实例', async () => {
        // given
        const formActionContext = new FormActionContext();
        const activeForm = new ActiveFormAction(formActionContext);
        activeForm.register();
        const item = buildItem({recordId: 3658, days: 3}, {recordId: 3658, days: 3});
        activeForm.switchTo(item);

        // when
        await formActionContext.validate();

        // then
        expect(item.form.validateFields).toHaveBeenCalledTimes(1);
    });

    it('重复注册与销毁后不残留重复动作', () => {
        // given 组件重复挂载（热更新/重新打开详情）
        const formActionContext = new FormActionContext();
        const activeForm = new ActiveFormAction(formActionContext);

        // when
        activeForm.register();
        activeForm.register();
        activeForm.unregister();

        // then
        expect(formActionContext.save()).toEqual({});
        expect(VIEW_FORM_ACTION_KEY).toBe('view-form');
    });
});
