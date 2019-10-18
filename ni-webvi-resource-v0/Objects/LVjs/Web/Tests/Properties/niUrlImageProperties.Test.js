//****************************************
// G Property Tests for UrlImageModel class
// National Instruments Copyright 2018
//****************************************
import { UrlImageModel } from '../../Modeling/niUrlImageModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A UrlImage control', function () {
    'use strict';
    let controlId;
    let viModel, frontPanelControls, controlModel, viewModel, controlElement, urlImageViewSettings, urlImageViewUpdateSettings;
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const hyperlinkUrl = "http://ni.com/";
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.urlImageViewSettings.niControlId;
            urlImageViewSettings = fixture.urlImageViewSettings;
            urlImageViewUpdateSettings = fixture.urlImageViewUpdateSettings;
            Object.freeze(urlImageViewSettings);
            Object.freeze(urlImageViewUpdateSettings);
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function (done) {
        webAppHelper.createNIElement(urlImageViewSettings);
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
    // TODO should be removed after we migrate to jasmine >= 2.7 and the `it` blocks support async functions natively
    const makeAsync = function (done, fn) {
        fn().then(() => done()).catch((ex) => done.fail(ex));
    };
    it('property read for Value returns the current value.', function () {
        const url = viewModel.getGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME);
        expect(url).toEqual(urlImageViewSettings.source);
    });
    it('property set for Value updates model.', function (done) {
        const newUrl = '../Utilities/other.png';
        testHelpers.runAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newUrl);
            expect(controlModel.source).toEqual(newUrl);
        });
    });
    it('property set for Value updates control element.', function (done) {
        const newUrl = '../Utilities/other.png';
        testHelpers.runMultipleAsync(done, function () {
            viewModel.setGPropertyValue(VisualModel.VALUE_G_PROPERTY_NAME, newUrl);
            expect(controlModel.source).toEqual(newUrl);
        }, function () {
            expect(controlElement.source).toEqual(newUrl);
        });
    });
    it('property read for Position returns the current position.', function () {
        const position = viewModel.getGPropertyValue(VisualModel.POSITION_G_PROPERTY_NAME);
        const expectedPosition = {
            "Left": parseInt(urlImageViewSettings.left),
            "Top": parseInt(urlImageViewSettings.top)
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
    it('property get for HyperlinkUrl returns the current href value', function (done) {
        webAppHelper.dispatchMessage(controlId, urlImageViewUpdateSettings);
        testHelpers.runAsync(done, function () {
            const currentHyperlinkUrlValue = viewModel.getGPropertyValue(UrlImageModel.HYPERLINK_URL_G_PROPERTY_NAME);
            expect(currentHyperlinkUrlValue).toEqual(urlImageViewUpdateSettings.href);
        });
    });
    it('property get for KeyFocus always returns false if the hyperlink URL is not configured.', function () {
        const previousKeyFocusPropertyValue = viewModel.getGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME);
        expect(previousKeyFocusPropertyValue).toEqual(false);
        viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, true);
        const currentKeyFocusPropertyValue = viewModel.getGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME);
        expect(currentKeyFocusPropertyValue).toEqual(false);
    });
    describe('with a hyperlink URL configured', function () {
        beforeEach(function (done) {
            makeAsync(done, async function () {
                viewModel.setGPropertyValue(UrlImageModel.HYPERLINK_URL_G_PROPERTY_NAME, hyperlinkUrl);
                await testHelpers.waitAsync();
            });
        });
        it('property set for HyperlinkUrl updates the model.', function () {
            expect(controlModel.href).toEqual(hyperlinkUrl);
        });
        it('property set for HyperlinkUrl updates the element.', function () {
            expect(controlElement.href).toEqual(hyperlinkUrl);
        });
        it('property get for KeyFocus returns true if the element or one of its descendants has keyboard focus, false otherwise.', function () {
            const previousKeyFocusPropertyValue = viewModel.getGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME);
            expect(previousKeyFocusPropertyValue).toEqual(false);
            viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, true);
            const currentKeyFocusPropertyValue = viewModel.getGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME);
            expect(currentKeyFocusPropertyValue).toEqual(true);
        });
        it('property set true for KeyFocus makes the link the active element in the document.', function () {
            viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, true);
            expect(viewModel.element.contains(document.activeElement)).toEqual(true);
            expect(viewModel.element.querySelector('a')).toEqual(document.activeElement);
        });
        it('property set false for KeyFocus blurs the link.', function () {
            viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, true);
            expect(viewModel.element.contains(document.activeElement)).toEqual(true);
            viewModel.setGPropertyValue(VisualModel.KEY_FOCUS_G_PROPERTY_NAME, false);
            expect(viewModel.element.contains(document.activeElement)).toEqual(false);
        });
        it('property get for Disabled defaults to false.', function () {
            const previousDisabledPropertyValue = viewModel.getGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME);
            expect(previousDisabledPropertyValue).toEqual(false);
        });
        it('property set for Disabled to true disables control element by removing href.', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, true);
            }, function () {
                const anchorElement = controlElement.getElementsByTagName('a')[0];
                expect(anchorElement.href).toEqual('');
            });
        });
        it('property set for Disabled to false after true enables control element by restoring the href.', function (done) {
            testHelpers.runMultipleAsync(done, function () {
                viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, true);
            }, function () {
                viewModel.setGPropertyValue(VisualModel.DISABLED_G_PROPERTY_NAME, false);
            }, function () {
                const anchorElement = controlElement.getElementsByTagName('a')[0];
                expect(anchorElement.href).toEqual(hyperlinkUrl);
            });
        });
    });
});
//# sourceMappingURL=niUrlImageProperties.Test.js.map