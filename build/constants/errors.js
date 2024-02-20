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

// src/constants/errors.ts
var errors_exports = {};
__export(errors_exports, {
  HttpsCode: () => HttpsCode
});
module.exports = __toCommonJS(errors_exports);
var HttpsCode = /* @__PURE__ */ ((HttpsCode2) => {
  HttpsCode2[HttpsCode2["Success"] = 200] = "Success";
  HttpsCode2[HttpsCode2["Created"] = 201] = "Created";
  HttpsCode2[HttpsCode2["Unauthorized"] = 401] = "Unauthorized";
  HttpsCode2[HttpsCode2["NotFound"] = 404] = "NotFound";
  HttpsCode2[HttpsCode2["Conflict"] = 409] = "Conflict";
  HttpsCode2[HttpsCode2["InternalServerError"] = 500] = "InternalServerError";
  return HttpsCode2;
})(HttpsCode || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HttpsCode
});
