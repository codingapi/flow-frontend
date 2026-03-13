import React from "react";
import {Button, Upload as AntdUpload} from "antd";
import {RcFile} from "antd/es/upload";

interface UploadProps{
    value?:string;
    onChange?:(value:string) => void;
}

const fileToBase64 = (file: RcFile): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

export const Upload:React.FC<UploadProps> = (props)=>{

    return (
        <AntdUpload
            maxCount={1}
            accept=".json,application/json"
            customRequest={async ({file, onSuccess}) => {
                const currentFile = file as RcFile;
                const base64 = await fileToBase64(currentFile);
                props.onChange?.(base64);
                const filename = currentFile.name;
                const url = URL.createObjectURL(currentFile);
                // @ts-ignore
                onSuccess({
                    url: url,
                    id: Math.random(),
                    name: currentFile.name
                });
            }}
        >
            <Button>选择文件</Button>
        </AntdUpload>
    )
}