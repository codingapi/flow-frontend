export interface DesignViewPluginAction {

    onValidate: (script: string) => Promise<boolean>;

}