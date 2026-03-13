import React from "react";

import {FormItemString} from "@/components/item/string";
import {FormItemNumber} from "@/components/item/number";
import {FormItemBoolean} from "@/components/item/boolean";
import {FormItemDate} from "@/components/item/date";
import {FormItemProps} from "@/type";


export class FormItemFactory {

    private readonly cache:Map<string,React.ComponentType<FormItemProps>>;

    private static instance:FormItemFactory = new FormItemFactory();

    private constructor() {
        this.cache = new Map();
        this.cache.set('number',FormItemNumber);
        this.cache.set('string',FormItemString);
        this.cache.set('date',FormItemDate);
        this.cache.set('boolean',FormItemBoolean);
    }

    public static getInstance():FormItemFactory {
        return FormItemFactory.instance;
    }

    public createFrom(filedType:string){
        return this.cache.get(filedType);
    }

}