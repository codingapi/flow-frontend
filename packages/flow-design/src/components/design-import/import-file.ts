type JsonObject = Record<string, unknown>;

export interface WorkflowImportFileInfo {
    code: string;
    title: string;
}

const isJsonObject = (value: unknown): value is JsonObject => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const decodeBase64File = (file: string): string => {
    const separatorIndex = file.indexOf(',');
    const encoded = separatorIndex >= 0 ? file.substring(separatorIndex + 1) : file;
    const binary = globalThis.atob(encoded);
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
};

/**
 * 从V1迁移包或历史单流程文件中读取流程编码。
 */
export const readImportWorkflowInfo = (file: string): WorkflowImportFileInfo => {
    let parsed: unknown;
    try {
        parsed = JSON.parse(decodeBase64File(file));
    } catch {
        throw new Error('无法解析导入文件，请确认文件为有效的流程JSON文件');
    }
    if (!isJsonObject(parsed)) {
        throw new Error('导入文件内容必须为JSON对象');
    }

    const workflow = parsed.workflow;
    const workflowData = isJsonObject(workflow) ? workflow : parsed;
    const code = workflowData.code;
    if (typeof code !== 'string' || code.trim().length === 0) {
        throw new Error('导入文件中缺少流程编码');
    }
    const title = workflowData.title;
    return {
        code,
        title: typeof title === 'string' && title.trim().length > 0 ? title : '未命名流程'
    };
};

export const readImportWorkflowCode = (file: string): string => {
    return readImportWorkflowInfo(file).code;
};

export const validateResetImportCode = (file: string, currentWorkflowCode: string): string => {
    const importedCode = readImportWorkflowCode(file);
    if (importedCode !== currentWorkflowCode) {
        throw new Error(
            `导入流程编码“${importedCode}”与当前流程编码“${currentWorkflowCode}”不一致，无法重置导入`
        );
    }
    return importedCode;
};
