import React from "react";
import {Panel} from "@flow-engine/flow-pc-ui";
import {Empty, Tabs} from "antd";
import {useDesignContext} from "@/components/design-panel/hooks/use-design-context";
import {FormTable} from "./table";


export const TabForm = () => {
    const {state} = useDesignContext();
    const mainCode = state.workflow.form.code;
    const mainName = state.workflow.form.name;
    const subForms = state.workflow.form.subForms || [];

    const items = subForms.map(item => {
        const title = `子表:${item.name}`;
        return {
            key: item.code,
            label: title,
            children: <FormTable name={title} code={item.code} mainForm={false}/>
        }
    });

    if (!mainCode) {
        return (
            <Empty description={"请先在基本信息中添加表单的定义配置."}/>
        )
    }

    return (
        <Panel>
            <FormTable name={`主表:${mainName}`} code={mainCode} mainForm={true}/>
            <Tabs
                style={{
                    marginTop: 20
                }}
                items={items}
            />
        </Panel>
    )
}