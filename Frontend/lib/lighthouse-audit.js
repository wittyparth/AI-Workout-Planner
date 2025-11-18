"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
var lighthouse_1 = require("lighthouse");
var chromeLauncher = require("chrome-launcher");
var runLighthouse = function (url, thresholds) { return __awaiter(void 0, void 0, void 0, function () {
    var chrome, options, runnerResult, lhr, results, failed, _i, _a, metric, error_1;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, chromeLauncher.launch({ chromeFlags: ['--headless'] })];
            case 1:
                chrome = _e.sent();
                options = { port: chrome.port };
                _e.label = 2;
            case 2:
                _e.trys.push([2, 4, 5, 6]);
                return [4 /*yield*/, (0, lighthouse_1.default)(url, options)];
            case 3:
                runnerResult = _e.sent();
                lhr = runnerResult === null || runnerResult === void 0 ? void 0 : runnerResult.lhr;
                results = {
                    LCP: ((_b = lhr === null || lhr === void 0 ? void 0 : lhr.audits['largest-contentful-paint']) === null || _b === void 0 ? void 0 : _b.numericValue) !== undefined
                        ? lhr.audits['largest-contentful-paint'].numericValue / 1000
                        : 0,
                    CLS: ((_c = lhr === null || lhr === void 0 ? void 0 : lhr.audits['cumulative-layout-shift']) === null || _c === void 0 ? void 0 : _c.numericValue) !== undefined
                        ? lhr.audits['cumulative-layout-shift'].numericValue
                        : 0,
                    INP: ((_d = lhr === null || lhr === void 0 ? void 0 : lhr.audits['experimental-interaction-to-next-paint']) === null || _d === void 0 ? void 0 : _d.numericValue) !== undefined
                        ? lhr.audits['experimental-interaction-to-next-paint'].numericValue / 1000
                        : 0
                };
                console.log('Audit results:', results);
                failed = false;
                for (_i = 0, _a = Object.keys(thresholds); _i < _a.length; _i++) {
                    metric = _a[_i];
                    if (results[metric] > thresholds[metric]) {
                        console.error("".concat(metric, " failed: ").concat(results[metric], " > ").concat(thresholds[metric]));
                        failed = true;
                    }
                    else {
                        console.log("".concat(metric, " passed: ").concat(results[metric], " <= ").concat(thresholds[metric]));
                    }
                }
                if (failed) {
                    process.exit(1);
                }
                return [3 /*break*/, 6];
            case 4:
                error_1 = _e.sent();
                console.error('Lighthouse audit failed:', error_1);
                process.exit(1);
                return [3 /*break*/, 6];
            case 5:
                chrome.kill();
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); };
// Example usage:
var url = 'https://example.com';
var thresholds = {
    LCP: 2.5,
    CLS: 0.1,
    INP: 0.2 // 200 ms
};
runLighthouse(url, thresholds);
