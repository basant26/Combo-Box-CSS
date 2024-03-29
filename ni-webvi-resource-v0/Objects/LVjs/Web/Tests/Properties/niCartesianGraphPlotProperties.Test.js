//****************************************
// G Property Tests for CartesianPlotViewModel attached to CartesianGraphViewModel class
// National Instruments Copyright 2018
//****************************************
import { CartesianPlotModel } from '../../Modeling/niCartesianPlotModel.js';
import { ColorValueConverters as ColorHelpers } from '../../Framework/ValueConverters/niColorValueConverters.js';
import { GraphBaseModel } from '../../Modeling/niGraphBaseModel.js';
import { GraphBaseViewModel } from '../../Designer/niGraphBaseViewModel.js';
import { NI_SUPPORT } from '../../Framework/niSupport.js';
import { PlotRendererModel } from '../../Modeling/niPlotRendererModel.js';
import { VisualModel } from '../../Modeling/niVisualModel.js';
describe('A CartesianGraph control', function () {
    'use strict';
    let viModel, frontPanelControls, graphModel, graphViewModel, plotSettings1, plotSettings2, plotRendererSettings1, plotRendererSettings2, plot1ViewModel, plotRenderer1ViewModel, plotRenderer1Model;
    const webAppHelper = testHelpers.createWebAppTestHelper();
    const domVerifier = testHelpers.createDomVerifier(this.description);
    const PlotModel = CartesianPlotModel;
    let graphId, cartesianGraphSettings;
    const NITypeNames = window.NITypeNames;
    const NIType = window.NIType;
    const NIAnalogWaveform = window.NIAnalogWaveform;
    // TODO should be removed after we migrate to jasmine >= 2.7 and the `it` blocks support async functions natively
    const makeAsync = function (done, fn) {
        fn().then(() => done()).catch((ex) => done.fail(ex));
    };
    beforeAll(function (done) {
        domVerifier.captureDomState();
        testHelpers.fetchJsonFixtureForElements().then((fixture) => {
            graphId = fixture.cartesianGraphSettings2.niControlId;
            cartesianGraphSettings = fixture.cartesianGraphSettings2;
            // plot settings
            plotSettings1 = fixture.cartesianGraphPlot1Settings;
            plotSettings1.show = true;
            plotSettings2 = fixture.cartesianGraphPlot2Settings;
            // Plot renderer settings
            plotRendererSettings1 = fixture.cartesianGraphRenderer1Settings;
            plotRendererSettings2 = fixture.cartesianGraphRenderer2Settings;
            webAppHelper.installWebAppFixture(done);
        });
    });
    beforeAll(function () {
        viModel = webAppHelper.getVIModelForFixture();
    });
    beforeEach(function (done) {
        Object.freeze(cartesianGraphSettings);
        webAppHelper.createNIElement(cartesianGraphSettings);
        webAppHelper.createNIElement(plotSettings1, graphId);
        webAppHelper.createNIElement(plotRendererSettings1, plotSettings1.niControlId);
        webAppHelper.createNIElement(plotSettings2, graphId);
        webAppHelper.createNIElement(plotRendererSettings2, plotSettings2.niControlId);
        testHelpers.runAsync(done, function () {
            frontPanelControls = viModel.getAllControlModels();
            graphModel = frontPanelControls[graphId];
            graphViewModel = viModel.getControlViewModel(graphId);
            plot1ViewModel = viModel.getControlViewModel(plotSettings1.niControlId);
            plotRenderer1ViewModel = viModel.getControlViewModel(plotRendererSettings1.niControlId);
            plotRenderer1Model = plotRenderer1ViewModel.model;
        });
    });
    afterEach(function () {
        webAppHelper.removeNIElement(plotRendererSettings2.niControlId);
        webAppHelper.removeNIElement(plotSettings2.niControlId);
        webAppHelper.removeNIElement(plotRendererSettings1.niControlId);
        webAppHelper.removeNIElement(plotSettings1.niControlId);
        webAppHelper.removeNIElement(graphId);
    });
    afterAll(function (done) {
        webAppHelper.removeWebAppFixture(done);
        domVerifier.verifyDomState();
    });
    // Tests for ActivePlot property.
    it('property set for ActivePlot updates the model.', function (done) {
        makeAsync(done, async function () {
            await graphViewModel.setGPropertyValueAsync(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME, 1);
            expect(graphModel.activePlot).toEqual(1);
        });
    });
    it('property set for ActivePlot -ve value throws.', function (done) {
        makeAsync(done, async function () {
            let error;
            const activePlotValue = -1;
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_PLOT_SET_INDEX_OUT_OF_BOUNDS', activePlotValue, 1);
            try {
                await graphViewModel.setGPropertyValueAsync(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME, activePlotValue);
            }
            catch (e) {
                error = e;
            }
            expect(error.message).toEqual(errorMessage);
            expect(error.code).toEqual(GraphBaseViewModel.ACTIVE_PLOT_NOT_VALID_ERROR_CODE);
        });
    });
    it('property set for ActivePlot out of bound value throws.', function (done) {
        makeAsync(done, async function () {
            let error;
            const activePlotValue = 11;
            const errorMessage = NI_SUPPORT.i18n('msg_PROPERTY_PLOT_SET_INDEX_OUT_OF_BOUNDS', activePlotValue, 1);
            try {
                await graphViewModel.setGPropertyValueAsync(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME, activePlotValue);
            }
            catch (e) {
                error = e;
            }
            expect(error.message).toEqual(errorMessage);
            expect(error.code).toEqual(GraphBaseViewModel.ACTIVE_PLOT_NOT_VALID_ERROR_CODE);
        });
    });
    it('property read for ActivePlot returns the default value 0.', function () {
        const activePlot = graphViewModel.getGPropertyValue(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME);
        expect(activePlot).toEqual(0);
    });
    it('property read for ActivePlot returns the current value', function () {
        const activePlot = 2;
        graphModel.activePlot = activePlot;
        const currentActivePlot = graphViewModel.getGPropertyValue(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME);
        expect(currentActivePlot).toEqual(activePlot);
    });
    it('property set for ActivePlot waits for pending value sets.', function (done) {
        makeAsync(done, async function () {
            const newValue = [[1, 4], [2, 3], [20, 54]];
            let error;
            graphViewModel.model.value = newValue;
            try {
                await graphViewModel.setGPropertyValueAsync(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME, 2);
            }
            catch (e) {
                error = e;
            }
            expect(error).toBeUndefined();
            expect(graphViewModel.model.activePlot).toEqual(2);
        });
    });
    it('property get for ActivePlot waits for pending ActivePlot property set.', function (done) {
        makeAsync(done, async function () {
            const newValue = [
                [1, 4, 4, 5],
                [2, 3, 4, 4],
                [20, 54, 5, 5],
                [12, 4, 21, 32, 12]
            ];
            let error;
            const newActivePlot = 2;
            let activePlot;
            graphViewModel.model.value = newValue;
            try {
                await graphViewModel.setGPropertyValueAsync(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME, newActivePlot);
                activePlot = graphViewModel.getGPropertyValue(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME);
            }
            catch (e) {
                error = e;
            }
            expect(error).toBeUndefined();
            expect(activePlot).toEqual(newActivePlot);
        });
    });
    // Tests for Plot reference property.
    it('property read for plot reference returns the reference of plot at index activePlot in childModels.', function (done) {
        makeAsync(done, async function () {
            await graphViewModel.setGPropertyValueAsync(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME, 1);
            expect(graphModel.activePlot).toEqual(1);
            const plotReference = graphViewModel.getGPropertyValue(GraphBaseModel.PLOT_G_PROPERTY_NAME);
            const plotChildModels = graphModel.childModels.filter(x => (x instanceof PlotModel));
            const plotReferenceAtActiveIndex = viModel.controlViewModels[plotChildModels[graphModel.activePlot].niControlId];
            expect(plotReference.model.niControlId).toEqual(plotReferenceAtActiveIndex.model.niControlId);
        });
    });
    it('property read for plot reference throws if activePlot is out of bounds for plot count.', function () {
        graphModel.activePlot = 12;
        const getGPropertyValue = function () {
            graphViewModel.getGPropertyValue(GraphBaseModel.PLOT_G_PROPERTY_NAME);
        };
        expect(getGPropertyValue).toThrowError();
    });
    it('property set for Plot throws.', function () {
        const setGPropertyValue = function () {
            graphViewModel.setGPropertyValue(GraphBaseModel.PLOT_G_PROPERTY_NAME);
        };
        expect(setGPropertyValue).toThrowError();
    });
    // Tests for Name Property on Plot reference.
    it('property set for Name on plot reference updates the label of plot model.', function (done) {
        makeAsync(done, async function () {
            const newLabel = 'newPlotName';
            await graphViewModel.setGPropertyValueAsync(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME, 1);
            expect(graphModel.activePlot).toEqual(1);
            const plotReference = graphViewModel.getGPropertyValue(GraphBaseModel.PLOT_G_PROPERTY_NAME);
            plotReference.setGPropertyValue(CartesianPlotModel.NAME_G_PROPERTY_NAME, newLabel);
            expect(plotReference.model.label).toEqual(newLabel);
        });
    });
    it('property set for Name on plot reference allows non ASCII character string values.', function (done) {
        const newLabel = 'Iñtërnâtiônàlizætiøn☃💩<!-- test comment -->';
        let plotReference;
        testHelpers.runMultipleAsync(done, function () {
            plotReference = graphViewModel.getGPropertyValue(GraphBaseModel.PLOT_G_PROPERTY_NAME);
            plotReference.setGPropertyValue(CartesianPlotModel.NAME_G_PROPERTY_NAME, newLabel);
        }, function () {
            expect(plotReference.element.label).toEqual(newLabel);
        });
    });
    it('property set for Name on plot reference updates the label of plot element.', function (done) {
        const newLabel = 'newPlotName';
        let plotReference;
        testHelpers.runMultipleAsync(done, function () {
            plotReference = graphViewModel.getGPropertyValue(GraphBaseModel.PLOT_G_PROPERTY_NAME);
            plotReference.setGPropertyValue(CartesianPlotModel.NAME_G_PROPERTY_NAME, newLabel);
        }, function () {
            expect(plotReference.element.label).toEqual(newLabel);
        });
    });
    it('property set for Name on plot allows empty string.', function (done) {
        const newLabel = '';
        let plotReference;
        testHelpers.runMultipleAsync(done, function () {
            plotReference = graphViewModel.getGPropertyValue(GraphBaseModel.PLOT_G_PROPERTY_NAME);
            plotReference.setGPropertyValue(CartesianPlotModel.NAME_G_PROPERTY_NAME, newLabel);
        }, function () {
            expect(plotReference.element.label).toEqual(newLabel);
        });
    });
    it('property set for Name on plot allows duplicate plot label.', function (done) {
        makeAsync(done, async function () {
            const plots = graphViewModel.element.querySelectorAll('ni-cartesian-plot');
            const plot1Label = plots[0].label;
            await graphViewModel.setGPropertyValueAsync(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME, 1);
            const plot2Reference = graphViewModel.getGPropertyValue(GraphBaseModel.PLOT_G_PROPERTY_NAME);
            plot2Reference.setGPropertyValue(CartesianPlotModel.NAME_G_PROPERTY_NAME, plot1Label);
            await testHelpers.waitAsync();
            expect(plot2Reference.element.label).toEqual(plot1Label);
        });
    });
    it('property get for Name on plot reference returns the label of plot element.', function (done) {
        makeAsync(done, async function () {
            await graphViewModel.setGPropertyValueAsync(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME, 1);
            expect(graphModel.activePlot).toEqual(1);
            const plotReference = graphViewModel.getGPropertyValue(GraphBaseModel.PLOT_G_PROPERTY_NAME);
            const label = await plotReference.getGPropertyValue(CartesianPlotModel.NAME_G_PROPERTY_NAME);
            expect(plotReference.element.label).toEqual(label);
        });
    });
    it('property get for Name on plot reference returns the label of plot element set via waveform metadata.', function (done) {
        makeAsync(done, async function () {
            const waveformChannelName = "Channel 0";
            graphModel.niType = new NIType({
                name: NITypeNames.ANALOGWAVEFORM,
                subtype: NITypeNames.DOUBLE
            }).toJSON();
            graphModel.value = new NIAnalogWaveform({
                Y: [3, 15, 24],
                dt: 1,
                channelName: waveformChannelName
            });
            const plotReference = graphViewModel.getGPropertyValue(GraphBaseModel.PLOT_G_PROPERTY_NAME);
            const plotName = await plotReference.getGPropertyValue(CartesianPlotModel.NAME_G_PROPERTY_NAME);
            expect(plotName).toEqual(waveformChannelName);
        });
    });
    // Tests for LineWidth property on plotReference
    it('property get for LineWidth on plot reference returns the current value.', function (done) {
        makeAsync(done, async function () {
            const plotRendererModel = plot1ViewModel.model.childModels[0];
            const currentLineWidth = plotRendererModel.lineWidth;
            const actualLineWidth = await plot1ViewModel.getGPropertyValue(CartesianPlotModel.LINE_WIDTH_G_PROPERTY_NAME);
            expect(actualLineWidth).toEqual(currentLineWidth);
        });
    });
    it('property set for LineWidth on plot reference updates the plot renderer model.', function () {
        const newLineWidth = 3;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.LINE_WIDTH_G_PROPERTY_NAME, newLineWidth);
        const currentLineWidth = plotRenderer1Model.lineWidth;
        expect(currentLineWidth).toEqual(newLineWidth);
    });
    it('property set for LineWidth on plot reference updates the plot renderer element.', function (done) {
        const newLineWidth = 2;
        testHelpers.runMultipleAsync(done, function () {
            plot1ViewModel.setGPropertyValue(CartesianPlotModel.LINE_WIDTH_G_PROPERTY_NAME, newLineWidth);
        }, function () {
            expect(plotRenderer1ViewModel.element.lineWidth).toEqual(newLineWidth);
        });
    });
    it('property set for LineWidth on plot reference clamps the value to max if given value is greater then max line width.', function () {
        const newLineWidth = 13;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.LINE_WIDTH_G_PROPERTY_NAME, newLineWidth);
        const currentLineWidth = plotRenderer1Model.lineWidth;
        const maxLineWidth = PlotRendererModel.MAX_LINE_WIDTH;
        expect(currentLineWidth).toEqual(maxLineWidth);
    });
    it('property set for LineWidth on plot reference clamps the value to min if given value is less then min line width.', function () {
        const newLineWidth = -13;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.LINE_WIDTH_G_PROPERTY_NAME, newLineWidth);
        const currentLineWidth = plotRenderer1Model.lineWidth;
        const minLineWidth = PlotRendererModel.MIN_LINE_WIDTH;
        expect(currentLineWidth).toEqual(minLineWidth);
    });
    it('property set for LineWidth on plot reference accepts a non integer value.', function () {
        const newLineWidth = 3.5;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.LINE_WIDTH_G_PROPERTY_NAME, newLineWidth);
        const currentLineWidth = plotRenderer1Model.lineWidth;
        expect(currentLineWidth).toEqual(newLineWidth);
    });
    // Tests for LineStyle Property on plot reference
    it('property get for LineStyle on plot reference returns the current model value of LineStyle.', function (done) {
        makeAsync(done, async function () {
            const lineStyleOptions = PlotRendererModel.LINE_STYLE_OPTIONS;
            const plotRendererModel = plot1ViewModel.model.childModels[0];
            const currentLineStyle = plotRendererModel.lineStyle;
            const lineStyleIndex = await plot1ViewModel.getGPropertyValue(CartesianPlotModel.LINE_STYLE_G_PROPERTY_NAME);
            expect(lineStyleOptions[lineStyleIndex]).toEqual(currentLineStyle);
        });
    });
    it('property set for LineStyle on plot reference updates the plot renderer model.', function () {
        const newStyleIndex = 3;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.LINE_STYLE_G_PROPERTY_NAME, newStyleIndex);
        const lineStyleOptions = PlotRendererModel.LINE_STYLE_OPTIONS;
        expect(plotRenderer1Model.lineStyle).toEqual(lineStyleOptions[newStyleIndex]);
    });
    it('property set for LineStyle on plot reference updates the plot renderer element.', function (done) {
        const newStyleIndex = 2;
        testHelpers.runMultipleAsync(done, function () {
            plot1ViewModel.setGPropertyValue(CartesianPlotModel.LINE_STYLE_G_PROPERTY_NAME, newStyleIndex);
        }, function () {
            const lineStyleOptions = PlotRendererModel.LINE_STYLE_OPTIONS;
            expect(plotRenderer1ViewModel.element.lineStyle).toEqual(lineStyleOptions[newStyleIndex]);
        });
    });
    it('property set for LineStyle on plot reference clamps to 0 if given value is less than 0.', function () {
        const newStyleIndex = -3;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.LINE_STYLE_G_PROPERTY_NAME, newStyleIndex);
        const lineStyleOptions = PlotRendererModel.LINE_STYLE_OPTIONS;
        expect(plotRenderer1Model.lineStyle).toEqual(lineStyleOptions[0]);
    });
    it('property set for LineStyle on plot reference clamps the given value to max if greater than max.', function () {
        const newStyleIndex = 13;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.LINE_STYLE_G_PROPERTY_NAME, newStyleIndex);
        const lineStyleOptions = PlotRendererModel.LINE_STYLE_OPTIONS;
        expect(plotRenderer1Model.lineStyle).toEqual(lineStyleOptions[lineStyleOptions.length - 1]);
    });
    // Tests for FillStyle Property on plot reference
    it('property get for FillStyle on plot reference returns the current model value.', function (done) {
        makeAsync(done, async function () {
            const fillStyleOptions = PlotRendererModel.FILL_STYLE_OPTIONS;
            const plotRendererModel = plot1ViewModel.model.childModels[0];
            const currentFillStyle = plotRendererModel.areaBaseLine;
            const fillStyleIndex = await plot1ViewModel.getGPropertyValue(CartesianPlotModel.FILL_STYLE_G_PROPERTY_NAME);
            expect(fillStyleOptions[fillStyleIndex]).toEqual(currentFillStyle);
        });
    });
    it('property set for FillStyle on plot reference updates the plot renderer model.', function () {
        const newStyleIndex = 1;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.FILL_STYLE_G_PROPERTY_NAME, newStyleIndex);
        const fillStyleOptions = PlotRendererModel.FILL_STYLE_OPTIONS;
        expect(plotRenderer1Model.areaBaseLine).toEqual(fillStyleOptions[newStyleIndex]);
    });
    it('property set for FillStyle on plot reference updates the plot renderer element.', function (done) {
        const newStyleIndex = 2;
        testHelpers.runMultipleAsync(done, function () {
            plot1ViewModel.setGPropertyValue(CartesianPlotModel.FILL_STYLE_G_PROPERTY_NAME, newStyleIndex);
        }, function () {
            const fillStyleOptions = PlotRendererModel.FILL_STYLE_OPTIONS;
            expect(plotRenderer1ViewModel.element.areaBaseLine).toEqual(fillStyleOptions[newStyleIndex]);
        });
    });
    it('property set for FillStyle on plot reference clamps to 1 if given value is less than 1.', function () {
        const newStyleIndex = -1;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.FILL_STYLE_G_PROPERTY_NAME, newStyleIndex);
        const fillStyleOptions = PlotRendererModel.FILL_STYLE_OPTIONS;
        expect(plotRenderer1Model.areaBaseLine).toEqual(fillStyleOptions[1]);
    });
    it('property set for FillStyle on plot reference clamps the given value to max if greater than max.', function () {
        const newStyleIndex = 11;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.FILL_STYLE_G_PROPERTY_NAME, newStyleIndex);
        const fillStyleOptions = PlotRendererModel.FILL_STYLE_OPTIONS;
        expect(plotRenderer1Model.areaBaseLine).toEqual(fillStyleOptions[fillStyleOptions.length - 1]);
    });
    // Tests for PointShape Property on plot reference
    it('property get for PointShape on plot reference returns the current model value.', function (done) {
        makeAsync(done, async function () {
            const pointStyleOptions = PlotRendererModel.POINT_SHAPE_OPTIONS;
            const plotRendererModel = plot1ViewModel.model.childModels[0];
            const currentPointShape = plotRendererModel.pointShape;
            const pointShapeIndex = await plot1ViewModel.getGPropertyValue(CartesianPlotModel.POINT_SHAPE_G_PROPERTY_NAME);
            expect(pointStyleOptions[pointShapeIndex]).toEqual(currentPointShape);
        });
    });
    it('property set for PointShape on plot reference updates the plot renderer model.', function () {
        const newPointShapeIndex = 3;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.POINT_SHAPE_G_PROPERTY_NAME, newPointShapeIndex);
        const pointStyleOptions = PlotRendererModel.POINT_SHAPE_OPTIONS;
        expect(plotRenderer1Model.pointShape).toEqual(pointStyleOptions[newPointShapeIndex]);
    });
    it('property set for PointShape on plot reference updates the plot renderer element.', function (done) {
        const newPointShapeIndex = 2;
        testHelpers.runMultipleAsync(done, function () {
            plot1ViewModel.setGPropertyValue(CartesianPlotModel.POINT_SHAPE_G_PROPERTY_NAME, newPointShapeIndex);
        }, function () {
            const pointStyleOptions = PlotRendererModel.POINT_SHAPE_OPTIONS;
            expect(plotRenderer1ViewModel.element.pointShape).toEqual(pointStyleOptions[newPointShapeIndex]);
        });
    });
    it('property set for PointShape on plot reference updates the plot renderer element and does not enable the point visibility if it is already not visible.', function (done) {
        const newPointShapeIndex = 2;
        let plotconfig, pointVisibilityBeforeSettingPointShape;
        testHelpers.runMultipleAsync(done, function () {
            // pointColor set to empty string causes points to be invisible, so setting it to empty string make sure that points are not visible.
            plotRenderer1Model.pointColor = '';
        }, function () {
            plotconfig = plot1ViewModel.element.getViewConfig();
            pointVisibilityBeforeSettingPointShape = plotconfig.points.show;
            plot1ViewModel.setGPropertyValue(CartesianPlotModel.POINT_SHAPE_G_PROPERTY_NAME, newPointShapeIndex);
        }, function () {
            const pointStyleOptions = PlotRendererModel.POINT_SHAPE_OPTIONS;
            expect(plotRenderer1ViewModel.element.pointShape).toEqual(pointStyleOptions[newPointShapeIndex]);
            plotconfig = plot1ViewModel.element.getViewConfig();
            expect(plotconfig.points.show).toEqual(pointVisibilityBeforeSettingPointShape);
        });
    });
    it('property set for PointShape on plot reference clamps to 0 if given value is less than 0.', function () {
        const newPointShapeIndex = -3;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.POINT_SHAPE_G_PROPERTY_NAME, newPointShapeIndex);
        const pointStyleOptions = PlotRendererModel.POINT_SHAPE_OPTIONS;
        expect(plotRenderer1Model.pointShape).toEqual(pointStyleOptions[0]);
    });
    it('property set for PointShape on plot reference clamps the given value to max if greater than max.', function () {
        const newPointShapeIndex = 23;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.POINT_SHAPE_G_PROPERTY_NAME, newPointShapeIndex);
        const pointStyleOptions = PlotRendererModel.POINT_SHAPE_OPTIONS;
        expect(plotRenderer1Model.pointShape).toEqual(pointStyleOptions[pointStyleOptions.length - 1]);
    });
    // Tests for barWidth property on plotReference.
    it('property get for BarWidth on the plot reference returns the current plot renderer model value.', function (done) {
        makeAsync(done, async function () {
            const currentBarWidth = await plot1ViewModel.getGPropertyValue(CartesianPlotModel.BAR_WIDTH_G_PROPERTY_NAME);
            expect(currentBarWidth).toEqual(plotRenderer1Model.barWidth);
        });
    });
    it('property set for BarWidth on plot reference updates the model.', function () {
        const newBarWidth = 23;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.BAR_WIDTH_G_PROPERTY_NAME, newBarWidth);
        expect(plotRenderer1Model.barWidth).toEqual(newBarWidth);
    });
    it('property set for BarWidth on plot reference updates the element.', function (done) {
        const newBarWidth = 3;
        testHelpers.runMultipleAsync(done, function () {
            plot1ViewModel.setGPropertyValue(CartesianPlotModel.BAR_WIDTH_G_PROPERTY_NAME, newBarWidth);
        }, function () {
            expect(plotRenderer1ViewModel.element.barWidth).toEqual(newBarWidth);
        });
    });
    it('property set for BarWidth clamps the value to 0 if less then 0.', function () {
        const newBarWidth = -23;
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.BAR_WIDTH_G_PROPERTY_NAME, newBarWidth);
        expect(plotRenderer1Model.barWidth).toEqual(0);
    });
    // Tests for Color property on PlotReference.
    it('property get for Color returns the current renderer model line-stroke value in integer format', function (done) {
        makeAsync(done, async function () {
            const currentColor = await plot1ViewModel.getGPropertyValue(CartesianPlotModel.COLOR_G_PROPERTY_NAME);
            expect(ColorHelpers.integerToRGBA(currentColor)).toEqual(plotRenderer1Model.lineStroke);
        });
    });
    it('property set for Color updates the renderer model.', function () {
        const argbInt = 0x91EE1C25;
        const expectedColor = 'rgba(238,28,37,0.57)';
        plot1ViewModel.setGPropertyValue(CartesianPlotModel.COLOR_G_PROPERTY_NAME, argbInt);
        expect(plotRenderer1Model.lineStroke).toEqual(expectedColor);
    });
    it('property set for Color updates the renderer element, for a dynamically created plot', function (done) {
        makeAsync(done, async function () {
            const newValue = [[1, 4], [2, 3], [20, 54]];
            graphViewModel.model.value = newValue;
            await testHelpers.waitAsync();
            await graphViewModel.setGPropertyValueAsync(GraphBaseModel.ACTIVE_PLOT_G_PROPERTY_NAME, 2);
            const argbInt = 0x91EE1C25;
            const expectedColor = 'rgba(238,28,37,0.57)';
            const plotReference = graphViewModel.getGPropertyValue(GraphBaseModel.PLOT_G_PROPERTY_NAME);
            plotReference.setGPropertyValue(CartesianPlotModel.COLOR_G_PROPERTY_NAME, argbInt);
            await testHelpers.waitAsync();
            const plotRenderer3 = graphViewModel.element.querySelectorAll('ni-cartesian-plot-renderer')[2];
            expect(plotRenderer3).toBeDefined();
            expect(plotRenderer3.lineStroke).toEqual(expectedColor);
        });
    });
    it('property set for Color updates the renderer element.', function (done) {
        const argbInt = 0xFFEE1C25;
        const expectedColor = 'rgba(238,28,37,1)';
        testHelpers.runMultipleAsync(done, function () {
            plot1ViewModel.setGPropertyValue(CartesianPlotModel.COLOR_G_PROPERTY_NAME, argbInt);
        }, function () {
            expect(plotRenderer1ViewModel.element.lineStroke).toEqual(expectedColor);
        });
    });
    // Tests for Plot visible property.
    it('property get for Plot visible returns the current value.', function (done) {
        makeAsync(done, async function () {
            const isPlotVisible = await plot1ViewModel.getGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME);
            expect(isPlotVisible).toEqual(plot1ViewModel.model.show);
        });
    });
    it('property set for Plot visible updates the model.', function () {
        plot1ViewModel.setGPropertyValue(VisualModel.VISIBLE_G_PROPERTY_NAME, false);
        expect(plot1ViewModel.model.show).toEqual(false);
    });
});
//# sourceMappingURL=niCartesianGraphPlotProperties.Test.js.map