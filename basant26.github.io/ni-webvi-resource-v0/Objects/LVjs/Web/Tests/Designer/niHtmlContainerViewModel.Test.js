//****************************************
// Tests for HtmlContainerViewModel class
// National Instruments Copyright 2019
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../../Framework/niCssProperties.js';
describe('A HtmlContainerViewModel', function () {
    'use strict';
    let controlId;
    let viModel, frontPanelControls, controlModel, controlElement, htmlContainerSettings, htmlContainerUpdateSettings;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            controlId = fixture.htmlContainerSettings.niControlId;
            htmlContainerSettings = fixture.htmlContainerSettings;
            htmlContainerUpdateSettings = fixture.htmlContainerUpdateSettings;
            Object.freeze(htmlContainerSettings);
            Object.freeze(htmlContainerUpdateSettings);
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
    it('allows elements to be added directly to the page.', function (done) {
        $(document.body).append('<ni-html-container ni-control-id="' + controlId + '"></ni-html-container>');
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            expect(viewModel).toBeDefined();
            webAppHelper.removeNIElement(controlId);
        });
    });
    const testBackgroundImage = function (done, controlId, value, expectedValue) {
        $(document.body).append(`<ni-html-container ni-control-id="${controlId}" style="--ni-placeholder-url: ${value}"></ni-html-container>`);
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(controlId);
            controlModel = viewModel.model;
            expect(controlModel.imageSource).toEqual(expectedValue);
            webAppHelper.removeNIElement(controlId);
        });
    };
    it('does not parse a "none" background image value.', function (done) {
        testBackgroundImage(done, controlId, 'none', '');
    });
    it('does not parse a "gradient" background image value.', function (done) {
        testBackgroundImage(done, controlId, 'linear-gradient(rgba(0, 0, 255, 0.5), rgba(255, 255, 0, 0.5))', '');
    });
    it('does not parse an "image-set" background image value.', function (done) {
        testBackgroundImage(done, controlId, 'image-set( \'cat.png\' 1x,\'cat-2x.png\' 2x,\'cat-print.png\' 600dpi)', '');
    });
    it('does not parse a "webkit-image-set" background image value.', function (done) {
        testBackgroundImage(done, controlId, "-webkit-image-set( url('path/to/image') 1x, url('path/to/high-res-image') 2x )", '');
    });
    it('parses a url background image with whitespace on both sides correctly.', function (done) {
        testBackgroundImage(done, controlId, " url( 'sdfsf' ) ", ''); // Update once we start syncing `imageSource` to the model.
    });
    it('parses a url background image with starting whitespace correctly.', function (done) {
        testBackgroundImage(done, controlId, " url( 'sdfsf')", ''); // Update once we start syncing `imageSource` to the model.
    });
    it('parses a url background image with trailing whitespace correctly.', function (done) {
        testBackgroundImage(done, controlId, "url('sdfsf')   ", ''); // Update once we start syncing `imageSource` to the model.
    });
    describe('exists with a placeholder image background', function () {
        let viewModel;
        beforeEach(function (done) {
            webAppHelper.createNIElement(htmlContainerSettings);
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
        it('and has the correct initial values on the model.', function () {
            expect(controlModel).toBeDefined();
            expect(viewModel).toBeDefined();
            expect(controlModel.imageSource).toEqual(htmlContainerSettings.imageSource);
            expect(controlModel.imageStretch).toEqual(htmlContainerSettings.imageStretch);
            expect(controlModel.imageVisible).toEqual(htmlContainerSettings.imageVisible);
        });
        it('and has the correct initial values on the element.', function () {
            const controlStyle = window.getComputedStyle(controlElement);
            expect(controlStyle.getPropertyValue(CSS_PROPERTIES.PLACEHOLDER_URL)).toContain(`url(`);
            expect(controlElement.imageStretch).toEqual(htmlContainerSettings.imageStretch);
            expect(controlElement.imageVisible).toEqual(htmlContainerSettings.imageVisible);
        });
        it('and updates the Model when properties change.', function (done) {
            webAppHelper.dispatchMessage(controlId, htmlContainerUpdateSettings);
            testHelpers.runAsync(done, function () {
                expect(controlModel.imageSource).toEqual(htmlContainerUpdateSettings.imageSource);
                expect(controlModel.imageStretch).toEqual(htmlContainerUpdateSettings.imageStretch);
                expect(controlModel.imageVisible).toEqual(htmlContainerUpdateSettings.imageVisible);
            });
        });
        it('and handles unknown property changes.', function (done) {
            const unknownSettings = {
                unknown: 'unknown'
            };
            const sendUnknownProperties = function () {
                webAppHelper.dispatchMessage(controlId, unknownSettings);
            };
            expect(sendUnknownProperties).toThrow();
            testHelpers.runAsync(done, function () {
                expect(controlModel.imageSource).toEqual(htmlContainerSettings.imageSource);
                expect(controlModel.imageStretch).toEqual(htmlContainerSettings.imageStretch);
                expect(controlModel.imageVisible).toEqual(htmlContainerSettings.imageVisible);
            });
        });
        it('and shows the placeholder image when imageVisible is true', function (done) {
            webAppHelper.dispatchMessage(controlId, { imageVisible: true });
            testHelpers.runAsync(done, function () {
                const controlStyle = window.getComputedStyle(controlElement);
                expect(controlStyle.backgroundImage).toContain('url(');
            });
        });
    });
});
//# sourceMappingURL=niHtmlContainerViewModel.Test.js.map