import {FlowMockApi} from "@/components/flow-mock/types";
import {Dispatch} from "@coding-flow/flow-core";

export class FlowMockPresenter {

    private state:string;
    private readonly dispatch:Dispatch<string>;
    private readonly api:FlowMockApi;

    constructor(state:string, dispatch:Dispatch<string>,api:FlowMockApi) {
        this.state = state;
        this.api = api;
        this.dispatch = dispatch;
    }

    public syncState(state:string):void {
        this.state = state;
        console.log('syncState', state);
    }

    public initState():void {
        this.api.mock().then(mock => {
            if (mock) {
                console.log('mock initState', mock);
                this.dispatch(mock);
            }
        });
    }

    public cleanMock(){
        this.api.clear(this.state).then(() => {
            this.dispatch('');
        });
    }
}