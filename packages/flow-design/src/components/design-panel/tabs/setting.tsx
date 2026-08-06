import React from "react";
import {InputNumber} from "antd";
import {CardForm, Panel} from "@coding-flow/flow-pc-ui";
import {FieldTip} from "@/components/field-tip";
import {InterferePanel} from "@/components/design-panel/panels/workflow/interfere";
import {UrgePanel} from "@/components/design-panel/panels/workflow/urge";
import {useDesignContext} from "@/components/design-panel/hooks/use-design-context";
import {WorkflowStrategyManager} from "@/components/design-panel/manager/strategy";


export const TabSetting = () => {

    const [form] = CardForm.useForm();
    const {state, context} = useDesignContext();

    const formActionContext = context.getPresenter().getFormActionContext();

    const workflowStrategyManager = new WorkflowStrategyManager();

    const resetFieldsValue = () => {
        const formData = workflowStrategyManager.toRender(state.workflow.strategies as any[]);
        form.setFieldsValue({
            ...formData,
            maxNestDepth: state.workflow.maxNestDepth ?? 10,
        });
    }

    React.useEffect(() => {
        resetFieldsValue();
    }, [state.workflow.strategies, state.workflow.maxNestDepth]);

    // 注册form行为
    React.useEffect(() => {
        form.resetFields();
        resetFieldsValue();

        formActionContext.addAction({
            save: () => {
                const formValues = form.getFieldsValue();
                const strategyData = workflowStrategyManager.toData(formValues);
                return {
                    ...(strategyData || {}),
                    maxNestDepth: formValues.maxNestDepth,
                };
            },
            key: () => {
                return 'setting';
            },
            validate: () => {
                return new Promise((resolve, reject) => {
                    form.validateFields()
                        .then(values => {
                            const strategyData = workflowStrategyManager.toData(values);
                            resolve({
                                ...(strategyData || {}),
                                maxNestDepth: values.maxNestDepth,
                            });
                        }).catch(reject)
                })
            }
        });

        return () => {
            formActionContext.removeAction('setting');
        };
    }, []);

    return (
        <Panel>
            <InterferePanel form={form}/>
            <UrgePanel form={form}/>
            <CardForm
                form={form}
                title="循环防护配置"
            >
                <CardForm.Item
                    name={["maxNestDepth"]}
                    label={(
                        <FieldTip
                            label="最大嵌套深度"
                            description="子流程嵌套层数上限（默认 10）。运行期创建子流程时沿父链统计嵌套层数，超过该值将拒绝创建，用于兜底防护子流程创建自身/祖先流程等循环配置导致的无限递归。"
                        />
                    )}
                >
                    <InputNumber min={1} max={100} style={{width: '100%'}}/>
                </CardForm.Item>
            </CardForm>
        </Panel>
    )
}