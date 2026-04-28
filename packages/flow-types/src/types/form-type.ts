/**
 *  数据类型
 */
export type DataType = 'STRING' | 'INTEGER' | 'BOOLEAN' | 'LONG' | 'DOUBLE';


// FormField字段类型
export const dataTypeOptions = [
    {
        label: '整数',
        value: 'INTEGER'
    },
    {
        label: '长整数',
        value: 'LONG'
    },
    {
        label: '小数',
        value: 'DOUBLE'
    },
    {
        label: '字符串',
        value: 'STRING'
    },
    {
        label: '布尔类型',
        value: 'BOOLEAN'
    },
]


/**
 *  表单类型附加属性,流程表单传递给form-engine的属性，主要用于一些复杂的表单控制界面，比如级联选择器的级联关系，或者一些特殊组件的属性配置
 */
export interface FormTypeAttribute {
    // 属性key
    key: string;
    // 属性名称
    label: string;
    // 其他属性
    [key: string]: any;
}

/**
 * 表单类型
 */
export interface FormType {
    // 类型名称
    name: string;
    // 类型定义
    type: string;
    // 数据类型
    dataType: DataType;
    // 附加属性
    attributes?: FormTypeAttribute[];
}

/**
 *  表单类型上下文对象
 */
export class FormTypeContext {

    private types: FormType[];

    private constructor() {
        this.types = [];
    }

    private static instance = new FormTypeContext();

    public static getInstance() {
        return this.instance;
    }

    public register(types: FormType[]) {
        this.types = types;
    }

    public getTypes() {
        return this.types;
    }

    public getOptions() {
        return this.types.map(item => {
            return {
                label: item.name,
                value: item.type
            }
        })
    }

    public getType(type: string) {
        for (const item of this.types) {
            if (type === item.type) {
                return item;
            }
        }
        return null;
    }
}