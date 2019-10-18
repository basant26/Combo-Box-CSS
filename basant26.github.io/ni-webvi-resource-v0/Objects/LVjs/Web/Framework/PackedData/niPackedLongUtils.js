/**
 * Array Helpers used in Data Packing.
 */
export class NIPackedLongUtils {
    /**
     * Helper method inspired from : https://groups.google.com/forum/#!topic/flatbuffers/ieXNEsB_2wc
     * @param {string} value string to convert it into flatBuffers.Long
     */
    static CreateFlatbuffersLong(value) {
        let padNumber = "0";
        if (value.startsWith("-")) {
            padNumber = "1";
        }
        const numberFormat = new window.JQX.Utilities.BigNumber(value);
        let binString = numberFormat.toString(2);
        const pad = new Array(65 - binString.length).join(padNumber); // pad to 64 bit
        binString = pad + binString;
        const high = parseInt(binString.substring(0, 32), 2);
        const low = parseInt(binString.substring(32), 2);
        const longInt = flatbuffers.Long.create(low, high);
        return longInt;
    }
    static ulongToFloat64(longValue) {
        // Differs from flatbuffers.Long.toFloat64() in that this interprets the long value as unsigned
        return ((longValue.high >>> 0) * 0x100000000) + (longValue.low >>> 0);
    }
}
//# sourceMappingURL=niPackedLongUtils.js.map