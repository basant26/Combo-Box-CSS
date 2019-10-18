//****************************************
// Color Box value converter
// National Instruments Copyright 2019
//****************************************
import { ColorValueConverters } from './niColorValueConverters.js';
export class ColorBoxValueConverter {
    /**
     * convert argb integer to Hex string of length 8, assuming that the given integer will always have alpha channel at the begining.
     * @param { number } argbIntegerColor - The color integer in argb format.
     * @returns color value in hex of length 8 + 1(giving 2 char for each component including alpha and a `#` at the begining).
     * ex. for input 0, it returns #00000000.
     */
    static convert(argbIntegerColor) {
        return ColorValueConverters.argbIntegerColorToRgbaHexColor(argbIntegerColor);
    }
    /**
     * This function returns the integer value of the color provided in either rgba or hex format.
     * @param { string } colorString - The color value in rgba or hex format.
     * @returns color value in integer.
     */
    static convertBack(colorString) {
        if (typeof colorString === 'string') {
            return ColorValueConverters.getIntegerValueForInputColor(colorString);
        }
        return 0x00000000;
    }
}
//# sourceMappingURL=niColorBoxValueConverter.js.map