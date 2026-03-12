import React from "react";
import {FOOTER_HEIGHT} from "@/components/flow-approval/typings";
import {useApprovalContext} from "@flow-engine/flow-approval-presenter";
import {CustomStyleButton} from "@/components/flow-approval/components/custom-style-button";

export const Footer = () => {

    const {state} = useApprovalContext()
    const actions = state.flow?.actions || [];

    return (
        <div
            style={{
                height: FOOTER_HEIGHT,
                width: '100%',
                borderTop: '1px solid lightgray',
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'space-around',
                    gap: '10px',
                    alignItems: 'center',
                }}
            >
                {actions
                    .map((action, index) => {
                    return (
                        <CustomStyleButton
                            onClick={() => {

                            }}
                            display={action.display}
                            title={action.title}
                        />
                    )
                })}
            </div>
        </div>
    )
}