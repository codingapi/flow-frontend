import {useEffect} from "react";
import {ViewBindPlugin} from "@coding-flow/flow-core";
import {IMPORT_FORM_VIEW_KEY} from "@coding-flow/flow-design";
import {ImportFormView} from "@/components/import-form-view";

export const registerImportFormView = () => {
    ViewBindPlugin.getInstance().register(IMPORT_FORM_VIEW_KEY, ImportFormView);
}