"use strict";
//****************************************
// Tests for ComboBoxSelector element
// National Instruments Copyright 2019
//****************************************
describe('The ni-combo-box-selector element', function () {
    let controlId;
    let controlElement, comboBoxSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.comboBoxSelectorSettings.niControlId;
            comboBoxSettings = fixture.comboBoxSelectorSettings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeEach(function () {
        comboBoxSettings.popupEnabled = false;
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
    it('has the correct defaults when created with popup disabled', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            controlElement = webAppHelper.createNIElement(comboBoxSettings);
        }, function () {
            const jqxComboBoxElement = controlElement.querySelector('jqx-combo-box');
            expect(jqxComboBoxElement).not.toBeNull();
            expect(jqxComboBoxElement.selectionMode).toBe('one');
            expect(jqxComboBoxElement.dropDownHeight).toBe('auto');
            expect(jqxComboBoxElement.dropDownOpenMode).toBe('none');
            expect(jqxComboBoxElement.autoOpenShortcutKey).toEqual([]);
            expect(jqxComboBoxElement.escKeyMode).toBe('none');
        });
    });
    it('has the correct defaults when created with popup enabled', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            comboBoxSettings.popupEnabled = true;
            controlElement = webAppHelper.createNIElement(comboBoxSettings);
        }, function () {
            const jqxComboBoxElement = controlElement.querySelector('jqx-combo-box');
            expect(jqxComboBoxElement).not.toBeNull();
            expect(jqxComboBoxElement.selectionMode).toBe('one');
            expect(jqxComboBoxElement.dropDownHeight).toBe('auto');
            expect(jqxComboBoxElement.dropDownOpenMode).toBe('default');
            expect(jqxComboBoxElement.autoOpenShortcutKey).toEqual(['ArrowDown', 'ArrowUp']);
            expect(jqxComboBoxElement.escKeyMode).toBe('clearValue');
        });
    });
});
//# sourceMappingURL=ni-combo-box-selector.Test.js.map