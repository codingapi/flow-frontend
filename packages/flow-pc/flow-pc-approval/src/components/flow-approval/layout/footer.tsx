import React from "react";
import {APPROVAL_FOOTER_VIEW_KEY} from "@/components/flow-approval";
import {ViewBindPlugin} from "@coding-flow/flow-core";

export const Footer = ()=>{

    const HeaderView = ViewBindPlugin.getInstance().get(APPROVAL_FOOTER_VIEW_KEY);

    if (HeaderView) {
        return <HeaderView/>;
    }

    return (
        <></>
    )
}