//****************************************
// G Property Tests for ComboBoxSelectorModel class
// National Instruments Copyright 2018
//****************************************
import { ComboBoxSelectorModel } from '../../Modeling/niComboBoxSelectorModel.js';
import { ComboBoxSelectorViewModel } from '../../Designer/niComboBoxSelectorViewModel.js';
import { NI_SUPPORT } from '../../Framework/niSupport.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A Combo Box control', function () {
    'use strict';
    let controlId;
    let updateService, viModel, frontPanelControls, controlModel, viewModel, controlElement, comboBoxSelectorSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const newSource = [{ value: 'Test_0', displayValue: 'first' },
        { value: 'Test_1', displayValue: 'second' },
        { value: 'Test_2', displayValue: 'third' },
        { value: 'Test_3', displayValue: 'fourth' }];
    // TODO should be removed after we migrate to jasmine >= 2.7 and the `it` blocks support async functions natively
    const makeAsync = function (done, fn) {
        fn().then(() => done()).catch((ex) => done.fail(ex));
    };
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.comboBoxSelectorSettings.niControlId;
            comboBoxSelectorSettings = fixture.comboBoxSelectorSettings;
            Object.freeze(comboBoxSelectorSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
        updateService = webAppHelper.getUpdateService();
    });
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
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    it('property get for Items returns only display values.', function () {
        const items = viewModel.getGPropertyValue(ComboBoxSelectorModel.ITEMS_G_PROPERTY_NAME);
        expect(items).toEqual(['first', 'second', 'third']);
    });
    it('property get for ItemsAndValues returns items and values.', function () {
        const iteamsAndValues = viewModel.getGPropertyValue(ComboBoxSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME);
        expect(iteamsAndValues).toEqual([{ String: 'first', Value: 'Test_first' }, { String: 'second', Value: 'Test_second' }, { String: 'third', Value: 'Test_third' }]);
    });
    it('property get for value returns current value.', function () {
        const currentValue = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(currentValue).toEqual(comboBoxSelectorSettings.value);
    });
    it('property get for DisabledIndexes returns all the disabled indexes.', function (done) {
        const disabledIndexes = [1];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(comboBoxSelectorSettings.niControlId, { disabledIndexes: disabledIndexes });
        }, function () {
            const currentDisabledIndexes = viewModel.getGPropertyValue(ComboBoxSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME);
            expect(currentDisabledIndexes).toEqual(disabledIndexes);
        });
    });
    it('property set for Items updates display values and names.', function (done) {
        const newItems = ['alpha', 'beta', 'charlie'];
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(ComboBoxSelectorModel.ITEMS_G_PROPERTY_NAME, newItems);
            expect(controlModel.items).toEqual([{ displayValue: 'alpha', value: 'alpha' }, { displayValue: 'beta', value: 'beta' }, { displayValue: 'charlie', value: 'charlie' }]);
        });
    });
    it('property set for Items updates control element.', function (done) {
        const newItems = ['alpha', 'beta', 'charlie'];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(ComboBoxSelectorModel.ITEMS_G_PROPERTY_NAME, newItems);
            expect(controlModel.items).toEqual([{ displayValue: 'alpha', value: 'alpha' }, { displayValue: 'beta', value: 'beta' }, { displayValue: 'charlie', value: 'charlie' }]);
        }, function () {
            expect(controlElement.items).toEqual('[{"displayValue":"alpha","value":"alpha"},{"displayValue":"beta","value":"beta"},{"displayValue":"charlie","value":"charlie"}]');
        });
    });
    it('property set for DisabledIndexes updates the control element.', function (done) {
        const disabledIndexes = [0, 1];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(comboBoxSelectorSettings.niControlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(ComboBoxSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME, disabledIndexes);
            expect(controlModel.disabledIndexes).toEqual(disabledIndexes);
        }, function () {
            expect(JSON.parse(controlElement.disabledIndexes)).toEqual(disabledIndexes);
        });
    });
    it('set DisabledIndexes to empty array updates the control element.', function (done) {
        const disabledIndexes = [];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(comboBoxSelectorSettings.niControlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(ComboBoxSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME, disabledIndexes);
            expect(controlModel.disabledIndexes).toEqual(disabledIndexes);
        }, function () {
            expect(JSON.parse(controlElement.disabledIndexes)).toEqual(disabledIndexes);
        });
    });
    it('set DisabledIndexes should not remove out of bounds, duplicate indices and update the valid indices of element.', function (done) {
        const disabledIndexes = [-1, 2, 2, 100, -10];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(comboBoxSelectorSettings.niControlId, { items: newSource });
        }, function () {
            viewModel.setGPropertyValue(ComboBoxSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME, disabledIndexes);
            expect(controlModel.disabledIndexes).toEqual(disabledIndexes);
        }, function () {
            expect(JSON.parse(controlElement.disabledIndexes)).toEqual(disabledIndexes);
            const items = controlElement.querySelectorAll('jqx-combo-box');
            disabledIndexes.forEach(index => {
                if (index >= 0 && index < items.length) {
                    expect(items[index].disabled).toEqual(true);
                    // also check for opacity
                    const style = window.getComputedStyle(items[index]);
                    expect(style.opacity).toBeLessThan(1.0);
                }
            });
        });
    });
    it('property set for ItemsAndValues updates control element.', function (done) {
        const newItems = [{ Value: 'Test_0', String: 'alpha' }, { Value: 'Test_1', String: 'beta' }, { Value: 'Test_2', String: 'tango' }];
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(ComboBoxSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME, newItems);
        }, function () {
            const expectedNewItems = [{ "displayValue": "alpha", "value": "Test_0" }, { "displayValue": "beta", "value": "Test_1" }, { "displayValue": "tango", "value": "Test_2" }];
            expect(controlModel.items).toEqual(expectedNewItems);
            expect(controlElement.items).toEqual(JSON.stringify(expectedNewItems));
        });
    });
    it('property set for ItemsAndValues throws for duplicate values.', function (done) {
        makeAsync(done, async function () {
            const newItems = [{ Value: 'Test_0', String: 'alpha' }, { Value: 'Test_0', String: 'beta' }, { Value: 'Test_2', String: 'tango' }];
            const errorMessage = NI_SUPPORT.i18n('msg_DUPLICATE_VALUE');
            let error;
            try {
                await viewModel.setGPropertyValue(ComboBoxSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME, newItems);
            }
            catch (e) {
                error = e;
            }
            expect(error.message).toEqual(errorMessage);
            expect(error.code).toEqual(ComboBoxSelectorViewModel.DUPLICATE_VALUES_NOT_ALLOWED_ERROR_CODE);
        });
    });
    it('property set for ItemsAndValues throws for empty display values and values.', function (done) {
        makeAsync(done, async function () {
            const newItems = [{ Value: '', String: '' }, { Value: 'Test_1', String: 'beta' }, { Value: 'Test_2', String: 'tango' }];
            const errorMessage = NI_SUPPORT.i18n('msg_EMPTY_DISPLAY_VALUE_AND_VALUE');
            let error;
            try {
                await viewModel.setGPropertyValue(ComboBoxSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME, newItems);
            }
            catch (e) {
                error = e;
            }
            expect(error.message).toEqual(errorMessage);
            expect(error.code).toEqual(ComboBoxSelectorViewModel.DISPLAY_VALUES_AND_VALUES_MUST_NOT_BE_EMPTY_ERROR_CODE);
        });
    });
    it('property set for ItemsAndValues throws for duplicate display values.', function (done) {
        makeAsync(done, async function () {
            const newItems = [{ Value: 'Test_0', String: 'alpha' }, { Value: 'Test_1', String: 'alpha' }, { Value: 'Test_2', String: 'tango' }];
            const errorMessage = NI_SUPPORT.i18n('msg_DUPLICATE_DISPLAY_VALUE');
            let error;
            try {
                await viewModel.setGPropertyValue(ComboBoxSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME, newItems);
            }
            catch (e) {
                error = e;
            }
            expect(error.message).toEqual(errorMessage);
            expect(error.code).toEqual(ComboBoxSelectorViewModel.DUPLICATE_DISPLAY_VALUES_NOT_ALLOWED_ERROR_CODE);
        });
    });
    it('property set for value updates control element when allow unlabeled is true.', function (done) {
        const newValue = 'TestValue';
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(comboBoxSelectorSettings.niControlId, {
                items: newSource,
                allowUnlabeled: true
            });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.value).toEqual(newValue);
        });
    });
    it('property set for value updates the model when allow undefined is true.', function (done) {
        const newValue = 'TestValue';
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(comboBoxSelectorSettings.niControlId, {
                items: newSource,
                allowUnlabeled: true
            });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        });
    });
    it('property set for value does not call controlChanged function of updateService', function (done) {
        const newValue = 'TestValue';
        const newSource = [{ value: 'Test_a', displayValue: 'a' },
            { value: 'Test_a', displayValue: 'b' },
            { value: 'Test_c', displayValue: 'c' },
            { value: 'Test_d', displayValue: 'd' }];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(comboBoxSelectorSettings.niControlId, {
                items: newSource,
                allowUnlabeled: true
            });
        }, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).not.toHaveBeenCalled();
        });
    });
    it('property set for valueSignaling calls controlChanged function of updateService with correct arguments', function (done) {
        const newValue = 'TestValue';
        const newSource = [{ value: 'Test_a', displayValue: 'a' },
            { value: 'Test_a', displayValue: 'b' },
            { value: 'Test_c', displayValue: 'c' },
            { value: 'Test_d', displayValue: 'd' }];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(comboBoxSelectorSettings.niControlId, {
                items: newSource,
                allowUnlabeled: true
            });
        }, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, comboBoxSelectorSettings.value);
        });
    });
    it('property set for valueSignaling with the same value as the current value calls controlChanged function of updateService', function (done) {
        const newValue = comboBoxSelectorSettings.value;
        testHelpers.runAsync(done, function () {
            spyOn(updateService, 'controlChanged');
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(updateService.controlChanged).toHaveBeenCalledWith(viModel, controlModel, 'value', newValue, comboBoxSelectorSettings.value);
        });
    });
    it('property set for valueSignaling updates the model when allow undefined is true.', function (done) {
        const newValue = "TestValue";
        const newSource = [{ value: 'Test_a', displayValue: 'a' },
            { value: 'Test_a', displayValue: 'b' },
            { value: 'Test_c', displayValue: 'c' },
            { value: 'Test_d', displayValue: 'd' }];
        testHelpers.runMultipleAsync(done, function () {
            webAppHelper.dispatchMessage(comboBoxSelectorSettings.niControlId, {
                items: newSource,
                allowUnlabeled: true
            });
        }, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME, newValue);
            expect(controlModel.value).toEqual(newValue);
        }, function () {
            expect(controlElement.value).toEqual(newValue);
        });
    });
    it('property set true for KeyFocus makes the control the active element in the document.', function () {
        expect(viewModel.element.contains(document.activeElement)).toEqual(false);
        viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, true);
        expect(viewModel.element.contains(document.activeElement)).toEqual(true);
    });
    it('property set false for KeyFocus blurs the control.', function () {
        viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, true);
        expect(viewModel.element.contains(document.activeElement)).toEqual(true);
        viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, false);
        expect(viewModel.element.contains(document.activeElement)).toEqual(false);
    });
    it('property get for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(comboBoxSelectorSettings.left),
            "Top": parseInt(comboBoxSelectorSettings.top)
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
    // Tests for Disabled property
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
            expect(controlElement.firstElementChild.hasAttribute('disabled')).toEqual(newDisabled);
        });
    });
});
//# sourceMappingURL=niComboBoxSelectorProperties.Test.js.map