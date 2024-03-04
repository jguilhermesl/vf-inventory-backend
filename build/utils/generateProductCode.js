var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/generateProductCode.ts
var generateProductCode_exports = {};
__export(generateProductCode_exports, {
  generateProductCode: () => generateProductCode
});
module.exports = __toCommonJS(generateProductCode_exports);
var generateProductCode = (name) => {
  const parts = name.split(" ");
  const code = parts[0].slice(0, 3).toUpperCase() + parts[1].slice(0, 3).toUpperCase() + parts[parts.length - 1].slice(parts[parts.length - 1].length - 3, parts[parts.length - 1].length).toUpperCase();
  return code;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateProductCode
});
