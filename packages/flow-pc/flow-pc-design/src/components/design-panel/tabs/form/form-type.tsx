import {Form, FormInstance, Select} from "antd";
import React from "react";
import {FormTypeContext} from "@flow-engine/flow-types";


interface FormTypeItemProps{
    form:FormInstance;
}

export const FormTypeItem:React.FC<FormTypeItemProps> = (props)=>{

    const {form} = props;
    const options = React.useMemo(()=>{
        return FormTypeContext.getInstance().getOptions();
    },[]);

    const labelCol = {
        style: {
            width: 100
        }
    };

    const handleOnChange = (value:string)=>{
        const type = FormTypeContext.getInstance().getType(value);
        if(type){
            form.setFieldValue('dataType',type.dataType);
        }
    }

    return (
        <Form.Item
            name={"type"}
            label={"字段类型"}
            labelCol={labelCol}
            rules={[
                {
                    required: true,
                    message: '字段类型不能为空'
                }
            ]}
        >
            <Select
                placeholder={"请选择字段类型"}
                options={options}
                onChange={handleOnChange}
            />
        </Form.Item>
    )
}