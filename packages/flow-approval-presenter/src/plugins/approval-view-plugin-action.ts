export interface ApprovalViewPluginAction {

    onValidate: () => Promise<boolean>;

}