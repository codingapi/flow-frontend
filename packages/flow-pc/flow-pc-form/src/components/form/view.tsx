import React from "react";
import {FormItemFactory} from "@/components/factory/form-item-factory";
import {ObjectUtils} from "@flow-engine/flow-core";
import { Form,Input } from "antd";
import {FormInstance} from "@flow-engine/flow-types";
import {FieldPermission,FlowForm,FlowTodo} from "@flow-engine/flow-types";

interface FormViewProps{
    /** 流程数据 **/
    data?:FlowTodo
    /** 表单操控对象 */
    form: FormInstance;
    /** 表单数据更新事件 */
    onValuesChange?: (values: any) => void;
    /** 表单元数据对象 */
    meta: FlowForm;
    /** 表单字段权限,为空时全部可写*/
    fieldPermissions: FieldPermission[];
    /** 是否预览模式 */
    review: boolean;
}

export const FormView:React.FC<FormViewProps> = (props)=>{
    const [values, setValues] = React.useState<any>({});
    const form = props.form;
    const meta = props.meta;
    const fields = meta.fields || [];

    const review = props.review;
    return (
        <>
            <Form
                form={form as any}
                layout={"vertical"}
                onBlur={() => {
                    const latestValues = form.getFieldsValue();
                    if (ObjectUtils.isEqual(values, latestValues)) {
                        return;
                    }
                    setValues(latestValues);
                    props.onValuesChange?.(latestValues);
                }}
            >
                <Form.Item
                    key={"recordId"}
                    name={"recordId"}
                    hidden={true}
                >
                    <Input/>
                </Form.Item>
                {fields.map((field, i) => {
                    const FormItem = FormItemFactory.getInstance().createFrom(field.type);
                    if (FormItem) {
                        return (
                            <FormItem
                                key={field.id}
                                {...field}
                                readOnly={review}
                            />
                        );
                    }
                })}
            </Form>
        </>
    )
}