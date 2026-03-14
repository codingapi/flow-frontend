import {Workflow} from "@/components/design-panel/types";

export class CurrentWorkflowPresenter {
    private readonly workflow: Workflow;

    constructor(workflow: Workflow) {
        this.workflow = workflow;
    }


    public getOperatorOptions(){
        const options = [];

        options.push({
            label: "流程创建人",
            value:'request.getCreatedOperatorId()'
        })

        options.push({
            label: "流程审批人",
            value:'request.getCurrentOperatorId()'
        })

        return options;
    }
}