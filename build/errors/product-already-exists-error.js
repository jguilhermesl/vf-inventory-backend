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

// src/errors/product-already-exists-error.ts
var product_already_exists_error_exports = {};
__export(product_already_exists_error_exports, {
  ProductAlreadyExistsError: () => ProductAlreadyExistsError
});
module.exports = __toCommonJS(product_already_exists_error_exports);
var ProductAlreadyExistsError = class extends Error {
  constructor() {
    super("Product already exists.");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ProductAlreadyExistsError
});
