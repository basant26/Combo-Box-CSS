//****************************************
// Tests for ComboboxSelectorViewModel class
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
describe('A ComboBoxSelectorViewModel', function () {
    'use strict';
    let controlId;
    let viModel, frontPanelControls, controlModel, controlElement, comboBoxSelectorSettings, comboBoxSelectorUpdateSettings, comboBoxSelectorUpdateSettings2;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.comboBoxSelectorSettings.niControlId;
            comboBoxSelectorSettings = fixture.comboBoxSelectorSettings;
            comboBoxSelectorUpdateSettings = fixture.comboBoxSelectorUpdateSettings;
            comboBoxSelectorUpdateSettings2 = fixture.comboBoxSelectorUpdateSettings2;
            Object.freeze(comboBoxSelectorSettings);
            Object.freeze(comboBoxSelectorUpdateSettings);
            Object.freeze(comboBoxSelectorUpdateSettings2);
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
        $(document.body).append('<ni-combo-box-selector ni-control-id="' + controlId + '"></ni-combo-box-selector>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    describe('exists after the custom element is created', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(comboBoxSelectorSettings);
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
        it('and has the correct initial values.', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.allowUnlabeled).toEqual(comboBoxSelectorSettings.allowUnlabeled);
            expect(controlModel.value).toEqual(comboBoxSelectorSettings.value);
            expect(controlModel.items).toEqual(comboBoxSelectorSettings.items);
            expect(controlModel.popupEnabled).toEqual(comboBoxSelectorSettings.popupEnabled);
            expect(controlModel.textAlignment).toEqual(comboBoxSelectorSettings.textAlignment);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, comboBoxSelectorUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.allowUnlabeled).toEqual(comboBoxSelectorUpdateSettings.allowUnlabeled);
                expect(controlModel.value).toEqual(comboBoxSelectorUpdateSettings.value);
                expect(controlModel.popupEnabled).toEqual(comboBoxSelectorUpdateSettings.popupEnabled);
                expect(controlModel.textAlignment).toEqual(comboBoxSelectorUpdateSettings.textAlignment);
                expect(controlModel.items).toEqual(comboBoxSelectorUpdateSettings.items);
            });
        });
        it('and updates element on properties set', function (done) {
            webAppHelper.dispatchMessage(controlId, comboBoxSelectorUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlElement.value).toEqual(comboBoxSelectorUpdateSettings.value);
                expect(controlElement.popupEnabled).toEqual(comboBoxSelectorUpdateSettings.popupEnabled);
                expect(controlElement.allowUnlabeled).toEqual(comboBoxSelectorUpdateSettings.allowUnlabeled);
                expect(controlElement.items).toEqual(JSON.stringify(comboBoxSelectorUpdateSettings.items));
            });
        });
        it('and handles setting the value property to a nonexisting / unlabeled value and setting again to unlabeled value', function (done) {
            const comboBoxSelectorValueUpdateSettings = { value: 'unlabeled_Test1' };
            // nonexisting / unlabeled value property for second time updation
            const comboBoxSelectorValueUpdateSettings2 = { value: 'unlabeled_Test2' };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, comboBoxSelectorValueUpdateSettings);
            }, function () {
                expect(controlModel.value).toEqual(comboBoxSelectorValueUpdateSettings.value);
                expect(controlElement.value).toEqual(comboBoxSelectorValueUpdateSettings.value);
                const newIndex = controlElement.firstElementChild.selectedIndexes[0];
                expect(newIndex).toEqual(comboBoxSelectorSettings.items.length); // i.e. control added a new item to show this value
            }, function () {
                webAppHelper.dispatchMessage(controlId, comboBoxSelectorValueUpdateSettings2);
            }, function () {
                expect(controlModel.value).toEqual(comboBoxSelectorValueUpdateSettings2.value);
                expect(controlElement.value).toEqual(comboBoxSelectorValueUpdateSettings2.value);
                const newIndex = controlElement.firstElementChild.selectedIndexes[0];
                expect(newIndex).toEqual(comboBoxSelectorSettings.items.length); // i.e. control added a new item to show this value
            });
        });
        it('and handles setting the value property to a unlabeled value and then setting to labeled/existing value', function (done) {
            const comboBoxSelectorValueUpdateSettings = { value: 'unlabeled_Test1' };
            // existing value property for second time updation
            const comboBoxSelectorValueUpdateSettings2 = { value: 'first' };
            testHelpers.runMultipleAsync(done, function () {
                webAppHelper.dispatchMessage(controlId, comboBoxSelectorValueUpdateSettings);
            }, function () {
                webAppHelper.dispatchMessage(controlId, comboBoxSelectorValueUpdateSettings2);
            }, function () {
                expect(controlModel.value).toEqual(comboBoxSelectorValueUpdateSettings2.value);
                expect(controlElement.value).toEqual(comboBoxSelectorValueUpdateSettings2.value);
                const newIndex = controlElement.firstElementChild.selectedIndexes[0];
                expect(newIndex).toEqual(0); // since we update back to first item
            });
        });
        it('and updates textAlignment property. #FailsEdge', function (done) {
            webAppHelper.dispatchMessage(controlId, { textAlignment: 'right' });
            testHelpers.runAsync(done, function () {
                const comboBoxStyle = window.getComputedStyle(controlElement);
                expect(comboBoxStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN)).toEqual('right');
                expect(comboBoxStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX)).toEqual('flex-end');
            });
        });
        it('and updates readOnly to element', function (done) {
            webAppHelper.dispatchMessage(controlId, {
                readOnly: true
            });
            testHelpers.runAsync(done, function () {
                expect(controlModel.readOnly).toEqual(true);
                expect(controlElement.readOnly).toEqual(true);
            });
        });
    });
});
//# sourceMappingURL=niComboBoxSelectorViewModel.Test.js.map