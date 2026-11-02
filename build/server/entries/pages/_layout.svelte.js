import { a as attr, n as head } from "../../chunks/server2.js";
// src/lib/assets/favicon.svg
var favicon_default = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20id='_Слой_1'%20data-name='Слой_1'%20xmlns='http://www.w3.org/2000/svg'%20version='1.1'%20viewBox='0%200%20128%20128'%3e%3c!--%20Generator:%20Adobe%20Illustrator%2029.0.1,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%202.1.0%20Build%20192)%20--%3e%3cdefs%3e%3cstyle%3e%20.st0,%20.st1%20{%20fill-rule:%20evenodd;%20}%20.st1%20{%20fill:%20%23fb0505;%20}%20%3c/style%3e%3c/defs%3e%3cpath%20class='st1'%20d='M109.4,64c0,25.2-20.3,45.4-45.4,45.4s-45.4-20.3-45.4-45.4,20.3-45.4,45.4-45.4,45.4,20.3,45.4,45.4ZM86.7,64c0,12.5-10.2,22.7-22.7,22.7s-22.7-10.2-22.7-22.7,10.2-22.7,22.7-22.7,22.7,10,22.7,22.7Z'/%3e%3cpath%20class='st0'%20d='M60.6,6.8h8v114.4h-8V6.8Z'/%3e%3c/svg%3e";
// src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	head("12qhfyh", $$renderer, ($$renderer) => {
		$$renderer.push(`<link rel="icon"${attr("href", favicon_default)}/>`);
	});
	children($$renderer);
	$$renderer.push(`<!---->`);
}
export { _layout as default };

//# sourceMappingURL=_layout.svelte.js.map