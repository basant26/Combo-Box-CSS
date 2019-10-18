//****************************************
// G Property Tests for ColorBoxModel class
// National Instruments Copyright 2019
//****************************************
import { ColorBoxValueConverter } from '../../Framework/ValueConverters/niColorBoxValueConverter.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A Color Box control', function () {
    'use strict';
    let controlId;
    let updateService, viModel, frontPanelControls, controlModel, viewModel, controlElement, colorBoxSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.colorBoxSettings.niControlId;
            colorBoxSettings = fixture.colorBoxSettings;
            Object.freeze(colorBoxSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(colorBoxSettings);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            controlModel = frontPanelControls[controlId];
            viewModel = viModel.getControlViewModel(controlId);
            controlElement = viewModel.element;
        });
    });
    afterEach(function () {
        webAppHelper.removeNIElement(controlId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    // Tests for Value property.
    it('property get for value returns current value.', function () {
        const newValue = 0x00445566;
        controlModel.value = newValue;
        const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(currentValue).toEqual(newValue);
    });
    it('property set for value updates the model.', function () {
        const newValue = 0x65632233;
        viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
        expect(controlModel.value).toEqual(newValue);
    });
    it('property set for value updates control element.', function (done) {
        const newValue = 0x77FEAA89;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.value).toEqual(ColorBoxValueConverter.convert(newValue));
        });
    });
    it('property set for value does not call controlChanged function of updateService', function () {
        const newValue = 0x56545423;
        spyOn(updateService, 'controlChanged');
        viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
        expect(updateService.controlChanged).not.toHaveBeenCalled();
    });
    // Tests for ValueSignaling property.
    it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function () {
        const newValue = 0x44679812;
        spyOn(updateService, 'controlChanged');
        viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
        expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, colorBoxSettings.value);
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newValue = colorBoxSettings.value;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, colorBoxSettings.value);
        });
    });
    it('property set for valueSignaling updates the model.', function (done) {
        const newValue = 0x44352256;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.value).toEqual(ColorBoxValueConverter.convert(newValue));
        });
    });
    // Tests for Position property.
    it('property get for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(colorBoxSettings.left),
            "Top": parseInt(colorBoxSettings.top)
        };
        expect(position).toEqual(expectedPosition);
    });
    it('property set for Position updates model.', function (done) {
        const newPosition = { Left: 100, Top: 200 };
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
            expect(parseInt(controlModel.left)).toEqual(newPosition.Left);
            expect(parseInt(controlModel.top)).toEqual(newPosition.Top);
        });
    });
    it('property set for Position updates control element.', function (done) {
        const newPosition = { Left: 150, Top: 250 };
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME, newPosition);
        }, function () {
            const computedStyle = window.getComputedStyle(controlElement);
            expect(parseInt(computedStyle.left)).toEqual(newPosition.Left);
            expect(parseInt(computedStyle.top)).toEqual(newPosition.Top);
        });
    });
    // Tests for Visible property.
    it('property get for Visible returns the current visible state.', function () {
        const newVisible = false;
        controlModel.visible = newVisible;
        const visibility = viewModel.getGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME);
        expect(visibility).toEqual(newVisible);
    });
    it('property set for Visible updates model.', function (done) {
        const newVisible = false;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newVisible);
            expect(controlModel.visible).toEqual(newVisible);
        });
    });
    it('property set for Visible updates control element.', function (done) {
        const newVisible = false;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, newVisible);
        }, function () {
            expect(controlElement.classList).toContain('ni-hidden');
        });
    });
    // Tests for Disabled property.
    it('property get for Disabled returns the current disabled state.', function () {
        const newDisabled = true;
        controlModel.enabled = !newDisabled;
        const disabled = viewModel.getGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME);
        expect(disabled).toEqual(newDisabled);
    });
    it('property set for Disabled updates model.', function (done) {
        const newDisabled = true;
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, newDisabled);
            expect(controlModel.enabled).toEqual(!newDisabled);
        });
    });
    it('property set for Disabled updates control element.', function (done) {
        const newDisabled = true;
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, newDisabled);
        }, function () {
            expect(controlElement.hasAttribute('disabled')).toEqual(newDisabled);
        });
    });
});
//# sourceMappingURL=niColorBoxProperties.Test.js.map