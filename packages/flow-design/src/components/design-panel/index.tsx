import React from "react";
import {DesignPanelProps} from "./types";
import {Drawer} from "@coding-flow/flow-pc-ui";
import {DesignPanelLayout} from "@/components/design-panel/layout";

export const DesignPanel:React.FC<DesignPanelProps>  = (props) =>{

    return (
        <Drawer
            open={props.open}
            onClose={props.onClose}
        >
            <DesignPanelLayout {...props}/>
        </Drawer>
    )
}
