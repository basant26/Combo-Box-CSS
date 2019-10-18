import { DeepCopyConverter } from './ValueConverters/niDeepCopyValueConverter.js';
import { NI_SUPPORT } from './niSupport.js';
export class jqxColorPanelModule {
    static get moduleName() {
        return 'jqxColorPanelModule';
    }
    static get properties() {
        const properties = {
            'messages': DeepCopyConverter.deepCopy(JQX.ColorPanel.properties.messages)
        };
        properties.messages.value.en.customColor = NI_SUPPORT.i18n('msg_COLOR_PICKER_MORE_COLORS');
        properties.messages.value.en.cancel = NI_SUPPORT.i18n('msg_COLOR_PICKER_MORE_COLORS_CANCEl');
        return properties;
    }
}
window.JQX.Elements.whenRegistered('jqx-color-panel', function (proto) {
    proto.addModule(jqxColorPanelModule);
});
//# sourceMappingURL=jqxColorPanelModule.js.map