import { describe, expect, it } from "@rstest/core";
import { MetaService } from "@/service/meta-service";
import { FieldPermission, FlowForm } from "@coding-flow/flow-types";

/** 构造最小表单元数据 */
const buildForm = (): FlowForm => ({
    name: "反馈流程",
    code: "feedback",
    fields: [
        {
            id: "1",
            name: "用户",
            code: "username",
            type: "string",
            dataType: "STRING",
            hidden: false,
            required: false,
        },
        {
            id: "2",
            name: "备注",
            code: "remark",
            type: "string",
            dataType: "STRING",
            hidden: false,
            required: false,
        },
    ],
} as FlowForm);

describe("MetaService 字段权限转换（issue #191）", () => {

    it("READ 权限字段应标记为只读，供表单引擎渲染时禁用输入", () => {
        const permissions: FieldPermission[] = [
            { formCode: "feedback", fieldCode: "username", type: "READ" },
            { formCode: "feedback", fieldCode: "remark", type: "WRITE" },
        ];

        const meta = new MetaService(buildForm(), permissions).getFormMeta();
        const username = meta.fields.find(f => f.code === "username");
        const remark = meta.fields.find(f => f.code === "remark");

        // 表单引擎 FormItemProps 的标准只读属性为 readOnly（大写 R）
        expect(username.readOnly).toBe(true);
        expect(remark.readOnly).toBeUndefined();
    });

    it("HIDDEN 权限字段应标记隐藏", () => {
        const permissions: FieldPermission[] = [
            { formCode: "feedback", fieldCode: "username", type: "HIDDEN" },
        ];

        const meta = new MetaService(buildForm(), permissions).getFormMeta();
        const username = meta.fields.find(f => f.code === "username");

        expect(username.hidden).toBe(true);
        expect(username.required).toBe(false);
    });
});