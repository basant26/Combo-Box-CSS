//*****************************************
// Tests for ColorBoxViewModel class
// National Instruments Copyright 2019
//*****************************************
import { ColorBoxValueConverter } from '../../Framework/ValueConverters/niColorBoxValueConverter.js';
import { paletteColors } from '../../Framework/jqxColorPickerModule.js';
describe('A ColorBoxViewModel', function () {
    let viModel, frontPanelControls, colorModel, colorElement, colorViewModel;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    let controlId, colorBoxSettings, colorBoxUpdateSettings;
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.colorBoxSettings.niControlId;
            colorBoxSettings = fixture.colorBoxSettings;
            colorBoxUpdateSettings = fixture.colorBoxUpdateSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('allows elements to be added directly to the page', function (done) {
        $(document.body).append('<jqx-color-picker ni-control-id="' + controlId + '"></jqx-color-picker>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        beforeEach(function (done) {
            webAppHelper.createNIElement(colorBoxSettings);
            testHelpers.runAsync(done, function () {
                frontPanelControls = viModel.getAllControlModels();
                colorModel = frontPanelControls[controlId];
                colorViewModel = viModel.getControlViewModel(controlId);
                colorElement = colorViewModel.element;
            });
        });
        afterEach(function () {
            webAppHelper.removeNIElement(controlId);
        });
        it('and has correct initial values', function (done) {
            testHelpers.runAsync(done, function () {
                expect(colorModel).toBeDefined();
                expect(colorViewModel).toBeDefined();
                expect(colorElement).toBeDefined();
                expect(colorModel.value).toEqual(colorBoxSettings.value);
                // verify element initial values
                expect(colorElement.enableCustomColors).toEqual(true);
                expect(colorElement.editAlphaChannel).toEqual(true);
                expect(colorElement.dropDownOpenMode).toEqual('none');
                expect(colorElement.valueDisplayMode).toEqual('colorBox');
                expect(colorElement.displayMode).toEqual('grid');
                expect(colorElement.palette).toEqual('custom');
                expect(colorElement.columnCount).toEqual(10);
                expect(colorElement.paletteColors).toEqual(paletteColors);
            });
        });
        it('and updates model when properties are set', function () {
            webAppHelper.dispatchMessage(controlId, colorBoxUpdateSettings);
            expect(colorModel.value).toEqual(colorBoxUpdateSettings.value);
        });
        it('and updates element when properties are set', function (done) {
            webAppHelper.dispatchMessage(controlId, colorBoxUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(colorElement.value).toEqual(ColorBoxValueConverter.convert(colorBoxUpdateSettings.value));
            });
        });
        it('and updates readOnly property on the element', function (done) {
            webAppHelper.dispatchMessage(controlId, {
                readOnly: true
            });
            testHelpers.runAsync(done, function () {
                expect(colorModel.readOnly).toEqual(true);
                expect(colorElement.hasAttribute('readonly')).toEqual(true);
            });
        });
    });
});
//# sourceMappingURL=niColorBoxViewModel.Test.js.map