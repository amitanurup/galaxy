var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
var projectDir = path.dirname(fileURLToPath(import.meta.url));
var dataFile = path.join(projectDir, "local-data.json");
var readBody = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var body = "";
                req.on("data", function (chunk) {
                    body += chunk;
                });
                req.on("end", function () { return resolve(body); });
                req.on("error", reject);
            })];
    });
}); };
var json = function (res, status, value) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(value));
};
var localDataApi = function () { return ({
    name: "me24x7-local-data-api",
    configureServer: function (server) {
        var _this = this;
        server.middlewares.use("/api/data", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var data, _a, body, parsed, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(req.method === "GET")) return [3 /*break*/, 5];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs.readFile(dataFile, "utf8")];
                    case 2:
                        data = _c.sent();
                        json(res, 200, JSON.parse(data));
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _c.sent();
                        json(res, 404, { error: "No local shared data yet" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                    case 5:
                        if (!(req.method === "PUT")) return [3 /*break*/, 11];
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 9, , 10]);
                        return [4 /*yield*/, readBody(req)];
                    case 7:
                        body = _c.sent();
                        parsed = JSON.parse(body);
                        if (!Array.isArray(parsed.jobs) || !Array.isArray(parsed.inventory)) {
                            json(res, 400, { error: "Invalid app data" });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, fs.writeFile(dataFile, JSON.stringify(parsed, null, 2), "utf8")];
                    case 8:
                        _c.sent();
                        json(res, 200, { ok: true, updatedAt: new Date().toISOString() });
                        return [3 /*break*/, 10];
                    case 9:
                        _b = _c.sent();
                        json(res, 400, { error: "Could not save local data" });
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                    case 11:
                        json(res, 405, { error: "Method not allowed" });
                        return [2 /*return*/];
                }
            });
        }); });
    },
}); };
export default defineConfig({
    base: "./",
    plugins: [react(), localDataApi()],
});
