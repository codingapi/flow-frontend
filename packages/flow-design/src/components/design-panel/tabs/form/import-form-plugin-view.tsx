import React from "react";
import {ImportFormViewPlugin, IMPORT_FORM_VIEW_KEY} from "@/plugins/import-form-view-type";
import {ViewBindPlugin} from "@coding-flow/flow-core";

export const ImportFormPluginView: React.FC<ImportFormViewPlugin> = (props) => {
    const CustomViewComponent = ViewBindPlugin.getInstance().get(IMPORT_FORM_VIEW_KEY);

    if (!CustomViewComponent) {
        return null;
    }

    return <CustomViewComponent {...props} />;
}