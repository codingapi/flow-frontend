import { FlowAction } from "@coding-flow/flow-types";
import { FlowActionManager } from "./manager";

export class FlowActionListPresenter {
    private readonly data: FlowAction[];
    private readonly onChange: (data: FlowAction[]) => void;
    private readonly manager: FlowActionManager;

    public constructor(data: FlowAction[], onChange: (data: FlowAction[]) => void) {
        this.onChange = onChange;
        this.data = data;
        this.manager = new FlowActionManager(data);
    }

    public getFlowActionManager() {
        return this.manager;
    }

    public enable(id: any, value: boolean) {
        const data = this.data.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    enable: value,
                }
            }
            return item;
        });
        this.onChange(data);
    }


    public sort(id: string, order: number) {
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) {
            return;
        }
        const targetIndex = index + order;
        // 边界检查
        if (targetIndex < 0 || targetIndex >= this.data.length) {
            return;
        }
        const data = [...this.data];
        // 交换位置
        [data[index], data[targetIndex]] = [data[targetIndex], data[index]];
        this.onChange(data);
    }


    public delete(id: string) {
        const data = this.data.filter(item => item.id !== id);
        this.onChange(data);
    }

    public update(action: any) {
        const actionId = action.id;

        const actionIdList = this.data.map(action => action.id);

        if (actionIdList.includes(actionId)) {
            const data = this.data.map(item => {
                if (item.id === actionId) {
                    return {
                        ...item,
                        ...action,
                        display: {
                            ...item.display,
                            ...action.display,
                        }
                    }
                }
                return item;
            });
            this.onChange(data);
        } else {
            this.onChange([...this.data, {
                ...action,
                type: "CUSTOM"
            }]);
        }
    }


    public getDatasource(): any[] {
        if (this.data) {
            return this.data.map(item => {
                const enable = item.enable;
                return {
                    ...item,
                    enable: enable === undefined ? true : enable,
                }
            });
        }
        return [];
    }


}