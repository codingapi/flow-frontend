import {describe, expect, it} from '@rstest/core';
import {parseActionDisplayStyle} from '@/script-components/components/action/style';

describe('parseActionDisplayStyle', () => {

    it('应解析 display.style 中保存的 JSON 样式（issue #244）', () => {
        const style = parseActionDisplayStyle({
            title: '通过',
            style: JSON.stringify({
                backgroundColor: '1677ff',
                borderColor: 'ff4d4f',
                borderRadius: '4',
                borderSize: '1',
            }),
        });

        expect(style.backgroundColor).toEqual('1677ff');
        expect(style.borderColor).toEqual('ff4d4f');
        expect(style.borderRadius).toEqual('4');
        expect(style.borderSize).toEqual('1');
    });

    it('display.style 中带 # 的颜色应统一去掉前缀，避免审批端重复补全', () => {
        const style = parseActionDisplayStyle({
            style: JSON.stringify({
                backgroundColor: '#1677ff',
                borderColor: '#ff4d4f',
            }),
        });

        expect(style.backgroundColor).toEqual('1677ff');
        expect(style.borderColor).toEqual('ff4d4f');
    });

    it('样式字段直接挂在 display 上时应兼容解析，并去掉颜色的 # 前缀', () => {
        const style = parseActionDisplayStyle({
            backgroundColor: '#1677ff',
            borderColor: '#ff4d4f',
            borderRadius: '6',
            borderSize: '2',
        });

        expect(style.backgroundColor).toEqual('1677ff');
        expect(style.borderColor).toEqual('ff4d4f');
        expect(style.borderRadius).toEqual('6');
        expect(style.borderSize).toEqual('2');
    });

    it('未配置样式或样式数据非法时应返回空样式', () => {
        expect(parseActionDisplayStyle(undefined)).toEqual({});
        expect(parseActionDisplayStyle({})).toEqual({});
        expect(parseActionDisplayStyle({style: 'primary'})).toEqual({});
    });
});
