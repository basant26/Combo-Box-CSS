//****************************************
// HTML Container View Model
// National Instruments Copyright 2019
//****************************************
import { CssProperties as CSS_PROPERTIES } from '../Framework/niCssProperties.js';
import { HtmlContainer } from '../Elements/ni-html-container.js';
import { HtmlContainerModel } from '../Modeling/niHtmlContainerModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { VisualViewModel } from './niVisualViewModel.js';
// Static Private Functions
const convertImageSourceToCSS = function (imageSource) {
    const source = typeof imageSource === 'string' && imageSource !== '' ? `url('${imageSource}')` : 'none';
    return source;
};
export class HtmlContainerViewModel extends VisualViewModel {
    constructor(element, model) {
        super(element, model);
        this.registerAutoSyncProperty('imageVisible');
        this.registerAutoSyncProperty('imageStretch');
    }
    modelPropertyChanged(propertyName) {
        const model = this.model;
        const renderBuffer = super.modelPropertyChanged(propertyName);
        switch (propertyName) {
            case 'imageSource':
                renderBuffer.cssStyles[CSS_PROPERTIES.PLACEHOLDER_URL] = convertImageSourceToCSS(model.imageSource);
                break;
        }
    }
    // We aren't syncing 'imageSource' in `updateModelFromElement` due to it requiring complicated parsing for relative URLs.
    // If we add property node support for `imageSource` in the future, it will require this parsing.
    applyModelToElement() {
        const element = this.element;
        const model = this.model;
        super.applyModelToElement();
        element.style.setProperty(CSS_PROPERTIES.PLACEHOLDER_URL, convertImageSourceToCSS(model.imageSource));
        if (model.imageVisible) {
            // Must generate background-image CSS here so relative links work correctly at edit time (Relative links are relative to the page the CSS is defined on).
            element.style.backgroundImage = 'var(--ni-placeholder-url)';
        }
    }
}
NIModelProvider.registerViewModel(HtmlContainerViewModel, HtmlContainer, HtmlContainerModel);
//# sourceMappingURL=niHtmlContainerViewModel.js.map