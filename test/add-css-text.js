
// add-css-text @ npm, add css text.

//if the element by `styleId` already exists, its cssText will be fully replaced.
module.exports = function (cssText, styleId) {
	var style;
	if (styleId && (style = document.getElementById(styleId))) {
		if (style.tagName.toUpperCase() != "STYLE") return;	//fail

		style.textContent = cssText;
	}
	else {
		style = document.createElement("style");
		style.type = "text/css";
		if (styleId) style.id = styleId;

		try {
			style.appendChild(document.createTextNode(cssText));
		}
		catch (ex) {
			style.styleSheet.cssText = cssText;
		}
		document.getElementsByTagName("head")[0].appendChild(style);
	}
};
