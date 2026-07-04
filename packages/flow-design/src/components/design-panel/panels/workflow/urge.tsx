import React from "react";
import {FormInstance, Input, Switch} from "antd";
import {CardForm} from "@coding-flow/flow-pc-ui";
import {FieldTip} from "@/components/field-tip";

interface UrgePanelProps{
    form:FormInstance;
}

export const UrgePanel:React.FC<UrgePanelProps> = (props)=>{

    return (
        <CardForm
            form={props.form}
            title="催办策略"
        >
            <CardForm.Item
                name={["strategies","UrgeStrategy","enable"]}
                label={
                    <FieldTip
                        label={"开启"}
                        description={"开启后，允许用户对当前审批人发起催办。"}
                    />
                }
            >
                <Switch/>
            </CardForm.Item>

            <CardForm.Item
                name={["strategies","UrgeStrategy","interval"]}
                label={
                    <FieldTip
                        label={"催办间隔时间"}
                        description={"两次催办之间的最小间隔，仅在启用催办时生效。"}
                    />
                }
            >
                <Input addonAfter={"单位:秒"}/>
            </CardForm.Item>
        </CardForm>
    )
}

