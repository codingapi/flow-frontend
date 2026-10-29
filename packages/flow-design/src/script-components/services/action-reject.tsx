import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";
import {ActionSelectOption} from "@/script-components/typings";
import {NodeManger} from "@/components/design-panel/manager/node";

export class ActionRejectService {

    private readonly nodeManger: NodeManger;

    public constructor(nodeManger: NodeManger) {
        this.nodeManger = nodeManger;
    }

    public getOptions(nodeId: string) {
        const options: ActionSelectOption[] = [];
        const backNodes = this.nodeManger.getBackNodes(nodeId);
        for (const node of backNodes) {
            options.push({
                label: node.name,
                value: node.id,
            })
        }
        options.push({
            label: '终止流程',
            value: 'TERMINATE',
        })
        return options;
    }

    public getValue(script?: string) {
        const type = ActionRejectScriptUtils.getType(script);
        const node = this.nodeManger.getNodeByType(type);
        if (node) {
            return node.id;
        }
        return type;
    }

    public getScript(option: ActionSelectOption) {
        return ActionRejectScriptUtils.update(option);
    }

}

export class ActionRejectScriptUtils {

    public static update(option: ActionSelectOption) {
        const groovy = `// @CUSTOM_SCRIPT 跳转到 ${option.label}  
            // @SCRIPT_META {"type":"${option.value}"}
            def run(request){
                return '${option.value}';
            }
            `
        return GroovyScriptConvertorUtil.formatScript(groovy);
    }


    /**
     * 判断脚本字段中存放的是脚本正文而非脚本key。
     * <p>
     * 旧版设计器会把脚本正文直接写入动作的 script 字段，后端在保存流程时会将其
     * 归一化为脚本key；此处用于兼容此类历史数据的回显与编辑。
     */
    public static isInlineScript(value?: string) {
        if (!value) {
            return false;
        }
        return value.includes('def run') || value.includes('\n') || value.includes('\r');
    }

    public static getType(script?: string) {
        if (script) {
            const meta = GroovyScriptConvertorUtil.getScriptMeta(script);
            if (meta) {
                const data = JSON.parse(meta);
                if (data) {
                    return data.type;
                }
            }
        }
        return undefined;
    }
}