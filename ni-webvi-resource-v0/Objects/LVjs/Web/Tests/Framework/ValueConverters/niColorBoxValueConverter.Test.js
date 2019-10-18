//****************************************
// Tests for ColorBoxValueConverter class
//****************************************
import { ColorBoxValueConverter } from '../../../Framework/ValueConverters/niColorBoxValueConverter.js';
describe('A color box value converter', function () {
    [
        [0x3347BC21, '#47BC2133'],
        [0x00000000, '#00000000'],
        [0xFF000000, '#000000FF'],
        [0x01020304, '#02030401'],
        [0x000000FF, '#0000FF00'],
        [0x456, '#00045600']
    ].forEach(function (testData) {
        it('converts argb integer to hex and covert back to argb integer', function () {
            const convertedValue = ColorBoxValueConverter.convert(testData[0]);
            expect(convertedValue).toBe(testData[1]);
            const convertedBackValue = ColorBoxValueConverter.convertBack(convertedValue);
            expect(convertedBackValue).toBe(testData[0]);
        });
    });
    it('does not throw error while converting back null value', function () {
        const convertBackNullValue = function () {
            ColorBoxValueConverter.convertBack(null);
        };
        expect(convertBackNullValue).not.toThrow();
    });
});
//# sourceMappingURL=niColorBoxValueConverter.Test.js.map