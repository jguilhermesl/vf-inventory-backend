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

// src/middlewares/error-middleware.ts
var error_middleware_exports = {};
__export(error_middleware_exports, {
  errorMiddleware: () => errorMiddleware
});
module.exports = __toCommonJS(error_middleware_exports);

// src/errors/email-already-exists-error.ts
var EmailAlreadyExistsError = class extends Error {
  constructor() {
    super("Email j\xE1 existe.");
  }
};

// src/middlewares/error-middleware.ts
var errorMiddleware = (err, req, res, next) => {
  console.log("err ==> ", err);
  if (err instanceof EmailAlreadyExistsError) {
    return res.status(500 /* InternalServerError */).json({ err: err.message });
  }
  return res.status(500 /* InternalServerError */).json({ error: err.message });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  errorMiddleware
});
