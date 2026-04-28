import React, { useState } from "react";
import { Col, Input, Row } from "antd";
import { CardForm, Panel } from "@coding-flow/flow-pc-ui";
import { Tabs } from "antd";
import { ViewBindPlugin } from "@coding-flow/flow-core";
import { IMPORT_FORM_VIEW_KEY } from "@/plugins/import-form-view-type";
import { useDesignContext } from "@/components/design-panel/hooks/use-design-context";
import { FormTable } from "./table";
import { ImportFormPluginView } from "./import-form-plugin-view";
import { FlowForm } from "@coding-flow/flow-types";


export const TabForm = () => {
    const { state, context } = useDesignContext();
    const presenter = context.getPresenter();
    const [importFormOpen, setImportFormOpen] = useState(false);
    const [formForm] = CardForm.useForm();

    const formActionContext = presenter.getFormActionContext();

    const mainCode = state.workflow.form.code;
    const mainName = state.workflow.form.name;
    const subForms = state.workflow.form.subForms || [];

    const hasImportFormView = !!ViewBindPlugin.getInstance().get(IMPORT_FORM_VIEW_KEY);

    const items = subForms.map(item => {
        const title = `子表:${item.name}`;
        return {
            key: item.code,
            label: title,
            children: <FormTable name={title} code={item.code} mainForm={false} />
        }
    });

    React.useEffect(() => {
        formForm.resetFields();
        formForm.setFieldsValue({ form: state.workflow.form });
    }, []);

    React.useEffect(() => {
        formActionContext.addAction({
            save: () => {
                return formForm.getFieldsValue();
            },
            key: () => {
                return 'form';
            },
            validate: () => {
                return new Promise((resolve, reject) => {
                    formForm.validateFields().then(values => {
                        resolve(values);
                    }).catch(reject);
                });
            }
        });

        return () => {
            formActionContext.removeAction('form');
        };
    }, []);

    React.useEffect(() => {
        formForm.setFieldsValue({ form: state.workflow.form });
    }, [state.workflow]);

    const handleFormValuesChange = () => {
        const values = formForm.getFieldsValue();
        presenter.updateWorkflow(values);
    };

    const handleImportForm = (form: FlowForm) => {
        presenter.importWorkflowForm(form);
        setImportFormOpen(false);
    };

    return (
        <Panel>
            <CardForm
                form={formForm}
                title="表单信息"
                onChange={handleFormValuesChange}
            >
                <CardForm.Item
                    name={["form", "name"]}
                    label={"表单名称"}
                    tooltip={"表单名称是主表的名称"}
                    rules={[
                        {
                            required: true,
                            message: '请输入表单名称'
                        }
                    ]}
                >
                    <Input placeholder={"请输入表单名称"} />
                </CardForm.Item>
                <CardForm.Item
                    name={["form", "code"]}
                    label={"表单编码"}
                    tooltip={"表单编码是主表的编码"}
                    rules={[
                        {
                            required: true,
                            message: '请输入表单编码'
                        }
                    ]}
                >
                    <Input placeholder={"请输入表单编码"} />
                </CardForm.Item>
            </CardForm>

            {mainCode && (
                <div style={{ marginTop: 10 }} >
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
                </div>
            )}

            <ImportFormPluginView
                open={importFormOpen}
                onSelect={handleImportForm}
                onCancel={() => setImportFormOpen(false)}
            />
        </Panel>
    )
}
