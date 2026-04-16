import React, {useState} from "react";
import {Panel} from "@coding-flow/flow-pc-ui";
import {Empty, Tabs} from "antd";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {IMPORT_FORM_VIEW_KEY} from "@/plugins/import-form-view-type";
import {useDesignContext} from "@/components/design-panel/hooks/use-design-context";
import {FormTable} from "./table";
import {ImportFormPluginView} from "./import-form-plugin-view";
import {FlowForm} from "@coding-flow/flow-types";


export const TabForm = () => {
    const {state, context} = useDesignContext();
    const presenter = context.getPresenter();
    const [importFormOpen, setImportFormOpen] = useState(false);

    const mainCode = state.workflow.form.code;
    const mainName = state.workflow.form.name;
    const subForms = state.workflow.form.subForms || [];

    const hasImportFormView = !!ViewBindPlugin.getInstance().get(IMPORT_FORM_VIEW_KEY);

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

    const handleImportForm = (form: FlowForm) => {
        presenter.importWorkflowForm(form);
        setImportFormOpen(false);
    };

    return (
        <Panel>
            <FormTable
                name={`主表:${mainName}`}
                code={mainCode}
                mainForm={true}
                hasImportForm={hasImportFormView}
                onImportClick={() => setImportFormOpen(true)}
            />
            <Tabs
                style={{
                    marginTop: 20
                }}
                items={items}
            />

            <ImportFormPluginView
                open={importFormOpen}
                onSelect={handleImportForm}
                onCancel={() => setImportFormOpen(false)}
            />
        </Panel>
    )
}