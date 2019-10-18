//****************************************
// Url Image Model
// National Instruments Copyright 2014
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { StretchEnum as STRETCH_ENUM } from '../Elements/ni-url-image.js';
import { VisualModel } from './niVisualModel.js';
const NITypes = window.NITypes;
export class UrlImageModel extends VisualModel {
    constructor(id) {
        super(id);
        this.niType = NITypes.STRING;
        this._source = '';
        this._alternate = '';
        this._href = '';
        this._target = '';
        this._stretch = STRETCH_ENUM.UNIFORM;
    }
    static get MODEL_KIND() {
        return 'niUrlImage';
    }
    static get HYPERLINK_URL_G_PROPERTY_NAME() {
        return "HyperlinkUrl";
    }
    get source() {
        return this._source;
    }
    set source(value) {
        this._source = value;
        this.notifyModelPropertyChanged('source');
    }
    get alternate() {
        return this._alternate;
    }
    set alternate(value) {
        this._alternate = value;
        this.notifyModelPropertyChanged('alternate');
    }
    get href() {
        return this._href;
    }
    set href(value) {
        this._href = value;
        this.notifyModelPropertyChanged('href');
    }
    get target() {
        return this._target;
    }
    set target(value) {
        this._target = value;
        this.notifyModelPropertyChanged('target');
    }
    get stretch() {
        return this._stretch;
    }
    set stretch(value) {
        this._stretch = value;
        this.notifyModelPropertyChanged('stretch');
    }
    modelPropertyUsesNIType(propertyName) {
        return propertyName === 'source';
    }
    gPropertyNIType(gPropertyName) {
        switch (gPropertyName) {
            case UrlImageModel.HYPERLINK_URL_G_PROPERTY_NAME:
                return NITypes.STRING;
        }
        return undefined;
    }
}
NIModelProvider.registerModel(UrlImageModel);
//# sourceMappingURL=niUrlImageModel.js.map