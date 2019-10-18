//****************************************
// Tests for ComboBoxSelector class
//****************************************
import { ComboBoxSelectorModel } from '../../Modeling/niComboBoxSelectorModel.js';
describe('A ComboBoxSelectorModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const items = [{ value: "Test_first", displayValue: 'first' }, { value: "Test_second", displayValue: 'second' }, { value: "Test_third", displayValue: 'third' }];
    const allowUnlabeled = false;
    const value = 'test';
    let completeSettings = {};
    beforeEach(function () {
        controlModel = new ComboBoxSelectorModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('can be constructed', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('can get and set the value property', function () {
        controlModel.value = value;
        expect(controlModel.value).toEqual(value);
    });
    it('can get and set the allowUnlabeled property', function () {
        controlModel.allowUnlabeled = allowUnlabeled;
        expect(controlModel.allowUnlabeled).toEqual(allowUnlabeled);
    });
    it('can get and set the source property', function () {
        controlModel.items = items;
        expect(controlModel.items).toEqual(items);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties', function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            allowUnlabeled: allowUnlabeled,
            items: items,
            value: value,
            textAlignment: 'center'
        };
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.width).toEqual(completeSettings.width);
        expect(controlModel.height).toEqual(completeSettings.height);
        expect(controlModel.value).toEqual(completeSettings.value);
        expect(controlModel.allowUnlabeled).toEqual(completeSettings.allowUnlabeled);
        expect(controlModel.items).toEqual(completeSettings.items);
        expect(controlModel.textAlignment).toEqual(completeSettings.textAlignment);
    });
});
//# sourceMappingURL=niComboBoxSelectorModel.Test.js.map