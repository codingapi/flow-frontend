import React from "react";
import {Form, Input} from "antd-mobile";
import {FormView} from "@coding-form/form-engine";
import {FieldPermission, FlowForm, FlowTodo, FormInstance} from "@coding-flow/flow-types";

interface FlowFormViewProps{
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

export const FlowFormView:React.FC<FlowFormViewProps> = (props)=>{
    const form = props.form;
    const meta = props.meta;
    const review = props.review;
    return (
        <>
            <FormView
                form={form as any}
                layout={"vertical"}
                meta={meta}
                review={review}
                onValuesChange={(partial, values,formCode)=>{
                    props.onValuesChange?.(values);
                }}
            >
                <Form.Item
                    key={"recordId"}
                    name={"recordId"}
                    hidden={true}
                >
                    <Input/>
                </Form.Item>
            </FormView>
        </>
    )
}