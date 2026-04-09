import {provideJsonSchemaOutputs, syncVariableTitle,} from '@flowgram.ai/form-materials';
import {FormMeta, FormRenderProps, ValidateTrigger,} from '@flowgram.ai/fixed-layout-editor';

import {FlowNodeJSON} from '../../typings';
import {NodePanel} from "@/components/design-editor/node-components/panel";
import React from "react";
import {NodeIcon} from "@/components/design-editor/components/node-icon";
import {Space} from "antd";

export const renderForm = (data: FormRenderProps<FlowNodeJSON['data']>) => {

    return (
        <NodePanel data={data}>
            <Space style={
                {
                    width: 100,
                    textAlign: 'center',
                    padding: 5
                }
            }
            >
                <NodeIcon type={"INCLUSIVE_ELSE_BRANCH"}/>
                <span>其他情况</span>
            </Space>
        </NodePanel>
    );
};

export const formMeta: FormMeta<FlowNodeJSON['data']> = {
    render: renderForm,
    validateTrigger: ValidateTrigger.onChange,
    validate: {
        title: ({value}: { value: string }) => (value ? undefined : 'Title is required'),
    },
    effect: {
        title: syncVariableTitle,
        outputs: provideJsonSchemaOutputs,
    },
};
