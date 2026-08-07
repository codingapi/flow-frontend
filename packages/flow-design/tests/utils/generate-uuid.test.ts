import {afterEach, describe, expect, test} from "@rstest/core";
import {generateUUID} from "@/utils/uuid";

// UUID v4 格式：8-4-4-4-12，版本位为 4，变体位为 8/9/a/b
const UUID_V4_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const originalCrypto = globalThis.crypto;

const replaceCrypto = (value: unknown) => {
    Object.defineProperty(globalThis, 'crypto', {
        value,
        configurable: true,
        writable: true,
    });
};

describe.sequential('generateUUID', () => {

    afterEach(() => {
        // 恢复原始 crypto，避免影响其他用例
        replaceCrypto(originalCrypto);
    });

    test('返回合法 UUID v4 格式', () => {
        expect(generateUUID()).toMatch(UUID_V4_RE);
    });

    test('crypto.randomUUID 可用时优先使用原生实现', () => {
        replaceCrypto({ randomUUID: () => 'native-uuid-value' });
        expect(generateUUID()).toEqual('native-uuid-value');
    });

    test('crypto.randomUUID 不可用（仅 getRandomValues）时回退生成', () => {
        replaceCrypto({
            getRandomValues: (originalCrypto as Crypto).getRandomValues.bind(originalCrypto),
        });
        const id = generateUUID();
        expect(id).toMatch(UUID_V4_RE);
        // 两次生成结果不同，避免伪随机固定值
        expect(id).not.toEqual(generateUUID());
    });

    test('crypto 完全不可用时回退 Math.random 生成', () => {
        replaceCrypto(undefined);
        const id = generateUUID();
        expect(id).toMatch(UUID_V4_RE);
        expect(id).not.toEqual(generateUUID());
    });
});