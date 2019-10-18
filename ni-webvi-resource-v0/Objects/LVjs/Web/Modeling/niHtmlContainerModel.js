//****************************************
// HTML Container Model
// National Instruments Copyright 2019
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { StretchEnum } from '../Elements/ni-url-image.js';
import { VisualModel } from './niVisualModel.js';
export class HtmlContainerModel extends VisualModel {
    constructor(id) {
        super(id);
        this._imageVisible = false;
        this._imageSource = '';
        this._imageStretch = StretchEnum.UNIFORM;
    }
    static get MODEL_KIND() {
        return 'niHtmlContainer';
    }
    get imageSource() {
        return this._imageSource;
    }
    set imageSource(value) {
        this._imageSource = value;
        this.notifyModelPropertyChanged('imageSource');
    }
    get imageStretch() {
        return this._imageStretch;
    }
    set imageStretch(value) {
        this._imageStretch = value;
        this.notifyModelPropertyChanged('imageStretch');
    }
    get imageVisible() {
        return this._imageVisible;
    }
    set imageVisible(value) {
        this._imageVisible = value;
        this.notifyModelPropertyChanged('imageVisible');
    }
}
NIModelProvider.registerModel(HtmlContainerModel);
//# sourceMappingURL=niHtmlContainerModel.js.map