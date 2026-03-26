import React from "react";
import {ObjectUtils} from "@coding-flow/flow-core";
import {FormView} from "@coding-form/form-engine";
import {Form, Input} from "antd";
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
    const [values, setValues] = React.useState<any>({});
    const form = props.form;
    const meta = props.meta;
    const review = props.review;

    return (
        <>
            <FormView
                meta={meta}
                form={form as any}
                layout={'vertical'}
                review={review}
                onBlur={()=>{
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
            </FormView>

        </>
    )
}