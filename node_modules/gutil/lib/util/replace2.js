// replace2
module.exports = function(txt, oldValues, newValues) {
    if(txt == null || oldValues == null || newValues == null) {
        return txt;
    }
//    if(oldValues instanceof Array && newValues instanceof Array) {
        if (oldValues.length != newValues.length) {
            return txt;
        }
        var current = {};
        for (var i = 0; i < oldValues; i++) {
            current[i] = {posInTxt: null, posInValue: null, nextChar: oldValues[i][0]};
        }
        var result = "";
        for (var pos = 0; pos < txt.length; pos++) {
            var char = txt[pos];
            var oldValueSelected = null;
            var newValueSelected = null;
            for (var i = 0; i < oldValues.length; i++) {
                var canReplace = false;
                var oldValue = oldValues[i];
                if (oldValue != null) {
                    if (char == oldValue[0]) {
                        var posInTxt = pos;
                        var posInOldValue = 0;
                        while (posInTxt < txt.length
                            && posInOldValue < oldValue.length
                            && txt[posInTxt] == oldValue[posInOldValue]) {
                            posInTxt++;
                            posInOldValue++;
                        }
                        if (posInTxt < txt.length+1 && posInOldValue == oldValue.length) {
                            canReplace = true;
                        }
                    }
                    if (canReplace && (oldValueSelected == null || oldValue.length > oldValueSelected.length)) {
                        oldValueSelected = oldValue;
                        newValueSelected = newValues[i];
                    }
                }
            }
            if (oldValueSelected != null && newValueSelected != null) {
                result += newValueSelected;
                pos += oldValueSelected.length-1;
            } else {
                result += char;
            }
        }
//    }
    return result;
}