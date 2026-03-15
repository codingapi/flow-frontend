import {SubProcessViewProps} from "@/script-components/components/sub-process/typings";
import {GroovyScriptConvertorUtil} from "@flow-engine/flow-core";


export class SubProcessPresenter {

    private readonly props: SubProcessViewProps;

    constructor(props: SubProcessViewProps) {
        this.props = props;
    }

    public parserScript(value: string) {
        const meta = GroovyScriptConvertorUtil.getScriptMeta(value);
        if (meta) {
            return JSON.parse(meta);
        }
        return {};
    }

    public updateScript(values: any) {
        this.props.onChange(this.toScript(values));
    }

    private toFormData(values: any) {
        if (values && values?.formData) {
            const formData = JSON.parse(values.formData);
            const data = formData.dataBody?.data;
            if(data){
                return JSON.stringify(data);
            }
        }
        return '';
    }

    private toScript(values: any) {
        const meta = JSON.stringify(values);
        const formData = this.toFormData(values);
        return `
        // @SCRIPT_TITLE 子流程配置
        // @SCRIPT_META ${meta} 
        def run(request){
            return request.toCreateRequest('${values.workId}', ${values.operatorId},'${values.actionId}', '${formData}');
        }`;
    }

}