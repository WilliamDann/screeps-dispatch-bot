"use strict";
exports.__esModule = true;
exports.Posting = exports.Bulletin = void 0;
var Bulletin = /** @class */ (function () {
    function Bulletin(posts, maxLength) {
        if (posts === void 0) { posts = null; }
        if (maxLength === void 0) { maxLength = 30; }
        if (posts == null)
            posts = [];
        this.posts = posts;
        this.maxLength = maxLength;
    }
    Bulletin.prototype.add = function (posting) {
        console.log(posting);
        this.posts.unshift(posting);
        if (this.posts.length > this.maxLength)
            this.posts.pop();
    };
    Bulletin.prototype.clear = function () {
        this.posts = [];
    };
    Bulletin.prototype.findMentions = function (target) {
        var referenced = [];
        for (var _i = 0, _a = this.posts; _i < _a.length; _i++) {
            var post = _a[_i];
            if (post.target == target)
                referenced.push(post);
        }
        return referenced;
    };
    Bulletin.prototype.findJobsOut = function (target) {
        var mentions = this.findMentions(target);
        var diff = 0;
        for (var _i = 0, mentions_1 = mentions; _i < mentions_1.length; _i++) {
            var mention = mentions_1[_i];
            if (mention.data == "job_assign")
                diff++;
            if (mention.data == "job_complete")
                diff--;
        }
        return diff;
    };
    Bulletin.prototype.output = function () {
        for (var _i = 0, _a = this.posts; _i < _a.length; _i++) {
            var post = _a[_i];
            console.log(". " + post.target + ": " + post.data + " by " + post.poster);
        }
    };
    return Bulletin;
}());
exports.Bulletin = Bulletin;
var Posting = /** @class */ (function () {
    function Posting(target, data, poster) {
        this.target = target;
        this.data = data;
        this.poster = poster;
    }
    Posting.prototype.toString = function () {
        return this.target + ": " + this.data + " by " + this.poster;
    };
    return Posting;
}());
exports.Posting = Posting;
