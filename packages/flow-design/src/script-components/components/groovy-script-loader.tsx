import { getScript, save } from '@/api/script';
import React from 'react';
import {EventBus} from "@coding-flow/flow-core";

/**
 * 脚本内容更新事件
 * 当某 scriptKey 对应的脚本内容被编辑保存后广播，通知所有订阅该 key 的实例（如画布与侧边栏）
 * 立即用最新内容刷新，避免因 key 不变而无法感知内容变化。
 * 回调签名：(key: string, content: string) => void
 */
const SCRIPT_UPDATED_EVENT = 'groovy-script-updated';

export interface GroovyScriptLoaderProps {
    // script key
    value?: string;
    // onChange 
    onChange?: (value: string) => void;
    content: React.ComponentType<GroovyScriptLoaderContent>;
}


export interface GroovyScriptLoaderContent {
    // script key 
    scriptKey: string;
    // script 
    value?: string;
    // script on change
    onChange?: (value: string) => void;
}


export const GroovyScriptLoader: React.FC<GroovyScriptLoaderProps> = (props) => {

    const scriptKey = props.value || '';

    const [script, setScript] = React.useState('');

    const ScriptContent = props.content;

    const handlerSaveScript = (script: string) => {
        save({
            key: scriptKey,
            script: script
        }).then((res: any) => {

        });
    }


    const handleScriptChange = (currentScript: string) => {
        if (script === currentScript) {
            return;
        }
        console.log('script changed', currentScript);
        handlerSaveScript(currentScript);
        // 广播脚本内容更新，让画布等其他订阅该 key 的实例同步刷新
        EventBus.getInstance().emit(SCRIPT_UPDATED_EVENT, scriptKey, currentScript);
        setScript(currentScript);

        props.onChange?.(scriptKey);
    }

    React.useEffect(() => {
        if (scriptKey) {
            getScript(scriptKey).then((res: any) => {
                setScript(res.data);
            });
        }
    }, [scriptKey]);

    // 订阅脚本内容更新：当同一 scriptKey 的内容在其他实例被编辑保存时，立即同步最新内容
    React.useEffect(() => {
        if (!scriptKey) {
            return;
        }
        const handler = (key: string, content: string) => {
            if (key === scriptKey) {
                setScript(content);
            }
        };
        EventBus.getInstance().on(SCRIPT_UPDATED_EVENT, handler);
        return () => {
            EventBus.getInstance().off(SCRIPT_UPDATED_EVENT, handler);
        };
    }, [scriptKey]);

    React.useEffect(() => {
        return () => {
            setScript('');
        };
    }, []);

    return (
        <ScriptContent
            scriptKey={scriptKey}
            value={script}
            onChange={handleScriptChange}
        />
    );
};
