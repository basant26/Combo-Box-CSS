//****************************************
// Cursor Model
// National Instruments Copyright 2014
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from './niVisualModel.js';
export class CursorModel extends VisualModel {
    constructor(id) {
        super(id);
        this._show = true;
        this._showLabel = true;
        this._showValue = true;
        this._color = 'black';
        this._targetShape = 'ellipse';
        this._label = '';
        this._snapToPlot = '';
        this._xaxis = '';
        this._yaxis = '';
        this._crosshairStyle = 'both';
    }
    static get NAME_G_PROPERTY_NAME() {
        return "Name";
    }
    static get X_POSITION_G_PROPERTY_NAME() {
        return "XPosition";
    }
    static get Y_POSITION_G_PROPERTY_NAME() {
        return "YPosition";
    }
    static get MODEL_KIND() {
        return 'niCursor';
    }
    get show() {
        return this._show;
    }
    set show(value) {
        this._show = value;
        this.notifyModelPropertyChanged('show');
    }
    get showLabel() {
        return this._showLabel;
    }
    set showLabel(value) {
        this._showLabel = value;
        this.notifyModelPropertyChanged('showLabel');
    }
    get showValue() {
        return this._showValue;
    }
    set showValue(value) {
        this._showValue = value;
        this.notifyModelPropertyChanged('showValue');
    }
    get color() {
        return this._color;
    }
    set color(value) {
        this._color = value;
        this.notifyModelPropertyChanged('color');
    }
    get targetShape() {
        return this._targetShape;
    }
    set targetShape(value) {
        this._targetShape = value;
        this.notifyModelPropertyChanged('targetShape');
    }
    get label() {
        return this._label;
    }
    set label(value) {
        this._label = value;
        this.notifyModelPropertyChanged('label');
    }
    get snapToPlot() {
        return this._snapToPlot;
    }
    set snapToPlot(value) {
        this._snapToPlot = value;
        this.notifyModelPropertyChanged('snapToPlot');
    }
    get xaxis() {
        return this._xaxis;
    }
    set xaxis(value) {
        this._xaxis = value;
        this.notifyModelPropertyChanged('xaxis');
    }
    get yaxis() {
        return this._yaxis;
    }
    set yaxis(value) {
        this._yaxis = value;
        this.notifyModelPropertyChanged('yaxis');
    }
    get crosshairStyle() {
        return this._crosshairStyle;
    }
    set crosshairStyle(value) {
        this._crosshairStyle = value;
        this.notifyModelPropertyChanged('crosshairStyle');
    }
}
NIModelProvider.registerModel(CursorModel);
//# sourceMappingURL=niCursorModel.js.map