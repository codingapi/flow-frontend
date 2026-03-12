import { NavBar } from "antd-mobile";
import React from "react";


interface HeaderProps {
    title?: string;
    onRightClick?: () => void;
}

export const Header:React.FC<HeaderProps> = (props) => {

    return (
        <NavBar
            onBack={props.onRightClick}
        >{props.title}</NavBar>
    )
}