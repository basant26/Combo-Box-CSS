import { NationalInstruments as NIFlatBuffers } from "./PackedDataValues_generated.js";
/**
 * Adaptor for ComplexDouble type
 */
export class NIPackedComplexDoubleAdaptor {
    /**
     * Packs a ComplexDouble value into a flat buffer
     * @static
     * @param {flatbuffers.Builder} builder the builder to use for packing the data value
     * @param {string} complexDataToPack the array value to pack
     * @param {NIType} niType the data type of the array
     * @returns {number} the buffer offset of the packed array value
     * @memberof NIPackedArrayDataAdaptor
     */
    static PackDataValue(builder, complexDataToPack) {
        const complexData = new window.NIComplex(complexDataToPack);
        NIFlatBuffers.PackedData.PackedComplexFloat64Value.startPackedComplexFloat64Value(builder);
        NIFlatBuffers.PackedData.PackedComplexFloat64Value.addImaginary(builder, complexData.imaginaryPart);
        NIFlatBuffers.PackedData.PackedComplexFloat64Value.addReal(builder, complexData.realPart);
        return NIFlatBuffers.PackedData.PackedComplexFloat64Value.endPackedComplexFloat64Value(builder);
    }
    /**
     * Creates an instance adaptor class.
     * @param packedData the packed data to wrap
     * @param niType The type ofthe packed data
     */
    constructor(packedData, niType, options) {
        this.niType = niType;
        this.packedData = packedData;
    }
    /**
     * Gets the type of this array as an NIType
     * @returns The NIType
     */
    getType() {
        return this.niType;
    }
    /**
     * Unpacks this complex into into a standard JavaScript object
     * @returns the unpacked JS NIComplex object in string format
     */
    unpack() {
        const complexValue = new NIFlatBuffers.PackedData.PackedComplexFloat64Value();
        complexValue.__init(this.packedData.bb_pos, this.packedData.bb);
        return new window.NIComplex(complexValue.real(), complexValue.imaginary()).toString();
    }
}
//# sourceMappingURL=niPackedComplexDoubleAdaptor.js.map