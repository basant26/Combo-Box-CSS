//****************************************
// Color Box Control View Model
// National Instruments Copyright 2019
//****************************************
import { ColorBoxModel } from '../Modeling/niColorBoxModel.js';
import { ColorBoxValueConverter } from '../Framework/ValueConverters/niColorBoxValueConverter.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from './../Modeling/niVisualModel.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class ColorBoxViewModel extends VisualViewModel {
    bindToView() {
        super.bindToView();
        const that = this;
        that.element.addEventListener('change', function (evt) {
            const newValue = ColorBoxValueConverter.convertBack(evt.detail.value);
            if (that.model.value !== newValue) {
                that.model.controlChanged(newValue);
            }
        });
    }
    getReadOnlyPropertyName() {
        return 'readonly';
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'value':
                renderBuffer.properties.value = ColorBoxValueConverter.convert(this.model.value);
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        this.model.value = ColorBoxValueConverter.convertBack(this.element.value);
        this.model.defaultValue = this.model.value;
    }
    applyModelToElement() {
        super.applyModelToElement();
        this.element.value = ColorBoxValueConverter.convert(this.model.value);
        this.element.enableCustomColors = true;
        this.element.editAlphaChannel = true;
        this.element.valueDisplayMode = "colorBox";
        this.element.dropDownOpenMode = 'none';
        this.element.displayMode = 'grid';
        this.element.palette = 'custom';
    }
    setGPropertyValue(gPropertyName, gPropertyValue) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                model.value = gPropertyValue;
                break;
            case VisualModel.VALUE_SIGNALING_G_PROPERTY_NAME:
                model.controlChanged(gPropertyValue);
                break;
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                return this.model.value;
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(ColorBoxViewModel, undefined, ColorBoxModel, 'jqx-color-picker');
//# sourceMappingURL=niColorBoxViewModel.js.map