"use strict";

const fontValues = ["arial", "calibri", "roboto"];

exports.postAceInit = (hook, context) => {
  const $fontDropdowns = $("select.family-selection");

  $fontDropdowns.each(function () {
    const $dropdown = $(this);

    // Clear and add "Aa" as a disabled label
    $dropdown
      .empty()
      .append($("<option>").attr({ value: "", disabled: true }).text("Aa"));

    // Add real font options
    fontValues.forEach((val) => {
      const label = val.charAt(0).toUpperCase() + val.slice(1);
      $dropdown.append($("<option>").attr("value", val).text(label));
    });

    // Refresh niceSelect after DOM update
    setTimeout(() => {
      $dropdown.niceSelect?.("update");
    }, 100);
  });

  // Font change event from dropdown
  $fontDropdowns.on("change", function () {
    const selectedFont = $(this).val();

    context.ace.callWithAce(
      (ace) => {
        try {
          const value = selectedFont || null;

          // Apply font to selected text
          ace.ace_setAttributeOnSelection("fontfamily", value);

          // ✅ Persist font for future inserted text using official method
          const attributeManager = context.documentAttributeManager;
          if (value) {
            attributeManager.setAttributeOnInsertion("fontfamily", value);
          } else {
            attributeManager.setAttributeOnInsertion("fontfamily", "");
          }
        } catch (err) {
          console.warn("Font apply failed:", err);
        }
      },
      "applyFontFamily",
      true
    );

    // Update label
    const label = selectedFont
      ? selectedFont.charAt(0).toUpperCase() + selectedFont.slice(1)
      : "Aa";

    $(this).next(".nice-select").find(".current").text(label);
  });
};

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
    const $dropdowns = $("select.family-selection");
    const currentFont =
      call.editorInfo.ace_getAttributeOnSelection("fontfamily") || "";

    const newValue = fontValues.includes(currentFont) ? currentFont : "";

    $dropdowns.each(function () {
      const $dropdown = $(this);
      $dropdown.val(newValue);

      // Update visible label manually
      const label = newValue
        ? newValue.charAt(0).toUpperCase() + newValue.slice(1)
        : "Aa";

      $dropdown.next(".nice-select").find(".current").text(label);
    });
  }, 100);
};

exports.aceAttribsToClasses = (hook, context) => {
  if (context.key === "fontfamily" && fontValues.includes(context.value)) {
    return [`fontfamily-${context.value}`];
  }
  return [];
};

exports.aceAttribClasses = (hook, attr) => {
  const result = {};
  if (attr.fontfamily && fontValues.includes(attr.fontfamily)) {
    result[`fontfamily-${attr.fontfamily}`] = "span";
  }
  return result;
};

exports.aceCreateDomLine = (hook, context) => {
  const match = context.cls.match(/(?:^|\s)fontfamily-([a-z]+)/);
  if (match && fontValues.includes(match[1])) {
    return [
      {
        extraOpenTags: `<span class="fontfamily-${match[1]}">`,
        extraCloseTags: "</span>",
        cls: "",
      },
    ];
  }
  return [];
};

exports.aceEditorCSS = () => ["/ep_font_family/static/css/fonts.css"];
