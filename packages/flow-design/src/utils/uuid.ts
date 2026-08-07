/**
 * 生成 UUID v4。
 * <p>优先使用原生 crypto.randomUUID（仅安全上下文与较新浏览器可用）；
 * 回退到 crypto.getRandomValues 构造（非安全上下文同样可用）；
 * 最后回退 Math.random 拼接，保证在打包后的生产环境（HTTP/旧浏览器）不抛错。
 */
export const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        const bytes = crypto.getRandomValues(new Uint8Array(16));
        bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
        const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
    // 极端环境兜底：Math.random 构造（非加密随机，仅用于前端临时 id）
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};