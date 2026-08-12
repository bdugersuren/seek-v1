"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@redux-saga+delay-p@1.3.1";
exports.ids = ["vendor-chunks/@redux-saga+delay-p@1.3.1"];
exports.modules = {

/***/ "(ssr)/../../node_modules/.pnpm/@redux-saga+delay-p@1.3.1/node_modules/@redux-saga/delay-p/dist/redux-saga-delay-p.development.esm.js":
/*!**************************************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/@redux-saga+delay-p@1.3.1/node_modules/@redux-saga/delay-p/dist/redux-saga-delay-p.development.esm.js ***!
  \**************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ delayP)\n/* harmony export */ });\n/* harmony import */ var _redux_saga_symbols__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @redux-saga/symbols */ \"(ssr)/../../node_modules/.pnpm/@redux-saga+symbols@1.2.1/node_modules/@redux-saga/symbols/dist/redux-saga-symbols.esm.js\");\n\n\nvar MAX_SIGNED_INT = 2147483647;\nfunction delayP(ms, val) {\n  if (val === void 0) {\n    val = true;\n  }\n  // https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value\n  if (ms > MAX_SIGNED_INT) {\n    throw new Error('delay only supports a maximum value of ' + MAX_SIGNED_INT + 'ms');\n  }\n  var timeoutId;\n  var promise = new Promise(function (resolve) {\n    timeoutId = setTimeout(resolve, Math.min(MAX_SIGNED_INT, ms), val);\n  });\n  promise[_redux_saga_symbols__WEBPACK_IMPORTED_MODULE_0__.CANCEL] = function () {\n    clearTimeout(timeoutId);\n  };\n  return promise;\n}\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0ByZWR1eC1zYWdhK2RlbGF5LXBAMS4zLjEvbm9kZV9tb2R1bGVzL0ByZWR1eC1zYWdhL2RlbGF5LXAvZGlzdC9yZWR1eC1zYWdhLWRlbGF5LXAuZGV2ZWxvcG1lbnQuZXNtLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQTZDOztBQUU3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsVUFBVSx1REFBTTtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFNkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac2Vlay9wb3J0YWwtd2ViLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9AcmVkdXgtc2FnYStkZWxheS1wQDEuMy4xL25vZGVfbW9kdWxlcy9AcmVkdXgtc2FnYS9kZWxheS1wL2Rpc3QvcmVkdXgtc2FnYS1kZWxheS1wLmRldmVsb3BtZW50LmVzbS5qcz8yYWExIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENBTkNFTCB9IGZyb20gJ0ByZWR1eC1zYWdhL3N5bWJvbHMnO1xuXG52YXIgTUFYX1NJR05FRF9JTlQgPSAyMTQ3NDgzNjQ3O1xuZnVuY3Rpb24gZGVsYXlQKG1zLCB2YWwpIHtcbiAgaWYgKHZhbCA9PT0gdm9pZCAwKSB7XG4gICAgdmFsID0gdHJ1ZTtcbiAgfVxuICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvc2V0VGltZW91dCNtYXhpbXVtX2RlbGF5X3ZhbHVlXG4gIGlmIChtcyA+IE1BWF9TSUdORURfSU5UKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdkZWxheSBvbmx5IHN1cHBvcnRzIGEgbWF4aW11bSB2YWx1ZSBvZiAnICsgTUFYX1NJR05FRF9JTlQgKyAnbXMnKTtcbiAgfVxuICB2YXIgdGltZW91dElkO1xuICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgdGltZW91dElkID0gc2V0VGltZW91dChyZXNvbHZlLCBNYXRoLm1pbihNQVhfU0lHTkVEX0lOVCwgbXMpLCB2YWwpO1xuICB9KTtcbiAgcHJvbWlzZVtDQU5DRUxdID0gZnVuY3Rpb24gKCkge1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICB9O1xuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuZXhwb3J0IHsgZGVsYXlQIGFzIGRlZmF1bHQgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/.pnpm/@redux-saga+delay-p@1.3.1/node_modules/@redux-saga/delay-p/dist/redux-saga-delay-p.development.esm.js\n");

/***/ })

};
;