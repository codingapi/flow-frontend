import {FlowMockApi} from "@/components/flow-mock/types";
import {cleanMock as cleanMockApi, mock as mockApi} from "@/api/workflow";


export class FlowMockApiImpl implements FlowMockApi {

    mock = async () => {
        const result = await mockApi();
        if (result.success) {
            return result.data;
        }
    }

    clear = async (mockKey: string) => {
        await cleanMockApi(mockKey);
    }

}