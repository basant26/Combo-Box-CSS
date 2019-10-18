//****************************************
// Tests for ColorBoxModel class
// National Instruments Copyright 2019
//****************************************
import { ColorBoxModel } from '../../Modeling/niColorBoxModel.js';
const NITypes = window.NITypes;
describe('A ColorBoxModel', function () {
    let controlModel;
    const niControlId = 'testId';
    beforeEach(function () {
        controlModel = new ColorBoxModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        const completeSettings = {
            top: 100,
            left: 200,
            width: 300,
            height: 400,
            visible: true,
            value: 5654556
        };
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.value).toEqual(completeSettings.value);
        expect(controlModel.top).toEqual(completeSettings.top);
        expect(controlModel.left).toEqual(completeSettings.left);
        expect(controlModel.width).toEqual(completeSettings.width);
        expect(controlModel.height).toEqual(completeSettings.height);
    });
    it('has type as UNIT32', function () {
        expect(controlModel.niType).toEqual(NITypes.UINT32);
    });
});
//# sourceMappingURL=niColorBoxModel.Test.js.map