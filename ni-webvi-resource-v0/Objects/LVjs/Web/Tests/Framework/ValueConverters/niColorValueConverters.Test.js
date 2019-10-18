import { ColorValueConverters as colorValueConverter } from '../../../Framework/ValueConverters/niColorValueConverters.js';
describe('A color value converter', function () {
    'use strict';
    it('converts hex color to corresponding integer color value', function () {
        const hexValue = '#000';
        const expectedValue = 4278190080;
        const convertedValue = colorValueConverter.hexToInteger(hexValue);
        expect(convertedValue).toBe(expectedValue);
    });
    it('converts hex color (different input value) to corresponding integer color value', function () {
        const hexValue = '#123';
        const expectedValue = 4279312947;
        const convertedValue = colorValueConverter.hexToInteger(hexValue);
        expect(convertedValue).toBe(expectedValue);
    });
    it('converts 6-digit hex color to corresponding integer color value', function () {
        const hexValue = '#F2F2F2';
        const expectedValue = 4294111986;
        const convertedValue = colorValueConverter.hexToInteger(hexValue);
        expect(convertedValue).toBe(expectedValue);
    });
    it('converts 6-digit hex color (different input value) to corresponding integer color value', function () {
        const hexValue = '#4d5359';
        const expectedValue = 4283257689;
        const convertedValue = colorValueConverter.hexToInteger(hexValue);
        expect(convertedValue).toBe(expectedValue);
    });
    it('converts hex color string preceded by white spaces to corresponding integer color value', function () {
        const newColor = '  #fff';
        const expectedValue = 4294967295;
        const convertedValue = colorValueConverter.getIntegerValueForInputColor(newColor);
        expect(convertedValue).toBe(expectedValue);
    });
    it('converts rgba color string preceded by white spaces to corresponding integer color value', function () {
        const newColor = ' rgba(153,83,86,0.6)';
        const expectedValue = 2576962390;
        const convertedValue = colorValueConverter.getIntegerValueForInputColor(newColor);
        expect(convertedValue).toBe(expectedValue);
    });
    it('converts rgba color to corresponding integer color value', function () {
        const newColor = 'rgba(51,71,188,0.13)';
        const expectedValue = 557008828;
        const convertedValue = colorValueConverter.getIntegerValueForInputColor(newColor);
        expect(convertedValue).toBe(expectedValue);
    });
    [
        [0x3347BC21, '#47BC2133'],
        [0x00000000, '#00000000'],
        [0xFF000000, '#000000FF'],
        [0x01020304, '#02030401'],
        [0x000000FF, '#0000FF00'],
        [0x456, '#00045600']
    ].forEach(function (testData) {
        it('converts argb integer to hex string and back to argb integer', function () {
            const convertedHexString = colorValueConverter.argbIntegerColorToRgbaHexColor(testData[0]);
            expect(convertedHexString).toBe(testData[1]);
            const convertedNumberFromHexString = colorValueConverter.hexToInteger(convertedHexString);
            expect(convertedNumberFromHexString).toBe(testData[0]);
        });
    });
});
//# sourceMappingURL=niColorValueConverters.Test.js.map