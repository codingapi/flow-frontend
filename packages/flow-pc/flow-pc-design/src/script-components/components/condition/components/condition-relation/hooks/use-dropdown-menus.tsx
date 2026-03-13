import React from "react";
import {useConditionContext} from "@/script-components/components/condition/hooks/use-condition-context";
import {ConditionRelationProps} from "@/script-components/components/condition/typings";
import {MenuRelation} from "@/script-components/components/condition/components/condition-relation/domain/menu-relation";


export const useDropdownMenus = (props: ConditionRelationProps) => {
    const {state, context} = useConditionContext();
    const presenter = context.getPresenter().getConditionRelationPresenter();
    return React.useMemo(() => {
        const groups = state.groups;
        const menuRelation = new MenuRelation(presenter,props.current,groups,props.leftRelation);
        return menuRelation.getMenus();
    }, [state.groups]);
}