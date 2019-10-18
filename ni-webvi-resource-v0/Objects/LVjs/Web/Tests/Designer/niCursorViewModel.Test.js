//****************************************
// Tests for CursorViewModel class
// National Instruments Copyright 2014
//****************************************
import { CartesianAxisModel } from "../../Modeling/niCartesianAxisModel.js";
import { CartesianGraphModel } from "../../Modeling/niCartesianGraphModel.js";
import { CursorModel } from "../../Modeling/niCursorModel.js";
describe('A CursorViewModel', function () {
    'use strict';
    const graphId = 'Function1';
    let viModel, axis1, axis2, cursor1, graph1, cursor2ElementSettings, cursor1Settings;
    const axis1Id = 'Function13', axis2Id = 'Function12', cursor1Id = 'Function20', cursor2Id = 'Function21';
    const testHelpers = window.testHelpers;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    /* flot redraw overlay is triggered on a 1000/60 ms timeout.
    runMultipleAsync is scheduled on rafs and that means that the next animation frame
    can (and will ussualy) occur before the redraw overlay. This function forces a redraw overlay*/
    const forceCursorsUpdate = function () {
        const viewModel = viModel.getControlViewModel(graphId);
        const element = viewModel.element;
        const ocontext = element.graph.getPlaceholder().find('.flot-overlay')[0].getContext('2d');
        element.graph.hooks.drawOverlay.forEach(function (hook) {
            hook.apply(element.graph, [element.graph].concat([ocontext]));
        });
    };
    beforeAll(function (done) {
        domVerifier.captureDomState();
        webAppHelper.installWebAppFixture(done);
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function () {
        axis1 = {
            label: 'Amplitude',
            show: true,
            showLabel: true,
            axisPosition: 'left',
            minimum: 0,
            maximum: 10,
            autoScale: 'none',
            logScale: false,
            niControlId: axis1Id,
            kind: CartesianAxisModel.MODEL_KIND
        };
        axis2 = {
            label: 'Time',
            show: true,
            showLabel: true,
            axisPosition: 'bottom',
            minimum: 0,
            maximum: 10,
            autoScale: 'none',
            logScale: false,
            niControlId: axis2Id,
            kind: CartesianAxisModel.MODEL_KIND
        };
        cursor1 = {
            label: 'cursor1',
            show: true,
            showLabel: false,
            showValue: false,
            targetShape: 'square',
            snapToPlot: undefined,
            crosshairStyle: 'both',
            fontSize: '16px',
            fontFamily: 'sans-serif',
            fontWeight: 'normal',
            fontStyle: 'normal',
            niControlId: cursor1Id,
            kind: CursorModel.MODEL_KIND
        };
        cursor1Settings = {
            label: 'cursor2',
            show: false,
            showLabel: true,
            showValue: true,
            targetShape: 'ellipse',
            snapToPlot: -1,
            crosshairStyle: 'vertical',
            fontSize: '20px',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            fontStyle: 'italic'
        };
        cursor2ElementSettings = {
            'label': 'cursor2',
            show: false,
            'show-label': true,
            'show-value': true,
            style: '"color: #ff0000;"',
            'target-shape': 'ellipse',
            'snap-to-data': false,
            'crosshair-style': 'vertical',
            'ni-control-id': cursor2Id
        };
        graph1 = {
            niControlId: graphId,
            kind: CartesianGraphModel.MODEL_KIND,
            left: '100px',
            top: '200px',
            width: '300px',
            height: '400px'
        };
    });
    beforeEach(function (done) {
        webAppHelper.createNIElementHierarchy([
            { currentSettings: graph1 },
            { currentSettings: axis1, parentId: graphId },
            { currentSettings: axis2, parentId: graphId },
            { currentSettings: cursor1, parentId: graphId }
        ], done);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
    });
    afterAll(function () {
        domVerifier.verifyDomState();
    });
    afterEach(function () {
        webAppHelper.removeNIElement(graphId);
    });
    it('allows creation with default settings', function (done) {
        testHelpers.runAsync(done, function () {
            const viewModel = viModel.getControlViewModel(graphId);
            expect(viewModel).toBeDefined();
        });
    });
    it('is positioned according to x and y coordinates #intermittent', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            forceCursorsUpdate();
        }, function () {
            const viewModel = viModel.getControlViewModel(graphId);
            const element = viewModel.element;
            const plot = element.graph;
            const cursor = plot.getCursors()[0];
            expect(cursor.x).toBe(plot.width() / 2);
            expect(cursor.y).toBe(plot.height() / 2);
        });
    });
    it('updates the Model when properties change.  #intermittent', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            forceCursorsUpdate();
        }, function () {
            webAppHelper.dispatchMessage(cursor1Id, cursor1Settings);
        }, function () {
            const model = viModel.getControlModel(cursor1Id);
            Object.keys(cursor1Settings).forEach(function (key) {
                expect(model[key]).toBe(cursor1Settings[key]);
            });
        });
    });
    it('allows cursor element to be added directly to the page.', function (done) {
        testHelpers.runMultipleAsync(done, function () {
            const viewModel = viModel.getControlViewModel(graphId);
            const element = viewModel.element;
            webAppHelper.appendElement('ni-cursor', cursor2ElementSettings, element);
        }, function () {
            const model = viModel.getControlModel(cursor2Id);
            expect(model.label).toBe('cursor2');
            expect(model.show).toBe(false);
            expect(model.showValue).toBe(true);
            expect(model.color).toBe('rgb(255, 0, 0)');
            expect(model.targetShape).toBe('ellipse');
            expect(model.snapToPlot).toBe(undefined);
            expect(model.crosshairStyle).toBe('vertical');
        });
    });
});
//# sourceMappingURL=niCursorViewModel.Test.js.map