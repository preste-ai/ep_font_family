// "use strict";

// const fontValues = ["arial", "calibri", "roboto"];

// /**
//  * Initialize font dropdown and event handler
//  */
// exports.postAceInit = (hook, context) => {
//   const $fontDropdown = $("select.family-selection").first();

//   // Add default option
//   $fontDropdown.append($("<option>").attr("value", "").text("Aa"));

//   // Add font options
//   fontValues.forEach((val) => {
//     const label = val.charAt(0).toUpperCase() + val.slice(1);
//     $fontDropdown.append($("<option>").attr("value", val).text(label));
//   });

//   // Refresh the custom select
//   setTimeout(() => {
//     $fontDropdown.niceSelect?.("update");
//   }, 100);

//   // Font change event
//   $fontDropdown.on("change", function () {
//     const selectedFont = $(this).val();

//     context.ace.callWithAce(
//       (ace) => {
//         try {
//           if (selectedFont) {
//             ace.ace_setAttributeOnSelection("fontfamily", selectedFont);
//           } else {
//             ace.ace_setAttributeOnSelection("fontfamily", null);
//           }
//         } catch (err) {
//           console.warn("Font apply failed:", err);
//         }
//       },
//       "applyFontFamily",
//       true
//     );
//   });
// };

// /**
//  * Update dropdown based on current selection
//  */
// exports.aceEditEvent = (hook, call) => {
//   const cs = call.callstack;

//   if (
//     !(
//       cs.type === "handleClick" ||
//       cs.type === "handleKeyEvent" ||
//       cs.docTextChanged
//     )
//   )
//     return;

//   setTimeout(() => {
//     const $dropdown = $("select.family-selection").first(); // Make sure it's the right one
//     const currentFont =
//       call.editorInfo.ace_getAttributeOnSelection("fontfamily");

//     const newValue = fontValues.includes(currentFont) ? currentFont : "";

//     // ✅ This ensures the selected <option> is updated
//     if ($dropdown.val() !== newValue) {
//       $dropdown.val(newValue).trigger("change.select2"); // .trigger() for safety
//     }

//     // ✅ Force UI to update (important for niceSelect)
//     $dropdown.niceSelect?.("update");
//   }, 100);
// };

// /**
//  * Map fontfamily attribute to CSS class
//  */
// exports.aceAttribsToClasses = (hook, context) => {
//   if (context.key === "fontfamily" && fontValues.includes(context.value)) {
//     return [`fontfamily-${context.value}`];
//   }
//   return [];
// };

// /**
//  * Export fontfamily attributes as spans in the HTML
//  */
// exports.aceAttribClasses = (hookName, attr) => {
//   const result = {};
//   if (attr.fontfamily && fontValues.includes(attr.fontfamily)) {
//     result[`fontfamily-${attr.fontfamily}`] = "span";
//   }
//   return result;
// };

// /**
//  * Apply the font span styling to the DOM when rendering
//  */
// exports.aceCreateDomLine = (hook, context) => {
//   const { cls } = context;

//   const match = cls.match(/(?:^|\s)fontfamily-([a-z]+)/);
//   if (match) {
//     return [
//       {
//         extraOpenTags: `<span class="fontfamily-${match[1]}">`,
//         extraCloseTags: "</span>",
//         cls: "",
//       },
//     ];
//   }

//   return [];
// };

// /**
//  * Include the CSS for fonts
//  */
// exports.aceEditorCSS = () => ["/ep_font_family/static/css/fonts.css"];
"use strict";

const fontValues = ["arial", "calibri", "roboto"];

/**
 * Initialize font dropdown and event handler
 */
exports.postAceInit = (hook, context) => {
  const $fontDropdown = $("select.family-selection").first();

  // Add default option
  $fontDropdown.append($("<option>").attr("value", "").text("Aa"));

  // Add font options
  fontValues.forEach((val) => {
    const label = val.charAt(0).toUpperCase() + val.slice(1);
    $fontDropdown.append($("<option>").attr("value", val).text(label));
  });

  // Refresh the custom select
  setTimeout(() => {
    $fontDropdown.niceSelect?.("update");
  }, 100);

  // Font change event
  $fontDropdown.on("change", function () {
    const selectedFont = $(this).val();

    context.ace.callWithAce(
      (ace) => {
        try {
          if (selectedFont) {
            ace.ace_setAttributeOnSelection("fontfamily", selectedFont);
          } else {
            ace.ace_setAttributeOnSelection("fontfamily", null);
          }
        } catch (err) {
          console.warn("Font apply failed:", err);
        }
      },
      "applyFontFamily",
      true
    );
  });
};

/**
 * Update dropdown based on current selection
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
    const $dropdown = $("select.family-selection").first(); // Make sure it's the right one
    const currentFont =
      call.editorInfo.ace_getAttributeOnSelection("fontfamily");

    const newValue = fontValues.includes(currentFont) ? currentFont : "";

    // ✅ This ensures the selected <option> is updated
    if ($dropdown.val() !== newValue) {
      $dropdown.val(newValue).trigger("change.select2"); // .trigger() for safety
    }

    // ✅ Force UI to update (important for niceSelect)
    $dropdown.niceSelect?.("update");
  }, 100);
};

/**
 * Map fontfamily attribute to CSS class
 */
exports.aceAttribsToClasses = (hook, context) => {
  if (context.key === "fontfamily" && fontValues.includes(context.value)) {
    return [`fontfamily-${context.value}`];
  }
  return [];
};

/**
 * Export fontfamily attributes as spans in the HTML
 */
exports.aceAttribClasses = (hookName, attr) => {
  const result = {};
  if (attr.fontfamily && fontValues.includes(attr.fontfamily)) {
    result[`fontfamily-${attr.fontfamily}`] = "span";
  }
  return result;
};

/**
 * Apply the font span styling to the DOM when rendering
 */
exports.aceCreateDomLine = (hook, context) => {
  const { cls } = context;

  const match = cls.match(/(?:^|\s)fontfamily-([a-z]+)/);
  if (match) {
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

/**
 * Include the CSS for fonts
 */
exports.aceEditorCSS = () => ["/ep_font_family/static/css/fonts.css"];
