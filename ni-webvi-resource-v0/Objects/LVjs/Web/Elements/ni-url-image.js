//****************************************
// Url Image Control Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************
import { NIElementRegistrationService } from '../Framework/niElementRegistrationService.js';
import { NI_SUPPORT } from '../Framework/niSupport.js';
import { Visual } from './ni-visual.js';
import { VisualComponent } from './ni-visual-component.js';
// Static Private Reference Aliases
const STRETCH_ENUM = Object.freeze({
    NONE: 'none',
    UNIFORM: 'uniform',
    UNIFORM_TO_FILL: 'uniformtofill',
    FILL: 'fill' // Size so that the image fills the space ignoring aspect ratio (Stretch to fill space)
});
// Static Private Functions
const createImage = function (urlImageElement) {
    const that = urlImageElement;
    that.innerHTML = '';
    let imageParent = urlImageElement;
    if (that.href !== '') {
        const anchor = document.createElement('a');
        anchor.classList.add('ni-image-link');
        anchor.rel = 'noopener';
        if (!that.disabled) {
            anchor.href = that.href;
        }
        anchor.target = that.target;
        urlImageElement.appendChild(anchor);
        imageParent = anchor;
    }
    // A div element with background css is used instead of an img element because the img element does not support the different stretch modes
    // but background images with css do support the different stretch modes
    const divElement = document.createElement('div');
    divElement.classList.add('ni-image-box');
    divElement.style.width = '100%';
    divElement.style.height = '100%';
    if (that.source !== '') {
        divElement.style.backgroundImage = 'url(' + that.source + ')';
    }
    // TODO mraj should validate enum value? currently assumes valid string
    if (that.stretch !== '' && that.stretch !== STRETCH_ENUM.NONE) {
        divElement.classList.add('ni-stretch-' + that.stretch);
    }
    divElement.title = that.alternate;
    imageParent.appendChild(divElement);
};
export class UrlImage extends Visual {
    // Static Private Variables
    // None
    // Public Prototype Methods
    addAllProperties(targetPrototype) {
        super.addAllProperties(targetPrototype);
        const proto = UrlImage.prototype;
        proto.addProperty(targetPrototype, {
            propertyName: 'source',
            defaultValue: '',
            fireEvent: true,
            addNonSignalingProperty: true
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'alternate',
            defaultValue: ''
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'href',
            defaultValue: ''
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'target',
            defaultValue: ''
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'stretch',
            defaultValue: STRETCH_ENUM.UNIFORM
        });
        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'source', 'source', 'sourceNonSignaling', 'source-changed');
    }
    attachedCallback() {
        const firstCall = super.attachedCallback();
        if (firstCall === true) {
            createImage(this);
        }
        return firstCall;
    }
    propertyUpdated(propertyName) {
        super.propertyUpdated(propertyName);
        switch (propertyName) {
            case 'alternate':
            case 'href':
            case 'target':
            case 'source':
            case 'stretch':
            case 'disabled':
                createImage(this);
                break;
        }
    }
    /**
    * Calls focus on hyperlink.
    */
    focus(...args) {
        const hyperlink = this.querySelector('a');
        if (hyperlink !== null) {
            return hyperlink.focus(...args);
        }
    }
}
NIElementRegistrationService.registerElement(UrlImage);
VisualComponent.defineElementInfo(UrlImage.prototype, 'ni-url-image', 'HTMLNIUrlImage');
export const StretchEnum = STRETCH_ENUM;
//# sourceMappingURL=ni-url-image.js.map