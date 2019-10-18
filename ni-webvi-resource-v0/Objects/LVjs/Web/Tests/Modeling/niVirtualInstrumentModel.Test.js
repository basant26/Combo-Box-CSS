//******************************************
// Tests for VI Model classes
// National Instruments Copyright 2014
//******************************************
import { BooleanButtonModel } from '../../Modeling/niBooleanButtonModel.js';
import { ClusterModel } from '../../Modeling/niClusterModel.js';
import { VirtualInstrumentModel } from '../../Modeling/niVirtualInstrumentModel.js';
describe('A VIModel', function () {
    'use strict';
    const viName = 'Function.gvi';
    const viRef = '';
    // -------------------------------------------------
    // Testing setters and getters for properties
    // -------------------------------------------------
    describe('without any children elements', function () {
        let viModel;
        beforeEach(function () {
            viModel = new VirtualInstrumentModel();
        });
        afterEach(function () {
            viModel = undefined;
        });
        it('allows to call his constructor', function () {
            expect(viModel).toBeDefined();
        });
        it('has undefined values by default', function () {
            expect(viModel.viName).toBe(undefined);
            expect(viModel.viRef).toBe(undefined);
        });
        it('can change the default values', function () {
            viModel.viName = viName;
            viModel.viRef = viRef;
            expect(viModel.viName).toBe(viName);
            expect(viModel.viRef).toBe(viRef);
        });
        it('has an owner that is the value undefined', function () {
            expect(viModel.getOwner()).toBe(undefined);
        });
        it('has no control models', function () {
            expect(viModel.getAllControlModels()).toEqual({});
        });
    });
    // -------------------------------------------------
    // Testing behavior (methods)
    // -------------------------------------------------
    describe('is created in a web application', function () {
        let viModel;
        let buttonSettings, clusterSettings, cartesianGraphSettings, plotSettings1, plotSettings2, frontPanelControls, graphModel, graphId;
        let buttonUpdateSettings;
        const testHelpers = window.testHelpers;
        const webAppHelper = testHelpers.createWebAppTestHelper();
        const domVerifier = testHelpers.createDomVerifier(this.description);
        // Helper function copied to this file
        // TODO should be removed after we migrate to jasmine >= 2.7 and the `it` blocks support async functions natively
        const makeAsync = function (done, fn) {
            fn().then(() => done()).catch((ex) => done.fail(ex));
        };
        beforeAll(function (done) {
            domVerifier.captureDomState();
            testHelpers.fetchJsonFixtureForElements().then((fixture) => {
                graphId = fixture.cartesianGraphSettings.niControlId;
                cartesianGraphSettings = fixture.cartesianGraphSettings;
                // plot settings
                plotSettings1 = fixture.cartesianGraphPlot1Settings;
                plotSettings1.show = true;
                plotSettings2 = fixture.cartesianGraphPlot2Settings;
            });
            webAppHelper.installWebAppFixture(done);
        });
        beforeAll(function () {
            viModel = webAppHelper.getVIModelForFixture();
        });
        beforeEach(function () {
            buttonSettings = {
                niControlId: 'id45',
                bindingInfo: {
                    prop: 'value',
                    field: 'field1',
                    isLatched: true
                },
                kind: BooleanButtonModel.MODEL_KIND,
                left: '100px',
                top: '200px',
                width: '300px',
                height: '400px'
            };
            buttonUpdateSettings = {
                left: '500px',
                top: '600px',
                width: '700px',
                height: '800px'
            };
            clusterSettings = {
                niControlId: 'id55',
                bindingInfo: {
                    prop: 'value',
                    dataItem: 'dataItem_22',
                    unplacedOrDisabled: false,
                    isLatched: false
                },
                kind: ClusterModel.MODEL_KIND
            };
        });
        afterAll(function (done) {
            webAppHelper.removeWebAppFixture(done);
        });
        afterAll(function () {
            domVerifier.verifyDomState();
        });
        describe('with two child elements', function () {
            let buttonModel;
            beforeEach(function (done) {
                webAppHelper.createNIElement(clusterSettings);
                webAppHelper.createNIElement(buttonSettings, clusterSettings.niControlId);
                testHelpers.runAsync(done, function () {
                    buttonModel = viModel.getControlModel(buttonSettings.niControlId);
                });
            });
            afterEach(function (done) {
                webAppHelper.removeNIElement(clusterSettings.niControlId);
                testHelpers.runAsync(done, function () {
                    buttonModel = undefined;
                });
            });
            it('has access to two child models', function () {
                const controlModels = viModel.getAllControlModels();
                expect(controlModels).toBeDefined();
                expect(Object.keys(controlModels).length).toBe(2);
                expect(controlModels[clusterSettings.niControlId]).toBeDefined();
                expect(controlModels[buttonSettings.niControlId]).toBeDefined();
            });
            it('can run getLocalBindingInfo on the controls', function () {
                const controlModels = viModel.getAllControlModels();
                const clusterLocalBindingInfo = controlModels[clusterSettings.niControlId].getLocalBindingInfo();
                const buttonLocalBindingInfo = controlModels[buttonSettings.niControlId].getLocalBindingInfo();
                expect(buttonLocalBindingInfo).toEqual({
                    runtimePath: undefined,
                    encodedVIName: 'test%2Egvi',
                    prop: 'value',
                    sync: false,
                    dataItem: '',
                    accessMode: '',
                    isLatched: true
                });
                expect(clusterLocalBindingInfo).toEqual({
                    runtimePath: 'dataItem_22',
                    encodedVIName: 'test%2Egvi',
                    prop: 'value',
                    sync: false,
                    dataItem: 'dataItem_22',
                    accessMode: '',
                    isLatched: false
                });
            });
            it('can call processControlUpdate for a control owned by the VI', function (done) {
                viModel.processControlUpdate(buttonSettings.niControlId, buttonUpdateSettings);
                testHelpers.runAsync(done, function () {
                    expect(buttonModel.top).toBe(buttonUpdateSettings.top);
                    expect(buttonModel.left).toBe(buttonUpdateSettings.left);
                    expect(buttonModel.width).toBe(buttonUpdateSettings.width);
                    expect(buttonModel.height).toBe(buttonUpdateSettings.height);
                });
            });
            it('can call processControlUpdateToSetGPropertyValueAsync for a control owned by the VI', function (done) {
                makeAsync(done, async function () {
                    await viModel.processControlUpdateToSetGPropertyValueAsync(buttonSettings.niControlId, 'Value', true);
                    testHelpers.runAsync(done, function () {
                        expect(buttonModel.value).toBe(true);
                    });
                });
            });
            it('can call processControlUpdateToGetGPropertyValue for a control owned by the VI', function (done) {
                viModel.processControlUpdate(buttonSettings.niControlId, { value: false });
                testHelpers.runAsync(done, function () {
                    const value = viModel.processControlUpdateToGetGPropertyValue(buttonSettings.niControlId, 'Value');
                    expect(value).toBe(false);
                });
            });
        });
        describe('with graph control', function () {
            beforeEach(function (done) {
                graphId = cartesianGraphSettings.niControlId;
                webAppHelper.createNIElement(cartesianGraphSettings);
                webAppHelper.createNIElement(plotSettings1, graphId);
                webAppHelper.createNIElement(plotSettings2, graphId);
                testHelpers.runAsync(done, function () {
                    frontPanelControls = viModel.getAllControlModels();
                    graphModel = frontPanelControls[graphId];
                });
            });
            afterEach(function () {
                webAppHelper.removeNIElement(plotSettings2.niControlId);
                webAppHelper.removeNIElement(plotSettings1.niControlId);
                webAppHelper.removeNIElement(graphId);
            });
            it('can set ActivePlot property of graph control by calling processControlUpdateToSetGPropertyValueAsync', function (done) {
                makeAsync(done, async function () {
                    const newActivePlot = 1;
                    await viModel.processControlUpdateToSetGPropertyValueAsync(cartesianGraphSettings.niControlId, 'ActivePlot', newActivePlot);
                    testHelpers.runAsync(done, function () {
                        expect(graphModel.activePlot).toBe(newActivePlot);
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=niVirtualInstrumentModel.Test.js.map