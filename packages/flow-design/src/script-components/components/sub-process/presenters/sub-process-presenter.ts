import {
    SubProcessConfig,
    SubProcessFormValues,
    SubProcessViewProps,
} from "@/script-components/components/sub-process/typings";
import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";


export class SubProcessPresenter {

    private readonly props: SubProcessViewProps;

    constructor(props: SubProcessViewProps) {
        this.props = props;
    }

    public parserScript(value: string): SubProcessFormValues {
        const meta = GroovyScriptConvertorUtil.getScriptMeta(value);
        if (!meta) {
            return {processes: []};
        }
        const parsed: unknown = JSON.parse(meta);
        if (!this.isRecord(parsed)) {
            return {processes: []};
        }
        if (Array.isArray(parsed.processes)) {
            return {processes: parsed.processes.filter(this.isSubProcessConfig)};
        }
        return this.isSubProcessConfig(parsed)
            ? {processes: [parsed]}
            : {processes: []};
    }

    public updateScript(values: SubProcessFormValues) {
        this.props.onChange(this.toScript(values));
    }

    private toFormData(config: SubProcessConfig): string {
        if (config.formData) {
            const formData: unknown = JSON.parse(config.formData);
            if (this.isRecord(formData) && this.isRecord(formData.dataBody)) {
                const data = formData.dataBody.data;
                if (data) {
                    return JSON.stringify(data);
                }
            }
        }
        return '';
    }

    private toScript(values: SubProcessFormValues): string {
        const meta = JSON.stringify(values);
        const requests = values.processes.map(config => {
            const formData = this.toFormData(config);
            return `request.toCreateRequest('${config.workId}', ${config.operatorId}, '${config.actionId}', '${formData}')`;
        }).join(',\n            ');
        return `
        // @SCRIPT_TITLE 子流程配置
        // @SCRIPT_META ${meta} 
        def run(request){
            return [
                ${requests}
            ];
        }`;
    }

    private isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null;
    }

    private isSubProcessConfig = (value: unknown): value is SubProcessConfig => {
        return this.isRecord(value)
            && (value.workId === undefined || typeof value.workId === 'string')
            && (value.actionId === undefined || typeof value.actionId === 'string')
            && (value.operatorId === undefined
                || typeof value.operatorId === 'string'
                || typeof value.operatorId === 'number')
            && (value.formData === undefined || typeof value.formData === 'string');
    };
}
