import {FlowForm} from "@coding-flow/flow-types";

export const IMPORT_FORM_VIEW_KEY = 'ImportFormViewPlugin';

export interface ImportFormViewPlugin {
    /** 是否显示 */
    open: boolean;
    /** 确认回调 */
    onSelect: (form: FlowForm) => void;
    /** 取消回调 */
    onCancel: () => void;
}