import { ViewBindPlugin } from "@coding-flow/flow-core";
import { IMPORT_FORM_VIEW_KEY } from "@coding-flow/flow-design";
import { APPROVAL_ADVICE_VIEW_KEY } from "@coding-flow/flow-pc-approval";
import { ImportFormView } from "@/components/import-form-view";
import { AdviceView } from "@/components/flow-view/advice-view";

class RegisterRef {

}

// 模块级单例标记：注册逻辑可能在异步上下文中调用，不能使用 React.useRef
let registerRef: RegisterRef | undefined;

export const registerPluginView = () => {

    if (!registerRef) {
        registerRef = new RegisterRef();
        ViewBindPlugin.getInstance().register(IMPORT_FORM_VIEW_KEY, ImportFormView);
        // 自定义审批意见输入框：仅替换意见框 UI，保留提交/校验/签名/选人等默认逻辑
        ViewBindPlugin.getInstance().register(APPROVAL_ADVICE_VIEW_KEY, AdviceView);
    }
}
