import React from "react";
import {FlowMockContext} from "@/context";

export const useMockContext =()=>{
    return React.useContext(FlowMockContext);
}