"use strict";

const fontValues = ["arial", "calibri", "roboto"];

let currentFont = "";

exports.postAceInit = (hook, context) => {
  const $fontDropdowns = $("select.family-selection");

  $fontDropdowns.each(function () {
    const $dropdown = $(this);

    $dropdown
      .empty()
      .append($("<option>").attr({ value: "", disabled: true }).text("Aa"));

    fontValues.forEach((val) => {
      const label = val.charAt(0).toUpperCase() + val.slice(1);
      $dropdown.append($("<option>").attr("value", val).text(label));
    });

    setTimeout(() => {
      $dropdown.niceSelect?.("update");
    }, 50);
  });

  $fontDropdowns.on("change", function () {
    currentFont = $(this).val() || ""; //

    const label = currentFont
      ? currentFont.charAt(0).toUpperCase() + currentFont.slice(1)
      : "Aa";
    $(this).next(".nice-select").find(".current").text(label);

    context.ace.callWithAce(
      (ace) => {
        try {
          ace.ace_setAttributeOnSelection("fontfamily", currentFont || "");
        } catch (e) {}
      },
      "applyFontFamily",
      true
    );
  });
};

exports.aceEditEvent = (hook, call) => {
  setTimeout(() => {
    const f = fontValues.includes(currentFont) ? currentFont : "";
    $("select.family-selection").each(function () {
      $(this).val(f);
      const lbl = f ? f.charAt(0).toUpperCase() + f.slice(1) : "Aa";
      $(this).next(".nice-select").find(".current").text(lbl);
    });
  }, 20);
};

exports.aceCreateDomLine = (hook, context) => {
  const font = currentFont;
  if (!fontValues.includes(font)) return [];

  context.cls = `fontfamily-${font} ${context.cls || ""}`.trim();

  return [
    {
      extraOpenTags: "",
      extraCloseTags: "",
      cls: context.cls,
    },
  ];
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

exports.aceEditorCSS = () => ["/ep_font_family/static/css/fonts.css"];
