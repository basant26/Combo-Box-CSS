//****************************************
// ComboBox Model
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualModel } from './niVisualModel.js';
const NITypes = window.NITypes;
export class ComboBoxSelectorModel extends VisualModel {
    constructor(id) {
        super(id);
        this._allowUnlabeled = true;
        this._textAlignment = 'left';
        this.niType = NITypes.STRING;
        this._value = '';
        this._items = [];
        this._popupEnabled = false;
        this._disabledIndexes = [];
    }
    static get MODEL_KIND() {
        return 'niComboBox';
    }
    static get DISABLED_INDEXES_G_PROPERTY_NAME() {
        return 'DisabledIndexes';
    }
    static get ITEMS_G_PROPERTY_NAME() {
        return 'Items';
    }
    static get ITEMS_AND_VALUES_G_PROPERTY_NAME() {
        return 'ItemsAndValues';
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.notifyModelPropertyChanged('value');
    }
    get items() {
        return this._items;
    }
    set items(value) {
        this._items = value;
        this.notifyModelPropertyChanged('items');
    }
    get popupEnabled() {
        return this._popupEnabled;
    }
    set popupEnabled(value) {
        this._popupEnabled = value;
        this.notifyModelPropertyChanged('popupEnabled');
    }
    get allowUnlabeled() {
        return this._allowUnlabeled;
    }
    set allowUnlabeled(value) {
        this._allowUnlabeled = value;
        this.notifyModelPropertyChanged('allowUnlabeled');
    }
    get textAlignment() {
        return this._textAlignment;
    }
    set textAlignment(value) {
        this._textAlignment = value;
        this.notifyModelPropertyChanged('textAlignment');
    }
    get disabledIndexes() {
        return this._disabledIndexes;
    }
    set disabledIndexes(value) {
        this._disabledIndexes = value;
        this.notifyModelPropertyChanged('disabledIndexes');
    }
    modelPropertyUsesNIType(propertyName) {
        return propertyName === 'value';
    }
    controlChanged(newValue) {
        const oldValue = this.value;
        this.value = newValue;
        super.controlChanged('value', newValue, oldValue);
    }
}
NIModelProvider.registerModel(ComboBoxSelectorModel);
//# sourceMappingURL=niComboBoxSelectorModel.js.map