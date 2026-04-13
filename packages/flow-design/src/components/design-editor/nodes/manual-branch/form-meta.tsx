import {provideJsonSchemaOutputs, syncVariableTitle,} from '@flowgram.ai/form-materials';
import {FormMeta, FormRenderProps, ValidateTrigger,} from '@flowgram.ai/fixed-layout-editor';

import {FlowNodeJSON} from '../../typings';
import {NodePanel} from "@/components/design-editor/node-components/panel";
import React from "react";
import {ManualTitle} from "@/components/design-editor/node-components/manual-title";

export const renderForm = (data: FormRenderProps<FlowNodeJSON['data']>) => {
    return (
        <NodePanel data={data}>
            <ManualTitle/>
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
