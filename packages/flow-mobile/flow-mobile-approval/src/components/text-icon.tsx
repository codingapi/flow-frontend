import React from "react";

interface TextIconProps{
    text: string;
}
export const TextIcon:React.FC<TextIconProps> = (props) => {
    const text = props.text
    const displayText = text?.slice(0, 2) || "待";  // 最多两个字，空值显示默认
    return (
        <div
            style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#1890ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 16,
            }}
        >
            {displayText}
        </div>
    );
};