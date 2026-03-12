import React from "react";
import {FlowMockPresenter} from "@/components/flow-mock/presenter";
import {FlowMockApiImpl} from "@/components/flow-mock/model";

export const useMockPresenter = () => {

    const ref = React.useRef<FlowMockPresenter>(undefined);

    const [state, setState] = React.useState<string>('');

    if (!ref.current) {
        ref.current = new FlowMockPresenter(state, setState, new FlowMockApiImpl());
        ref.current.initState();
    }

    React.useEffect(() => {
        if (ref.current) {
            ref.current.syncState(state);
        }
    }, [state]);


    React.useEffect(()=>{
        return ()=>{
            ref.current?.cleanMock();
        }
    },[]);

    return {
        state: state,
        presenter: ref.current,
    }
}