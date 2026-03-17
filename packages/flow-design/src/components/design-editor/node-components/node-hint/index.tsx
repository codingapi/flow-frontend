import React from "react";
import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";
import {Field, FieldRenderProps} from "@flowgram.ai/fixed-layout-editor";
import {Text} from "@coding-flow/flow-pc-ui";

interface NodeHintProps {
    fieldName: string;
}

export const NodeHint: React.FC<NodeHintProps> = (props) => {
    return (
        <Field
            name={props.fieldName}
            render={({field: {value, onChange}}: FieldRenderProps<any>) => (
                <Text
                    suffixCount={100}
                    key={value}
                >
                    {GroovyScriptConvertorUtil.getScriptTitle(value)}
                </Text>
            )}
        />
    )
}