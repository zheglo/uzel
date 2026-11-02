

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.Dijq5TTx.js","_app/immutable/chunks/CXgMx_bt.js","_app/immutable/chunks/DRLFVFLf.js"];
export const stylesheets = [];
export const fonts = [];
