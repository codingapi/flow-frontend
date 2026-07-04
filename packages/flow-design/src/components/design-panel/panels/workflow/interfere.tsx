import React from "react";
import {FormInstance, Switch} from "antd";
import {CardForm} from "@coding-flow/flow-pc-ui";
import {FieldTip} from "@/components/field-tip";

interface InterferePanelProps{
    form:FormInstance;
}

export const InterferePanel:React.FC<InterferePanelProps> = (props)=>{
    return (
        <CardForm
            form={props.form}
            title="干预配置"
        >
            <CardForm.Item
                name={["strategies","InterfereStrategy","enable"]}
                label={
                    <FieldTip
                        label={"开启"}
                        description={"开启后，允许流程管理员协助用户操作该流程。"}
                    />
                }
            >
                <Switch/>
            </CardForm.Item>
        </CardForm>
    )
}

