"use strict";
// Disbatch.js
//   assigns commands to creeps in a room
exports.__esModule = true;
exports.Disbatch = void 0;
var Disbatch = /** @class */ (function () {
    function Disbatch(managers) {
        this.managers = managers;
    }
    Disbatch.prototype.run = function (free) {
        for (var _i = 0, _a = this.managers; _i < _a.length; _i++) {
            var manager = _a[_i];
            manager.run(free);
        }
    };
    return Disbatch;
}());
exports.Disbatch = Disbatch;
