import { NI_SUPPORT } from './niSupport.js';
/**
 * Module which sets a unique niControlId on elements when they're attached
 * to the page (if not already set), before a model / viewModel is created for them.
 *
 * Currently used for dynamic plots / plot renderers / cursors. This was moved out of
 * WebCharts with the eventual goal of having IDs provided by C# (for Plan5 graph part
 * reference properties), at which point the graph viewModels would handle this (and
 * only for plots/renderers/cursors being used via property nodes).
 **/
export class EnsureNIControlIDModule {
    static get moduleName() {
        return 'EnsureNIControlIDModule';
    }
    ready() {
        if (this.ownerElement.niControlId === null) {
            this.ownerElement.niControlId = NI_SUPPORT.uniqueId();
        }
    }
}
window.JQX.Elements.whenRegistered('ni-cartesian-plot', function (proto) {
    proto.addModule(EnsureNIControlIDModule);
});
window.JQX.Elements.whenRegistered('ni-cartesian-plot-renderer', function (proto) {
    proto.addModule(EnsureNIControlIDModule);
});
window.JQX.Elements.whenRegistered('ni-cursor', function (proto) {
    proto.addModule(EnsureNIControlIDModule);
});
//# sourceMappingURL=ensureNIControlIDModule.js.map