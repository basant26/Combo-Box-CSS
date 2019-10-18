//****************************************
// Tests for HtmlContainerModel class
// National Instruments Copyright 2015
//****************************************
import { HtmlContainerModel } from '../../Modeling/niHtmlContainerModel.js';
describe('A HtmlContainerModel', function () {
    'use strict';
    let controlModel;
    const niControlId = 'testId';
    const top = 100;
    const left = 200;
    const width = 300;
    const height = 400;
    const visible = true;
    const imageSource = 'Test1.jpg';
    const imageStretch = 'fill';
    const imageVisible = true;
    let completeSettings = {};
    let otherSettings = {};
    beforeEach(function () {
        completeSettings = {
            top: top,
            left: left,
            width: width,
            height: height,
            visible: visible,
            imageSource: imageSource,
            imageStretch: imageStretch,
            imageVisible: imageVisible
        };
        otherSettings = {
            top: top + 1,
            left: left + 1,
            width: width + 1,
            height: height + 1,
            visible: !visible,
            imageSource: 'Test2.jpg',
            imageStretch: 'none',
            imageVisible: !imageVisible
        };
        controlModel = new HtmlContainerModel(niControlId);
    });
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    it('allows to call his constructor', function () {
        expect(controlModel).toBeDefined();
        expect(controlModel.niControlId).toEqual(niControlId);
    });
    it('allows to set and get the imageSource property', function () {
        controlModel.imageSource = imageSource;
        expect(controlModel.imageSource).toEqual(imageSource);
    });
    it('allows to set and get the imageStretch property', function () {
        controlModel.imageStretch = imageStretch;
        expect(controlModel.imageStretch).toEqual(imageStretch);
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    it('allows to call the setMultipleProperties method to update Model properties (complete settings)', function () {
        controlModel.setMultipleProperties(completeSettings);
        expect(controlModel.top).toEqual(completeSettings.top);
        expect(controlModel.left).toEqual(completeSettings.left);
        expect(controlModel.width).toEqual(completeSettings.width);
        expect(controlModel.height).toEqual(completeSettings.height);
        expect(controlModel.imageSource).toEqual(completeSettings.imageSource);
        expect(controlModel.imageStretch).toEqual(completeSettings.imageStretch);
        expect(controlModel.imageVisible).toEqual(completeSettings.imageVisible);
    });
    it('allows to call the setMultipleProperties method to update Model properties (other settings)', function () {
        controlModel.setMultipleProperties(otherSettings);
        expect(controlModel.top).toEqual(otherSettings.top);
        expect(controlModel.left).toEqual(otherSettings.left);
        expect(controlModel.width).toEqual(otherSettings.width);
        expect(controlModel.height).toEqual(otherSettings.height);
        expect(controlModel.imageSource).toEqual(otherSettings.imageSource);
        expect(controlModel.imageStretch).toEqual(otherSettings.imageStretch);
        expect(controlModel.imageVisible).toEqual(otherSettings.imageVisible);
    });
});
//# sourceMappingURL=niHtmlContainerModel.Test.js.map