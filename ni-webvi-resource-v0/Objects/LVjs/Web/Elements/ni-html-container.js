//****************************************
// HTML Container Prototype
// DOM Registration: No
// National Instruments Copyright 2019
//****************************************
import { NIElementRegistrationService } from '../Framework/niElementRegistrationService.js';
import { StretchEnum } from './ni-url-image.js';
import { Visual } from './ni-visual.js';
import { VisualComponent } from './ni-visual-component.js';
export class HtmlContainer extends Visual {
    addAllProperties(targetPrototype) {
        super.addAllProperties(targetPrototype);
        const proto = HtmlContainer.prototype;
        proto.addProperty(targetPrototype, {
            propertyName: 'imageStretch',
            defaultValue: StretchEnum.UNIFORM
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'imageVisible',
            defaultValue: false
        });
    }
}
NIElementRegistrationService.registerElement(HtmlContainer);
VisualComponent.defineElementInfo(HtmlContainer.prototype, 'ni-html-container', 'NIHtmlContainer');
//# sourceMappingURL=ni-html-container.js.map