//****************************************
// Color Control Model
// National Instruments Copyright 2019
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from './niVisualModel.js';
const NITypes = window.NITypes;
export class ColorBoxModel extends VisualModel {
    constructor(id) {
        super(id);
        this.niType = NITypes.UINT32;
        // This value matches with Color Box default value in HtmlPanelPalette.xml.
        this._value = 4278190080;
    }
    static get MODEL_KIND() {
        return 'niColorBox';
    }
    static get BRUSH_NAME() {
        return 'Brush';
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.notifyModelPropertyChanged('value');
    }
    modelPropertyUsesNIType(propertyName) {
        return propertyName === 'value';
    }
    controlChanged(newValue) {
        const oldValue = this.value;
        this.value = newValue;
        super.controlChanged('value', this.value, oldValue);
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case ColorBoxModel.BRUSH_NAME:
                return NITypes.UINT32;
        }
        return super.gPropertyNIType(gPropertyName);
    }
}
NIModelProvider.registerModel(ColorBoxModel);
//# sourceMappingURL=niColorBoxModel.js.map