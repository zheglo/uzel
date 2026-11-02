

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/hero/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.MRVkUyqo.js","_app/immutable/chunks/CXgMx_bt.js","_app/immutable/chunks/DRLFVFLf.js"];
export const stylesheets = ["_app/immutable/assets/5.D9ghSeYW.css"];
export const fonts = [];
