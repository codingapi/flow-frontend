import React from "react";
import {ActionFormProps} from "@/script-components/typings";
import {ActionType} from "@flow-engine/flow-types";
import {CustomActionForm} from "@/script-components/components/action/components/custom";
import {AddAuditActionForm} from "@/script-components/components/action/components/add-audit";
import {DelegateActionForm} from "@/script-components/components/action/components/delegate";
import {RejectActionForm} from "@/script-components/components/action/components/reject";
import {TransferActionForm} from "@/script-components/components/action/components/transfer";

export class ActionFactory{

    private readonly actions:Map<ActionType, React.ComponentType<ActionFormProps>>;

    private constructor() {
        this.actions = new Map();
        this.initialize();
    }

    private initialize():void{
        this.actions.set('ADD_AUDIT',AddAuditActionForm);
        this.actions.set('CUSTOM',CustomActionForm);
        this.actions.set('DELEGATE',DelegateActionForm);
        this.actions.set('REJECT',RejectActionForm);
        this.actions.set('TRANSFER',TransferActionForm);

    }

    private static readonly instance = new ActionFactory();

    public static getInstance(){
        return this.instance;
    }

    public getActionForm(type:ActionType){
        return this.actions.get(type);
    }

}