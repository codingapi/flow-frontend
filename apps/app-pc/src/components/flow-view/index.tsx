import { EventBus } from "@coding-flow/flow-core";
import type { FormViewProps } from "@coding-flow/flow-types";
import { FormView } from "@coding-form/form-engine";
import React from "react";
import { useApprovalContext } from "../../../../../packages/flow-approval-presenter/dist/hooks";
import { Form } from "antd";

export const FlowView: React.FC<FormViewProps> = (props) => {

    const form = props.form;

    const { state } = useApprovalContext();

    React.useEffect(() => {
        EventBus.getInstance().on('CUSTOM', () => {
            const actions = state.flow?.actionList || [];
            const pass = actions.find(item => item.type === 'PASS');
            form?.setFieldValue('test','123');
            if (pass) {
                EventBus.getInstance().emit(pass.id);
            }
        });

        return () => {
            EventBus.getInstance().off('CUSTOM');
        };
    }, []);

    return (
        <>
            <FormView
                form={form}
                data={props.data}
                initData={props.initData}
                meta={props.meta}
                onValuesChange={props.onValuesChange}
                review={props.review}
                fieldPermissions={props.fieldPermissions}
            >
                <Form.Item
                    name={"test"}
                    hidden={true}
                />
            </FormView>
        </>
    )
}