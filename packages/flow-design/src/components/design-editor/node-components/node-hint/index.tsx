import React from "react";
import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";
import {Field, FieldRenderProps} from "@flowgram.ai/fixed-layout-editor";
import {Text} from "@coding-flow/flow-pc-ui";

interface NodeHintProps {
    fieldName: string;
    selectTypeFieldName?: string;
    selectTypeLabelMap?: Record<string, string>;
}

const DEFAULT_SELECT_TYPE_LABEL_MAP: Record<string, string> = {
    'INITIATOR_SELECT': '发起人设定',
    'APPROVER_SELECT': '审批人设定',
};

export const NodeHint: React.FC<NodeHintProps> = (props) => {
    const labelMap = props.selectTypeLabelMap || DEFAULT_SELECT_TYPE_LABEL_MAP;

    if (!props.selectTypeFieldName) {
        return (
            <Field
                name={props.fieldName}
                render={({field: {value}}: FieldRenderProps<any>) => (
                    <Text
                        suffixCount={100}
                        key={value}
                    >
                        {GroovyScriptConvertorUtil.getScriptTitle(value)}
                    </Text>
                )}
            />
        );
    }

    return (
        <Field
            name={props.selectTypeFieldName}
            render={({field: {value: selectType}}: FieldRenderProps<any>) => {
                if (selectType && selectType !== 'SCRIPT' && labelMap[selectType]) {
                    return (
                        <Text suffixCount={100} key={selectType}>
                            {labelMap[selectType]}
                        </Text>
                    );
                }
                return (
                    <Field
                        name={props.fieldName}
                        render={({field: {value}}: FieldRenderProps<any>) => (
                            <Text
                                suffixCount={100}
                                key={value}
                            >
                                {GroovyScriptConvertorUtil.getScriptTitle(value)}
                            </Text>
                        )}
                    />
                );
            }}
        />
    );
}