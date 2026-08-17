import {describe, expect, it, beforeEach, afterEach} from '@rstest/core';
import {FLOW_HTTP_TIMEOUT_KEY, resolveHttpTimeout} from "@/http";

describe('resolveHttpTimeout', () => {

    beforeEach(() => {
        localStorage.removeItem(FLOW_HTTP_TIMEOUT_KEY);
    });

    afterEach(() => {
        localStorage.removeItem(FLOW_HTTP_TIMEOUT_KEY);
    });

    it('未配置 localStorage 时返回默认值 10000', () => {
        const timeout = resolveHttpTimeout();
        expect(timeout).toEqual(10000);
    });

    it('已配置合法正整数时返回对应超时时间', () => {
        localStorage.setItem(FLOW_HTTP_TIMEOUT_KEY, '30000');
        const timeout = resolveHttpTimeout();
        expect(timeout).toEqual(30000);
    });

    it('已配置 "0" 时视为非法，回退默认值', () => {
        localStorage.setItem(FLOW_HTTP_TIMEOUT_KEY, '0');
        const timeout = resolveHttpTimeout();
        expect(timeout).toEqual(10000);
    });

    it('已配置负整数时视为非法，回退默认值', () => {
        localStorage.setItem(FLOW_HTTP_TIMEOUT_KEY, '-5000');
        const timeout = resolveHttpTimeout();
        expect(timeout).toEqual(10000);
    });

    it('已配置非数字时视为非法，回退默认值', () => {
        localStorage.setItem(FLOW_HTTP_TIMEOUT_KEY, 'abc');
        const timeout = resolveHttpTimeout();
        expect(timeout).toEqual(10000);
    });

    it('已配置小数时按原值返回', () => {
        localStorage.setItem(FLOW_HTTP_TIMEOUT_KEY, '2500.5');
        const timeout = resolveHttpTimeout();
        expect(timeout).toEqual(2500.5);
    });
});