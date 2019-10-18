/**
 * Color helper methods
 */
const toRGBAArray = function (rgbaColor) {
    if (rgbaColor.indexOf('rgb') === 0) {
        if (rgbaColor.indexOf('rgba') === -1) {
            rgbaColor += ',1';
        }
        return rgbaColor.match(/[.\d]+/g).map(function (a) {
            return +Number(a);
        });
    }
};
export class ColorValueConverters {
    static integerToRGBA(num) {
        num >>>= 0;
        const b = num & 0xFF;
        const g = (num & 0xFF00) >>> 8;
        const r = (num & 0xFF0000) >>> 16;
        let a = num >>> 24;
        // alpha values needs to be converted back in range 0 to 1, rounded upto 2 decimal places.
        a = Number((a / 255).toFixed(2));
        return "rgba(" + [r, g, b, a].join(",") + ")";
    }
    /**
     * This function converts color provided in rbga format to corresponding integer value.
     * @param {string} rgba the color value in rgba format.
     * @returns color value in integer.
     */
    static rgbaToInteger(rgbaColor) {
        const arr = toRGBAArray(rgbaColor);
        const r = arr[0] & 0xFF;
        const g = arr[1] & 0xFF;
        const b = arr[2] & 0xFF;
        // alpha value needs to be converted into an integer value in range 0 to 255 before dumping into an ARGB integer.
        const a = Math.round(arr[3] * 255) & 0xFF;
        return ((a << 24) + (r << 16) + (g << 8) + (b)) >>> 0;
    }
    /**
        * This function converts color provided in hex format to corresponding integer value in format argb.
        * Hex is a valid way to set the color.
        * If hex code is of length 3, e.g. `#000`, we are converting it to a 6 character long hex
        * before parsing it to correct integer value.
        * If alpha is not present, prepend `ff`.
        * @param {string} hexColor - The color value in hex format.
        * @returns color value in integer.
        */
    static hexToInteger(hexColor) {
        let hexString = hexColor.substring(1).split('');
        let alpha = ['f', 'f'];
        if (hexString.length === 3) {
            hexString = [hexString[0], hexString[0], hexString[1], hexString[1], hexString[2], hexString[2]];
        }
        else if (hexString.length === 8) {
            alpha = [hexString[6], hexString[7]];
            hexString = hexString.slice(0, 6);
        }
        /** prefix alpha value before parse. */
        hexString = alpha.join('') + hexString.join('');
        return parseInt(hexString, 16);
    }
    /**
     * This function returns the integer value of the color provided in either rgba or hex format.
     * @param {string} color - The color value in rgba or hex format.
     * @returns color value in integer.
     */
    static getIntegerValueForInputColor(color) {
        color = color.trim();
        if (this.isColorInRGBAFormat(color)) {
            return this.rgbaToInteger(color);
        }
        else if (this.isColorInHexFormat(color)) {
            return this.hexToInteger(color);
        }
    }
    /** Check whether given color string is in RGBA format. */
    static isColorInRGBAFormat(colorContent) {
        return colorContent.startsWith('rgb');
    }
    /** Check whether given color string is in HEX code format. */
    static isColorInHexFormat(colorContent) {
        return colorContent.startsWith('#');
    }
    /** Check whether given color string is in RGBA or HEX. */
    static isRGBAOrHexFormat(colorContent) {
        colorContent = colorContent.trim();
        return this.isColorInRGBAFormat(colorContent) || this.isColorInHexFormat(colorContent);
    }
    /**
     * convert argb integer to Hex string of length 8, assuming that the given integer will always have alpha channel at the begining.
     * @param { number } argbIntegerColor - The color integer in argb format.
     * @returns color value in hex of length 8 + 1(giving 2 char for each component including alpha and a `#` at the begining).
     * ex. for input 0, it returns #00000000.
     */
    static argbIntegerColorToRgbaHexColor(argbIntegerColor) {
        argbIntegerColor >>>= 0;
        let b = argbIntegerColor & 0xFF;
        let g = (argbIntegerColor & 0xFF00) >>> 8;
        let r = (argbIntegerColor & 0xFF0000) >>> 16;
        let a = argbIntegerColor >>> 24;
        r = r.toString(16);
        if (r.length === 1) {
            r = '0' + r;
        }
        g = g.toString(16);
        if (g.length === 1) {
            g = '0' + g;
        }
        b = b.toString(16);
        if (b.length === 1) {
            b = '0' + b;
        }
        a = a.toString(16);
        if (a.length === 1) {
            a = '0' + a;
        }
        return ('#' + r + g + b + a).toUpperCase();
    }
}
//# sourceMappingURL=niColorValueConverters.js.map