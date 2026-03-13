import React from "react";

import {FormItemString} from "@/components/item/string";
import {FormItemBoolean} from "@/components/item/boolean";
import {FormItemDate} from "@/components/item/date";
import {FormItemProps} from "@/type";
import {FormItemLong} from "@/components/item/long";
import {FormItemInteger} from "@/components/item/integer";
import {FormItemDouble} from "@/components/item/double";


export class FormItemFactory {

    private readonly cache:Map<string,React.ComponentType<FormItemProps>>;

    private static instance:FormItemFactory = new FormItemFactory();

    private constructor() {
        this.cache = new Map();
        this.cache.set('long',FormItemLong);
        this.cache.set('integer',FormItemInteger);
        this.cache.set('double',FormItemDouble);
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