// defaults function for string
module.exports = function() {
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
    String.prototype.uncapitalize = function () {
        return this.charAt(0).toLowerCase() + this.slice(1);
    }
    String.prototype.a = function () {
        return this.uncapitalize();
    }
    String.prototype.A = function () {
        return this.capitalize();
    }
    String.prototype.replaceAll = function (find, replace) {
        var str = this;
        return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
    }
    String.prototype.replaceAllRegExp = function (find, replace) {
        var str = this;
        return str.replace(new RegExp(find, 'g'), replace);
    };
}
