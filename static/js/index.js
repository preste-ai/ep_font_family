"use strict";

const fontValues = ["arial", "calibri", "roboto"];

/**
 * Init dropdown and event
 */
exports.postAceInit = (hook, context) => {
  const $fontDropdown = $("select.family-selection");

  // Add default option
  $fontDropdown.append($("<option>").attr("value", "").text("Aa"));

  fontValues.forEach((val) => {
    const label = val.charAt(0).toUpperCase() + val.slice(1);
    $fontDropdown.append($("<option>").attr("value", val).text(label));
  });

  setTimeout(() => {
    $fontDropdown.niceSelect?.("update");
  }, 100);

  $fontDropdown.on("change", function () {
    const selectedFont = $(this).val();

    context.ace.callWithAce(
      (ace) => {
        // Clear all fontfamily first
        fontValues.forEach((val) => {
          ace.ace_setAttributeOnSelection("fontfamily", null);
        });

        if (selectedFont) {
          ace.ace_setAttributeOnSelection("fontfamily", selectedFont);
        }
      },
      "applyFontFamily",
      true
    );
  });
};

/**
 * Show selected font in dropdown or "Font" if none
 */
exports.aceEditEvent = (hook, call) => {
  const cs = call.callstack;
  if (
    !(
      cs.type === "handleClick" ||
      cs.type === "handleKeyEvent" ||
      cs.docTextChanged
    )
  )
    return;

  setTimeout(() => {
    const $dropdown = $(".family-selection");
    const currentFont =
      call.editorInfo.ace_getAttributeOnSelection("fontfamily");

    $dropdown.val(currentFont || "");
    $dropdown.niceSelect?.("update");
  }, 250);
};

/**
 * Register fontfamily attribute as CSS class
 */
exports.aceAttribsToClasses = (hook, context) => {
  if (context.key === "fontfamily" && fontValues.includes(context.value)) {
    return [`fontfamily-${context.value}`];
  }
};

/**
 * Export as <span> with correct font class
 */
exports.aceAttribClasses = (hookName, attr) => {
  const result = {};
  if (attr.fontfamily && fontValues.includes(attr.fontfamily)) {
    result[`fontfamily-${attr.fontfamily}`] = "span";
  }
  return result;
};

/**
 * Load CSS for fonts
 */
exports.aceEditorCSS = () => ["/ep_font_family/static/css/fonts.css"];
