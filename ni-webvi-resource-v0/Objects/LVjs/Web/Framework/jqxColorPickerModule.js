// These colors are matching with colors defined for WPF color picker in ColorPicker.IDE.WPF.xaml
export const paletteColors = [
    '#FFFFFF00', '#FFFFFFFF', '#E0E0E0FF', '#C1C1C1FF', '#A5A5A5FF', '#838383FF', '#646464FF', '#4D5359FF', '#262626FF', '#000000FF',
    '#FCA88FFF', '#F5CEA4FF', '#FFF89AFF', '#CAEA9CFF', '#83CA9DFF', '#8CDFFFFF', '#93B7E3FF', '#A39DE0FF', '#B599D9FF', '#F49BC1FF',
    '#F36B4EFF', '#FBAF5CFF', '#FFF567FF', '#ABD471FF', '#3AB878FF', '#00BFF3FF', '#4C9BE0FF', '#706DC0FF', '#865EA8FF', '#F16CA9FF',
    '#EE1C25FF', '#F8941CFF', '#FFF200FF', '#8DC73DFF', '#00A64FFF', '#00A4E5FF', '#0070BCFF', '#3D3EB2FF', '#662B91FF', '#ED0C8CFF',
    '#9E0911FF', '#A35A13FF', '#AFA20AFF', '#588527FF', '#007133FF', '#0076A3FF', '#004A80FF', '#191363FF', '#440F62FF', '#9E005DFF'
];
export class jqxColorPickerModule {
    static get moduleName() {
        return 'jqxColorPickerModule';
    }
    ready() {
        this.ownerElement.paletteColors = paletteColors;
        this.ownerElement.columnCount = 10;
    }
}
window.JQX.Elements.whenRegistered('jqx-color-picker', function (proto) {
    proto.addModule(jqxColorPickerModule);
});
//# sourceMappingURL=jqxColorPickerModule.js.map