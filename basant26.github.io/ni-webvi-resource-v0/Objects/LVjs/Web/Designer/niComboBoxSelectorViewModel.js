//****************************************
// ComboBox View Model
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { ComboBoxSelector } from '../Elements/ni-combo-box-selector.js';
import { ComboBoxSelectorModel } from '../Modeling/niComboBoxSelectorModel.js';
import { LabVIEWPropertyError } from '../Framework/LabVIEWPropertyError.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { TextAlignmentValueConverter as TEXTALIGN_VAL_CONVERTER } from '../Framework/ValueConverters/niTextAlignmentValueConverter.js';
import { VisualModel } from '../Modeling/niVisualModel.js';
import { VisualViewModel } from './niVisualViewModel.js';
const validateSelectors = function (displayValuesAndValuesMap) {
    const displayValues = [];
    const values = [];
    // Both Value and displayValue can't be empty.
    // Duplicate Value and displayValue are not allowed.
    for (let i = 0; i < displayValuesAndValuesMap.length; i++) {
        displayValues[i] = displayValuesAndValuesMap[i].displayValue;
        values[i] = displayValuesAndValuesMap[i].value;
        if (values[i] === '' && displayValues[i] === '') {
            throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_EMPTY_DISPLAY_VALUE_AND_VALUE'), ComboBoxSelectorViewModel.DISPLAY_VALUES_AND_VALUES_MUST_NOT_BE_EMPTY_ERROR_CODE);
        }
    }
    if (displayValues.length !== new Set(displayValues).size) {
        throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_DUPLICATE_DISPLAY_VALUE'), ComboBoxSelectorViewModel.DUPLICATE_DISPLAY_VALUES_NOT_ALLOWED_ERROR_CODE);
    }
    if (values.length !== new Set(values).size) {
        throw new LabVIEWPropertyError(NI_SUPPORT.i18n('msg_DUPLICATE_VALUE'), ComboBoxSelectorViewModel.DUPLICATE_VALUES_NOT_ALLOWED_ERROR_CODE);
    }
};
export class ComboBoxSelectorViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('popupEnabled');
        this.registerAutoSyncProperty('value');
        this.registerAutoSyncProperty('allowUnlabeled');
    }
    static get DISPLAY_VALUES_AND_VALUES_MUST_NOT_BE_EMPTY_ERROR_CODE() {
        return 363542;
    }
    static get DUPLICATE_VALUES_NOT_ALLOWED_ERROR_CODE() {
        return 363543;
    }
    static get DUPLICATE_DISPLAY_VALUES_NOT_ALLOWED_ERROR_CODE() {
        return 363544;
    }
    bindToView() {
        super.bindToView();
        const that = this;
        this.bindFocusEventListener();
        this.element.addEventListener('value-changed', function (evt) {
            if (that.element === evt.target) {
                that.model.controlChanged(evt.detail.value);
            }
        });
    }
    modelPropertyChanged(propertyName) {
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'items':
                renderBuffer.properties.items = JSON.stringify(this.model.items);
                break;
            case 'textAlignment':
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = this.model.textAlignment;
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX] = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
                break;
            case 'disabledIndexes':
                renderBuffer.properties.disabledIndexes = JSON.stringify(this.model.disabledIndexes);
                break;
        }
        return renderBuffer;
    }
    updateModelFromElement() {
        super.updateModelFromElement();
        const element = this.element;
        const model = this.model;
        model.items = JSON.parse(element.items);
        model.disabledIndexes = JSON.parse(element.disabledIndexes);
        model.textAlignment = window.getComputedStyle(element).getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
    }
    applyModelToElement() {
        super.applyModelToElement();
        const element = this.element;
        const model = this.model;
        element.items = JSON.stringify(model.items);
        element.disabledIndexes = JSON.stringify(model.disabledIndexes);
        const justifyContent = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX, justifyContent);
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
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
            case ComboBoxSelectorModel.ITEMS_G_PROPERTY_NAME:
                {
                    const displayValuesAndValuesMapForModel = gPropertyValue.map((displayValues) => ({
                        displayValue: displayValues,
                        value: displayValues
                    }));
                    validateSelectors(displayValuesAndValuesMapForModel);
                    model.items = displayValuesAndValuesMapForModel;
                    break;
                }
            case ComboBoxSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME:
                model.disabledIndexes = gPropertyValue;
                break;
            case ComboBoxSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME:
                {
                    const displayValuesAndValuesMapForModel = gPropertyValue.map((item) => {
                        const valueAndDisplayValue = {};
                        valueAndDisplayValue.displayValue = item.String;
                        valueAndDisplayValue.value = item.Value;
                        return valueAndDisplayValue;
                    });
                    validateSelectors(displayValuesAndValuesMapForModel);
                    model.items = displayValuesAndValuesMapForModel;
                    break;
                }
            default:
                super.setGPropertyValue(gPropertyName, gPropertyValue);
        }
    }
    getGPropertyValue(gPropertyName) {
        const model = this.model;
        switch (gPropertyName) {
            case VisualModel.VALUE_G_PROPERTY_NAME:
                return model.value;
            case ComboBoxSelectorModel.ITEMS_AND_VALUES_G_PROPERTY_NAME:
                return model.items.map((item) => ({
                    String: item.displayValue,
                    Value: item.value
                }));
            case ComboBoxSelectorModel.ITEMS_G_PROPERTY_NAME:
                return model.items.map(x => x.displayValue);
            case ComboBoxSelectorModel.DISABLED_INDEXES_G_PROPERTY_NAME:
                return model.disabledIndexes;
            default:
                return super.getGPropertyValue(gPropertyName);
        }
    }
}
NIModelProvider.registerViewModel(ComboBoxSelectorViewModel, ComboBoxSelector, ComboBoxSelectorModel);
//# sourceMappingURL=niComboBoxSelectorViewModel.js.map