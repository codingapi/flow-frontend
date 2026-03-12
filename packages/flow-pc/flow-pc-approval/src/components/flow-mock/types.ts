export interface FlowMockApi {

    mock(): Promise<string>;

    clear(mockKey:string): Promise<void>;

}
