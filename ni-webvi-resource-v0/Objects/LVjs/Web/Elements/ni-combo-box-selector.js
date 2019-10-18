//****************************************
// ComboBox Selector
//****************************************
import { NIElementRegistrationService } from '../Framework/niElementRegistrationService.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { Visual } from './ni-visual.js';
import { VisualComponent } from './ni-visual-component.js';
const updateItemsArray = function (element) {
    element._itemsArray = JSON.parse(element.items);
};
const getSelectedItemIndex = function (element) {
    return element._itemsArray.map(function (item) { return item.displayValue; }).indexOf(element.value);
};
const addUnlabeledValue = function (element, dropdownElement) {
    const newItem = { value: element.value, displayValue: element.value };
    if (element._hasUnlabeledValue) {
        element._itemsArray.pop();
        element._hasUnlabeledValue = false;
    }
    element._itemsArray.push(newItem);
    const selectedIndex = element._itemsArray.length - 1;
    element.items = JSON.stringify(element._itemsArray);
    dropdownElement.dataSource = createDataSourceForJQXComboBox(element._itemsArray);
    dropdownElement.selectedIndexes = [selectedIndex];
    element._hasUnlabeledValue = true;
};
const removeUnlabeledValue = function (element, dropdownElement) {
    if (element._itemsArray.length === 0) {
        return;
    }
    if (element._hasUnlabeledValue) {
        element._itemsArray.pop();
        element._hasUnlabeledValue = false;
    }
    element.items = JSON.stringify(element._itemsArray);
    const selectedIndex = getSelectedItemIndex(element);
    dropdownElement.dataSource = createDataSourceForJQXComboBox(element._itemsArray);
    dropdownElement.selectedIndexes = [selectedIndex];
};
const createDataSourceForJQXComboBox = function (itemsArray) {
    const source = [];
    itemsArray.forEach(function (item) {
        source.push(item.displayValue);
    });
    return source;
};
const resetAllDisabledItems = function (comboBoxChildItems) {
    if (comboBoxChildItems === undefined) {
        return;
    }
    comboBoxChildItems.forEach(function (item) {
        item.disabled = false;
    });
};
const setDisabledIndexes = function (comboBoxElement, element) {
    const childItems = comboBoxElement.items;
    const disabledIndexesArray = JSON.parse(element.disabledIndexes);
    resetAllDisabledItems(childItems);
    disabledIndexesArray.forEach(function (disabledIndex) {
        if (disabledIndex < childItems.length && disabledIndex >= 0) {
            childItems[disabledIndex].disabled = true;
        }
    });
};
export class ComboBoxSelector extends Visual {
    createdCallback() {
        super.createdCallback();
        this._itemsArray = [];
        this._hasUnlabeledValue = false;
        this._jqxComboBoxElement = undefined;
        // Prevent internal JQX change events from bubbling up out of the control
        this.addEventListener('change', function (event) {
            event.stopImmediatePropagation();
        });
    }
    addAllProperties(targetPrototype) {
        super.addAllProperties(targetPrototype);
        const proto = ComboBoxSelector.prototype;
        proto.addProperty(targetPrototype, {
            propertyName: 'value',
            defaultValue: '',
            fireEvent: true,
            addNonSignalingProperty: true
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'items',
            defaultValue: '[]'
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'popupEnabled',
            defaultValue: false
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'allowUnlabeled',
            defaultValue: false
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'disabledIndexes',
            defaultValue: '[]'
        });
        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'value', 'value', 'valueNonSignaling', 'value-changed');
    }
    focus(...args) {
        return this._jqxComboBoxElement.focus(...args);
    }
    attachedCallback() {
        const firstCall = super.attachedCallback();
        const that = this;
        if (firstCall === true) {
            updateItemsArray(that);
            const comboBoxElement = document.createElement('jqx-combo-box');
            this._jqxComboBoxElement = comboBoxElement;
            that.appendChild(comboBoxElement);
            comboBoxElement.setAttribute('value', that.value);
            comboBoxElement.disabled = that.disabled;
            const source = createDataSourceForJQXComboBox(this._itemsArray);
            comboBoxElement.setAttribute('selection-mode', 'one');
            comboBoxElement.setAttribute('data-source', JSON.stringify(source));
            comboBoxElement.setAttribute('drop-down-height', 'auto');
            comboBoxElement.setAttribute('drop-down-open-mode', that.popupEnabled ? 'default' : 'none');
            if (that.popupEnabled) {
                comboBoxElement.setAttribute('auto-open-shortcut-key', '["ArrowDown","ArrowUp"]');
                comboBoxElement.setAttribute('esc-key-mode', 'clearValue');
            }
            comboBoxElement.addEventListener('change', function (event) {
                const args = event.detail;
                that.value = args.value;
            });
        }
    }
    propertyUpdated(propertyName) {
        super.propertyUpdated(propertyName);
        const comboBoxElement = this._jqxComboBoxElement;
        switch (propertyName) {
            case 'items':
                updateItemsArray(this);
                setDisabledIndexes(comboBoxElement, this);
                comboBoxElement.dataSource = createDataSourceForJQXComboBox(this._itemsArray);
                break;
            case 'readOnly':
                comboBoxElement.readonly = this.readOnly;
                break;
            case 'value':
                if (getSelectedItemIndex(this) === -1) {
                    addUnlabeledValue(this, comboBoxElement);
                }
                else {
                    removeUnlabeledValue(this, comboBoxElement);
                }
                comboBoxElement.value = this.value;
                setDisabledIndexes(comboBoxElement, this);
                break;
            case 'disabledIndexes':
                setDisabledIndexes(comboBoxElement, this);
                break;
            case 'disabled':
                comboBoxElement.disabled = this.disabled;
                break;
            default:
                break;
        }
    }
}
NIElementRegistrationService.registerElement(ComboBoxSelector);
VisualComponent.defineElementInfo(ComboBoxSelector.prototype, 'ni-combo-box-selector', 'HTMLNIComboBoxSelector');
//# sourceMappingURL=ni-combo-box-selector.js.map