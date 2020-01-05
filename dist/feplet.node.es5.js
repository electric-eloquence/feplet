// For loops are generally replaced by recursion through iterators. This is more verbose, and more difficult to read for
// the uninitiated, but the idea of recursing on .next() values and terminating on .done values should be easy to grasp.
// In accordance with the "functional progamming" paradigm, this is useful for traversing nested data structures. In
// addition, since many functions herein add to data structures while recursing through them, we can avoid ambiguity as
// to whether added values are recomputed as .next() values. (They are.) Plain for, for..of, for..in, and forEach loops,
// as well as the .map(), .filter(), and .reduce() Array methods, all do this differently. Neither the loop statements
// nor Array methods inherently imply whether or not recomputation occurs. On the other hand, iterators' .next()
// unambiguously expresses computation on each call.
// Labeled block statements are used to segregate functions into organizational units. We could also achieve this end by
// breaking this file into multiple files. However, we need to compile our code into ES5 consumable by less modern
// browsers. Given that this is a relatively small file, it is easier to keep the code in one file.
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var hogan = require('../lib/hogan.js/lib/hogan.js');

var jsonEval = require('json-eval');

var paramRegex = /\([\S\s]*\)/;

COLLECTORS: {
  var contextKeysCollect = function contextKeysCollect(args) {
    var contextKeys_ = args.contextKeys_,
        contextKeysItr = args.contextKeysItr,
        contextKeysItrn = args.contextKeysItrn;

    if (contextKeysItrn.done) {
      return {
        contextKeys: contextKeys_
      };
    }

    var contextKey = contextKeysItrn.value;
    var contextKeySplit = contextKey.split('.');

    while (contextKeySplit.length > 1) {
      contextKeySplit.shift();
      var contextKeyNew = contextKeySplit.join('.');

      if (!contextKeys_.includes(contextKeyNew)) {
        contextKeys_.push(contextKeyNew);
      }
    }

    args.contextKeysItrn = contextKeysItr.next();
    return contextKeysCollect(args);
  };

  var dataKeysWithDotNotationAdd = function dataKeysWithDotNotationAdd(args) {
    var dataKeys = args.dataKeys,
        parentObjSplit = args.parentObjSplit;
    var i = 0;
    var itemNext;
    var dataKey = parentObjSplit[i]; // Using assigment as the condition for a while loop to avoid having to perform conditional check for starting a for
    // loop at index 1.

    while (itemNext = parentObjSplit[++i]) {
      // eslint-disable-line no-cond-assign
      dataKey += ".".concat(itemNext);

      if (!dataKeys.includes(dataKey)) {
        dataKeys.push(dataKey);
      }
    }

    return {
      dataKeys: dataKeys
    };
  };

  var dataKeysCollect = function dataKeysCollect(args) {
    var dataKeys_ = args.dataKeys_,
        dataObjShallowItrn = args.dataObjShallowItrn,
        dataObj = args.dataObj,
        parentObjAsStr = args.parentObjAsStr;
    var dataKeys = dataKeys_;

    if (dataObjShallowItrn.done) {
      return {
        dataKeys: dataKeys
      };
    }

    var key = dataObjShallowItrn.value;

    if (!dataKeys.includes(key) && !parentObjAsStr) {
      dataKeys.push(key);
    } // Recurse deeper into dataObj if this property is of type object.


    if (dataObj[key] && _typeof(dataObj[key]) === 'object') {
      var dataObjNestedObj = dataObj[key];
      var l = 1;

      if (Array.isArray(dataObjNestedObj)) {
        l = dataObjNestedObj.length;
      }

      for (var i = 0; i < l; i++) {
        var dataObjItem = void 0;

        if (Array.isArray(dataObjNestedObj)) {
          // Recursion into an Array.
          dataObjItem = dataObjNestedObj[i];
        } else {
          // Recursion into a plain Object.
          dataObjItem = dataObjNestedObj;
        }

        if (dataObjItem && dataObjItem.constructor === Object) {
          var dataObjItemKeys = Object.keys(dataObjItem);

          if (dataObjItemKeys.length) {
            var dataObjDeeperItr = void 0;
            var dataObjDeeperItrn = void 0;

            if (dataObjItemKeys.length === 1) {
              dataObjDeeperItr = {
                next: function next() {
                  return {
                    done: true
                  };
                }
              };
              dataObjDeeperItrn = {
                value: dataObjItemKeys[0]
              };
            } else {
              dataObjDeeperItr = dataObjItemKeys[Symbol.iterator]();
              dataObjDeeperItrn = dataObjDeeperItr.next();
            }

            var parentObjAsStrNew = parentObjAsStr;

            if (dataObjDeeperItrn.value) {
              if (Array.isArray(dataObjNestedObj)) {
                parentObjAsStrNew += parentObjAsStr ? ".".concat(key, ".").concat(i) : "".concat(key, ".").concat(i);
              } else {
                parentObjAsStrNew += parentObjAsStr ? ".".concat(key) : key;
              }

              var parentObjSplit = parentObjAsStrNew.split('.');

              var _dataKeysWithDotNotat = dataKeysWithDotNotationAdd({
                dataKeys: dataKeys,
                parentObjSplit: parentObjSplit
              });

              dataKeys = _dataKeysWithDotNotat.dataKeys;
            } // Clone args object for recursion deeper into dataObj.


            var argsDeeper = {
              dataKeys_: dataKeys,
              dataObjShallowItr: dataObjDeeperItr,
              dataObjShallowItrn: dataObjDeeperItrn,
              dataObj: dataObjItem,
              parentObjAsStr: parentObjAsStrNew,
              partialShort: args.partialShort
            };

            var _dataKeysCollect = dataKeysCollect(argsDeeper);

            dataKeys = _dataKeysCollect.dataKeys;
          }
        }
      }
    } else {
      var _parentObjSplit = parentObjAsStr ? parentObjAsStr.split('.') : [];

      if (!_parentObjSplit.includes(key)) {
        _parentObjSplit.push(key);
      }

      var _dataKeysWithDotNotat2 = dataKeysWithDotNotationAdd({
        dataKeys: dataKeys,
        parentObjSplit: _parentObjSplit
      });

      dataKeys = _dataKeysWithDotNotat2.dataKeys;
    }

    args.dataKeys_ = dataKeys;
    args.dataObjShallowItrn = args.dataObjShallowItr.next();
    return dataKeysCollect(args);
  };
}

HELPERS: {
  var paramsObjDotNotationParse = function paramsObjDotNotationParse(args) {
    var paramsObjPart = args.paramsObjPart,
        parseObjTagName = args.parseObjTagName;
    var tagNameSplit = parseObjTagName.split('.');
    var tagName0 = tagNameSplit.shift(); // First delimit.

    var tagNameShifted = tagNameSplit.join('.'); // Rest of the dot-delimited tagName.

    var value;

    if (tagName0 in paramsObjPart) {
      var _value = paramsObjPart[tagName0];

      if (_value instanceof Object && tagNameShifted.length) {
        value = paramsObjDotNotationParse({
          paramsObjPart: _value,
          parseObjTagName: tagNameShifted
        });
      } else {
        value = _value;
      }
    }

    if (value instanceof Object) {
      return value;
    } else {
      // Ok to return null because we only need keys, not values.
      return null;
    }
  };

  var styleModifierExtract = function styleModifierExtract(args) {
    var partialName = args.partialName;
    var styleModClasses = ''; // eslint-disable-next-line no-useless-escape

    var styleModifierMatch = partialName.match(/\:([\w\-\|]+)/);

    if (styleModifierMatch && styleModifierMatch[1]) {
      styleModClasses = styleModifierMatch[1].replace(/\|/g, ' ').trim();
      /* istanbul ignore if */

      if (!styleModClasses) {
        styleModifierMatch = null;
      }
    } // Because we search and replace structured object properties to shorten the file prior to minification, we cannot
    // use "styleModifier" or other function substrings as structured object property names. "styleModifier" is also
    // reserved as a property name on paramsObj. Using "styleModClasses" instead.


    return {
      styleModClasses: styleModClasses,
      styleModifierMatch: styleModifierMatch
    };
  }; // The \u0002 and \u0003 unicodes could be replaced with variables, but it is more clear what they are and what their
  // intent is if left as unicode. They are respectively Start of Text and End of Text characters. Their purpose is to
  // be temporary alternate tag delimiters.


  TAG_REPLACER: {
    var spacesCount = function spacesCount(args) {
      var count_ = args.count_,
          inc = args.inc,
          partialText_ = args.partialText_;
      var count;
      var counter = count_;

      while (/\s/.test(partialText_[counter])) {
        counter += inc;
      }

      if (inc > 0) {
        count = counter - count_;
      } else {
        count = -(counter - count_);
      }

      return {
        count: count
      };
    };

    var openTagParse = function openTagParse(args) {
      var parseObj = args.parseObj,
          partialText_ = args.partialText_;
      var startPos;
      var space0StartPos;
      var space0StopPos;
      var space1StartPos;
      var space1StopPos;
      var stopPos;
      stopPos = parseObj.i;

      switch (parseObj.tag) {
        case '{':
          stopPos++;
      }

      startPos = stopPos - 1;
      startPos -= parseObj.ctag.length;

      switch (parseObj.tag) {
        case '{':
          startPos--;
      }

      space1StopPos = startPos;
      startPos -= spacesCount({
        count_: startPos,
        inc: -1,
        partialText_: partialText_
      }).count;
      space1StartPos = startPos;
      startPos -= parseObj.n.length;
      space0StopPos = startPos;
      startPos -= spacesCount({
        count_: startPos,
        inc: -1,
        partialText_: partialText_
      }).count;
      space0StartPos = startPos;

      switch (parseObj.tag) {
        case '#':
        case '&':
        case '^':
        case '{':
          startPos -= parseObj.tag.length;
      }

      startPos -= parseObj.otag.length;
      startPos++;
      return {
        startPos: startPos,
        space0StartPos: space0StartPos,
        space0StopPos: space0StopPos,
        space1StartPos: space1StartPos,
        space1StopPos: space1StopPos,
        stopPos: stopPos
      };
    };

    var startOfTextEncode = function startOfTextEncode(args) {
      var openTagData = args.openTagData,
          parseObj = args.parseObj,
          partialText_ = args.partialText_;
      var space0StartPos = openTagData.space0StartPos,
          space0StopPos = openTagData.space0StopPos,
          space1StartPos = openTagData.space1StartPos,
          space1StopPos = openTagData.space1StopPos;
      var i;
      var partialText = '';
      i = parseObj.otag.length;

      while (i--) {
        partialText += "\x02";
        partialText = partialText.slice(0, -1) + 'Ü'; // For debugging.
      }

      switch (parseObj.tag) {
        case '#':
        case '&':
        case '^':
          partialText += parseObj.tag;
          break;

        case '{':
          partialText += '&';
          break;
      }

      i = space0StartPos;

      while (i < space0StopPos) {
        i++;
        partialText += partialText_[i];
      }

      partialText += parseObj.n;
      i = space1StartPos;

      while (i < space1StopPos) {
        i++;
        partialText += partialText_[i];
      }

      switch (parseObj.tag) {
        case '{':
          partialText += ' ';
      }

      i = parseObj.ctag.length;

      while (i--) {
        partialText += "\x03";
        partialText = partialText.slice(0, -1) + 'ü'; // For debugging.
      }

      return {
        partialText: partialText
      };
    };

    var closeTagParse = function closeTagParse(args) {
      var parseObj = args.parseObj,
          partialText_ = args.partialText_;
      var startPos;
      var space0StartPos;
      var space0StopPos;
      var space1StartPos;
      var space1StopPos;
      var stopPos;
      startPos = parseObj.end;
      stopPos = startPos;
      stopPos += parseObj.otag.length;
      stopPos += parseObj.tag.length;
      space0StartPos = stopPos;
      stopPos += spacesCount({
        count_: stopPos,
        inc: +1,
        partialText_: partialText_
      }).count;
      space0StopPos = stopPos;
      stopPos += parseObj.n.length;
      space1StartPos = stopPos;
      stopPos += spacesCount({
        count_: stopPos,
        inc: +1,
        partialText_: partialText_
      }).count;
      space1StopPos = stopPos;
      stopPos += parseObj.otag.length;
      return {
        startPos: startPos,
        space0StartPos: space0StartPos,
        space0StopPos: space0StopPos,
        space1StartPos: space1StartPos,
        space1StopPos: space1StopPos,
        stopPos: stopPos
      };
    };

    var endOfTextEncode = function endOfTextEncode(args) {
      var closeTagData = args.closeTagData,
          parseObj = args.parseObj,
          partialText_ = args.partialText_;
      var space0StartPos = closeTagData.space0StartPos,
          space0StopPos = closeTagData.space0StopPos,
          space1StartPos = closeTagData.space1StartPos,
          space1StopPos = closeTagData.space1StopPos;
      var i;
      var partialText = '';
      i = parseObj.otag.length;

      while (i--) {
        partialText += "\x02";
        partialText = partialText.slice(0, -1) + 'Ü'; // For debugging.
      }

      partialText += '/';
      i = space0StartPos;

      while (i < space0StopPos) {
        partialText += partialText_[i];
        i++;
      }

      partialText += parseObj.n;
      i = space1StartPos;

      while (i < space1StopPos) {
        partialText += partialText_[i];
        i++;
      }

      i = parseObj.ctag.length;

      while (i--) {
        partialText += "\x03";
        partialText = partialText.slice(0, -1) + 'ü'; // For debugging.
      }

      return {
        partialText: partialText
      };
    };

    var tagReplace = function tagReplace(args) {
      var parseObj = args.parseObj,
          partialText_ = args.partialText_;
      var otag = parseObj.otag;
      var ctag = parseObj.ctag;
      var partialText = '';

      switch (parseObj.tag) {
        case '#':
        case '$':
        case '&':
        case '<':
        case '^':
        case '_v':
        case '{':
          /* eslint-disable no-case-declarations */
          var openTagData = openTagParse({
            parseObj: parseObj,
            partialText_: partialText_
          });
          var startPos = openTagData.startPos;
          partialText += partialText_.substring(0, startPos);
          partialText += startOfTextEncode({
            openTagData: openTagData,
            parseObj: parseObj,
            partialText_: partialText_
          }).partialText;
          var closeTagData;
          /* eslint-enable no-case-declarations */

          switch (parseObj.tag) {
            case '#':
            case '$':
            case '&':
            case '<':
            case '^':
              closeTagData = closeTagParse({
                parseObj: parseObj,
                partialText_: partialText_
              });
          }

          if (!closeTagData) {
            partialText += partialText_.slice(openTagData.stopPos);
            break;
          }

          partialText += partialText_.substring(openTagData.stopPos, closeTagData.startPos);
          partialText += endOfTextEncode({
            closeTagData: closeTagData,
            parseObj: parseObj,
            partialText_: partialText_
          }).partialText;
          partialText += partialText_.slice(closeTagData.stopPos);
          break;
      }

      return {
        otag: otag,
        ctag: ctag,
        partialText: partialText
      };
    };
  }
}

PARAMS_APPLIER: {
  var paramsApplyByKeyArrays = function paramsApplyByKeyArrays(args) {
    var contextKeys = args.contextKeys,
        delimiterUnicodes_ = args.delimiterUnicodes_,
        tagParseVal = args.tagParseVal,
        paramKeys = args.paramKeys,
        parseObj = args.parseObj,
        parseObjKey = args.parseObjKey,
        partialText_ = args.partialText_;
    var delimiterUnicodes;
    var otag;
    var ctag;
    var partialText;

    if (parseObjKey === 'n' && (paramKeys.includes(tagParseVal) || !contextKeys.includes(tagParseVal))) {
      var _tagReplace = tagReplace({
        parseObj: parseObj,
        partialText_: partialText_
      });

      otag = _tagReplace.otag;
      ctag = _tagReplace.ctag;
      partialText = _tagReplace.partialText;
    } else if (parseObjKey === 'tag' && !delimiterUnicodes_) {
      otag = parseObj.otag;
      ctag = parseObj.ctag;
    }

    if (!delimiterUnicodes_ && otag && ctag) {
      delimiterUnicodes = '';

      for (var i = 0, l = otag.length; i < l; i++) {
        delimiterUnicodes += "\x02";
        delimiterUnicodes = delimiterUnicodes.slice(0, -1) + 'Ü'; // For debugging.
      }

      delimiterUnicodes += ' ';

      for (var _i = 0, _l = ctag.length; _i < _l; _i++) {
        delimiterUnicodes += "\x03";
        delimiterUnicodes = delimiterUnicodes.slice(0, -1) + 'ü'; // For debugging.
      }
    }

    return {
      delimiterUnicodes: delimiterUnicodes || delimiterUnicodes_,
      partialText: partialText || partialText_
    };
  };

  var paramsApplyToParseObj = function paramsApplyToParseObj(args) {
    var contextKeys = args.contextKeys,
        delimiterUnicodes_ = args.delimiterUnicodes_,
        paramKeys = args.paramKeys,
        paramsObj = args.paramsObj,
        parseObj = args.parseObj,
        parseObjKeysItr = args.parseObjKeysItr,
        parseObjKeysItrn = args.parseObjKeysItrn,
        partialText_ = args.partialText_;

    if (parseObjKeysItrn.done) {
      return {
        delimiterUnicodes: delimiterUnicodes_,
        partialText: partialText_
      };
    }

    var parseObjKey = parseObjKeysItrn.value;
    var tagParse = parseObj[parseObjKey];
    var partialText;
    var delimiterUnicodes;

    if (parseObjKey === 'nodes' && Array.isArray(tagParse)) {
      var paramsWithDotNotation = paramsObjDotNotationParse({
        paramsObjPart: paramsObj,
        parseObjTagName: parseObj.n
      });
      var dataKeys = [];
      var paramKeysNew;
      var paramsObjNew;

      if (paramsWithDotNotation instanceof Object) {
        var l = 1;

        if (Array.isArray(paramsWithDotNotation)) {
          l = paramsWithDotNotation.length;
        }

        for (var i = 0; i < l; i++) {
          if (Array.isArray(paramsWithDotNotation)) {
            // Recursion into an Array.
            paramsObjNew = paramsWithDotNotation[i];
          } else {
            // Recursion into a plain Object.
            paramsObjNew = paramsWithDotNotation;
          }

          var paramsObjKeys = Object.keys(paramsObjNew);

          if (paramsObjKeys.length) {
            var paramsObjShallowItr = void 0;
            var paramsObjShallowItrn = void 0;

            if (paramsObjKeys.length === 1) {
              paramsObjShallowItr = {
                next: function next() {
                  return {
                    done: true
                  };
                }
              };
              paramsObjShallowItrn = {
                value: paramsObjKeys[0]
              };
            } else {
              paramsObjShallowItr = paramsObjKeys[Symbol.iterator]();
              paramsObjShallowItrn = paramsObjShallowItr.next();
            }

            var _dataKeysCollect2 = dataKeysCollect({
              dataKeys_: [],
              dataObjShallowItr: paramsObjShallowItr,
              dataObjShallowItrn: paramsObjShallowItrn,
              dataObj: paramsObjNew,
              parentObjAsStr: '' //partialShort // For debugging.

            });

            dataKeys = _dataKeysCollect2.dataKeys;
          }
        }

        paramKeysNew = paramKeys.concat(dataKeys);
      } else {
        paramKeysNew = paramKeys;
        paramsObjNew = paramsObj;
      }

      if (tagParse.length) {
        var tagParseItr;
        var tagParseItrn;

        if (tagParse.length === 1) {
          tagParseItr = {
            next: function next() {
              return {
                done: true
              };
            }
          };
          tagParseItrn = {
            value: tagParse[0]
          };
        } else {
          tagParseItr = tagParse[Symbol.iterator]();
          tagParseItrn = tagParseItr.next();
        }

        var _paramsApply = paramsApply({
          // eslint-disable-line no-use-before-define
          contextKeys: contextKeys,
          paramKeys: paramKeysNew,
          paramsObj: paramsObjNew,
          partialParseItr: tagParseItr,
          partialParseItrn: tagParseItrn,
          //partialShort, // For debugging.
          partialText_: partialText_
        });

        delimiterUnicodes = _paramsApply.delimiterUnicodes;
        partialText = _paramsApply.partialText;
      }
    } else {
      var _paramsApplyByKeyArra = paramsApplyByKeyArrays({
        contextKeys: contextKeys,
        delimiterUnicodes_: delimiterUnicodes_,
        tagParseVal: tagParse,
        paramKeys: paramKeys,
        //paramsObj, // For debugging.
        parseObj: parseObj,
        parseObjKey: parseObjKey,
        //partialShort, // For debugging.
        partialText_: partialText_
      });

      delimiterUnicodes = _paramsApplyByKeyArra.delimiterUnicodes;
      partialText = _paramsApplyByKeyArra.partialText;
    }

    args.delimiterUnicodes_ = delimiterUnicodes || delimiterUnicodes_;
    args.parseObjKeysItrn = parseObjKeysItr.next();
    args.partialText_ = partialText || partialText_;
    return paramsApplyToParseObj(args);
  };

  var paramsApply = function paramsApply(args) {
    var contextKeys = args.contextKeys,
        delimiterUnicodes_ = args.delimiterUnicodes_,
        paramKeys = args.paramKeys,
        paramsObj = args.paramsObj,
        partialParseItr = args.partialParseItr,
        partialParseItrn = args.partialParseItrn,
        partialText_ = args.partialText_;

    if (partialParseItrn.done) {
      return {
        delimiterUnicodes: delimiterUnicodes_,
        partialText: partialText_
      };
    }

    var parseObj = partialParseItrn.value;
    var parseObjKeys = Object.keys(parseObj);
    var delimiterUnicodes;
    var partialText;

    if (parseObjKeys.length) {
      // At this point, parseObjKeys.length is always > 1.
      var parseObjKeysItr = parseObjKeys[Symbol.iterator]();
      var parseObjKeysItrn = parseObjKeysItr.next();

      var _paramsApplyToParseOb = paramsApplyToParseObj({
        contextKeys: contextKeys,
        delimiterUnicodes_: delimiterUnicodes_,
        paramKeys: paramKeys,
        paramsObj: paramsObj,
        parseObj: parseObj,
        parseObjKeysItr: parseObjKeysItr,
        parseObjKeysItrn: parseObjKeysItrn,
        //partialShort, // For debugging.
        partialText_: partialText_
      });

      delimiterUnicodes = _paramsApplyToParseOb.delimiterUnicodes;
      partialText = _paramsApplyToParseOb.partialText;
    }

    args.delimiterUnicodes_ = delimiterUnicodes || delimiterUnicodes_;
    args.partialParseItrn = partialParseItr.next();
    args.partialText_ = partialText || partialText_;
    return paramsApply(args);
  };

  var partialsWithParamsAdd = function partialsWithParamsAdd(args) {
    var compilation = args.compilation,
        contextKeys = args.contextKeys,
        partials = args.partials,
        partialsComp = args.partialsComp,
        partialsKeysItr = args.partialsKeysItr,
        partialsKeysItrn = args.partialsKeysItrn;

    if (partialsKeysItrn.done) {
      return {
        partials: partials,
        partialsComp: partialsComp
      };
    }

    var partialFull = compilation.partials[partialsKeysItrn.value].name;
    var styleModClasses;
    var styleModifierMatch;
    args.partialsKeysItrn = partialsKeysItr.next();

    if (partials[partialFull]) {
      return partialsWithParamsAdd(args);
    }

    var paramsMatch = partialFull.match(paramRegex);
    var paramsObj = {};
    var partialShort = partialFull;

    if (paramsMatch) {
      var paramsStr = paramsMatch[0];
      partialShort = partialFull.replace(paramsStr, '');

      var _styleModifierExtract = styleModifierExtract({
        partialName: partialShort
      });

      styleModClasses = _styleModifierExtract.styleModClasses;
      styleModifierMatch = _styleModifierExtract.styleModifierMatch;

      if (partialFull !== partialShort) {
        try {
          paramsObj = jsonEval("{".concat(paramsStr.slice(1, -1).trim(), "}"));
        } catch (err) {
          /* istanbul ignore next */
          console.error(err); // eslint-disable-line no-console

          /* istanbul ignore next */

          return partialsWithParamsAdd(args);
        }
        /* istanbul ignore if */


        if (!paramsObj || paramsObj.constructor !== Object) {
          return partialsWithParamsAdd(args);
        }
      }
    } else {
      var _styleModifierExtract2 = styleModifierExtract({
        partialName: partialFull
      });

      styleModClasses = _styleModifierExtract2.styleModClasses;
      styleModifierMatch = _styleModifierExtract2.styleModifierMatch;
    }

    if (styleModifierMatch) {
      partialShort = partialShort.replace(styleModifierMatch[0], '');
    }
    /* istanbul ignore if */


    if (partialShort === partialFull || !partials[partialShort]) {
      return partialsWithParamsAdd(args);
    }

    if (styleModClasses) {
      paramsObj.styleModifier = styleModClasses;
    }

    var paramsObjKeys = Object.keys(paramsObj);
    var dataKeys;

    if (paramsObjKeys.length) {
      var paramsObjShallowItr;
      var paramsObjShallowItrn;

      if (paramsObjKeys.length === 1) {
        paramsObjShallowItr = {
          next: function next() {
            return {
              done: true
            };
          }
        };
        paramsObjShallowItrn = {
          value: paramsObjKeys[0]
        };
      } else {
        paramsObjShallowItr = paramsObjKeys[Symbol.iterator]();
        paramsObjShallowItrn = paramsObjShallowItr.next();
      }

      var _dataKeysCollect3 = dataKeysCollect({
        dataKeys_: [],
        dataObjShallowItr: paramsObjShallowItr,
        dataObjShallowItrn: paramsObjShallowItrn,
        dataObj: paramsObj,
        parentObjAsStr: '' //partialShort // For debugging.

      });

      dataKeys = _dataKeysCollect3.dataKeys;
    }

    var paramKeys = dataKeys;
    var partialParseArr = partials[partialShort].parseArr || [];
    var partialText_ = partials[partialShort].text || '';
    var delimiterUnicodes;
    var partialText = '';

    if (partialParseArr.length) {
      var partialParseItr;
      var partialParseItrn;

      if (partialParseArr.length === 1) {
        partialParseItr = {
          next: function next() {
            return {
              done: true
            };
          }
        };
        partialParseItrn = {
          value: partialParseArr[0]
        };
      } else {
        partialParseItr = partialParseArr[Symbol.iterator]();
        partialParseItrn = partialParseItr.next();
      }

      var _paramsApply2 = paramsApply({
        contextKeys: contextKeys,
        paramKeys: paramKeys,
        paramsObj: paramsObj,
        partialParseItr: partialParseItr,
        partialParseItrn: partialParseItrn,
        //partialShort, // For debugging.
        partialText_: partialText_
      });

      delimiterUnicodes = _paramsApply2.delimiterUnicodes;
      partialText = _paramsApply2.partialText;
    }

    if (delimiterUnicodes && partialText !== partialText_) {
      var options = {
        delimiters: delimiterUnicodes
      };
      var partialScanNew = hogan.scan(partialText, delimiterUnicodes);
      var partialParseArrNew = hogan.parse(partialScanNew, partialText, options);
      var partialGeneration = hogan.generate(partialParseArrNew, partialText, options);
      partials[partialFull] = {
        text: partialGeneration.render(paramsObj),
        parseArr: partialParseArrNew
      };
      partialsComp[partialFull] = hogan.compile(partials[partialFull].text);
    }

    return partialsWithParamsAdd(args);
  };
}

METHODS: {
  var preProcessContextKeys = function preProcessContextKeys(context) {
    /* istanbul ignore if */
    if (!context) {
      return {};
    }

    var contextObjKeys = Object.keys(context);
    var dataKeys = [];

    if (contextObjKeys.length) {
      var dataObjShallowItr;
      var dataObjShallowItrn;

      if (contextObjKeys.length === 1) {
        dataObjShallowItr = {
          next: function next() {
            return {
              done: true
            };
          }
        };
        dataObjShallowItrn = {
          value: contextObjKeys[0]
        };
      } else {
        dataObjShallowItr = contextObjKeys[Symbol.iterator]();
        dataObjShallowItrn = dataObjShallowItr.next();
      }

      var _dataKeysCollect4 = dataKeysCollect({
        dataKeys_: [],
        dataObjShallowItr: dataObjShallowItr,
        dataObjShallowItrn: dataObjShallowItrn,
        dataObj: context,
        parentObjAsStr: ''
      });

      dataKeys = _dataKeysCollect4.dataKeys;
    }

    var contextKeys;

    if (dataKeys.length) {
      var contextKeysItr;
      var contextKeysItrn;

      if (dataKeys.length === 1) {
        contextKeysItr = {
          next: function next() {
            return {
              done: true
            };
          }
        };
        contextKeysItrn = {
          value: dataKeys[0]
        };
      } else {
        contextKeysItr = dataKeys.slice()[Symbol.iterator](); // Cloned so .next() doesn't recompute added values.

        contextKeysItrn = contextKeysItr.next();
      }

      var _contextKeysCollect = contextKeysCollect({
        contextKeys_: dataKeys,
        contextKeysItr: contextKeysItr,
        contextKeysItrn: contextKeysItrn
      });

      contextKeys = _contextKeysCollect.contextKeys;
    }

    return contextKeys;
  };

  var preProcessPartialParams = function preProcessPartialParams(text, compilation_, partials_, partialsComp_, contextKeys_, context) {
    var compilation = compilation_ || hogan.compile(text);
    var partialsKeys = Object.keys(compilation.partials);
    var contextKeys = contextKeys_ || this && this.contextKeys;

    var _contextKeys; // First, check if we still need to preprocess contextKeys because .render() was called statically.


    if (typeof contextKeys === 'undefined') {
      var hasParam = false;

      for (var i = 0, l = partialsKeys.length; i < l; i++) {
        var partialFull = compilation.partials[partialsKeys[i]].name;
        hasParam = paramRegex.test(partialFull) || partialFull.includes(':');

        if (hasParam) {
          break;
        }
      }

      if (hasParam) {
        contextKeys = _contextKeys = preProcessContextKeys(context);
      } else {
        contextKeys = [];
      }
    }

    var partials = partials_ || this.partials || {};
    var partialsComp = partialsComp_ || this.partialsComp || {};

    if (partialsKeys.length) {
      var partialsKeysItr;
      var partialsKeysItrn;

      if (partialsKeys.length === 1) {
        partialsKeysItr = {
          next: function next() {
            return {
              done: true
            };
          }
        };
        partialsKeysItrn = {
          value: partialsKeys[0]
        };
      } else {
        partialsKeysItr = partialsKeys[Symbol.iterator]();
        partialsKeysItrn = partialsKeysItr.next();
      }

      var _partialsWithParamsAd = partialsWithParamsAdd({
        compilation: compilation,
        contextKeys: contextKeys,
        partials: partials,
        partialsComp: partialsComp,
        partialsKeysItr: partialsKeysItr,
        partialsKeysItrn: partialsKeysItrn
      });

      partials = _partialsWithParamsAd.partials;
      partialsComp = _partialsWithParamsAd.partialsComp;
    }

    return {
      compilation: compilation,
      _contextKeys: _contextKeys,
      partials: partials,
      partialsComp: partialsComp
    };
  };

  var compile = function compile(text, options, partials_, partialsComp_, contextKeys_, context) {
    var compilation = hogan.compile(text, options);
    var contextKeys = contextKeys_ || this && this.contextKeys;

    var _contextKeys;

    var partials = partials_ || this.partials || {};
    var partialsComp = partialsComp_ || this.partialsComp || {}; // Remove any reference between partialsValues and partials object because we need to add to the partials object.
    // We therefore do not want to iterate on the partials object itself.

    var partialsValues = Object.values(partials); // Using for because .preProcessPartialParams() is an exposed non-recursive method that does not accept an iterator.

    for (var i = 0, l = partialsValues.length; i < l; i++) {
      var _preProcessPartialPar = preProcessPartialParams(partialsValues[i].text, partialsComp[i], partials, partialsComp, contextKeys, context);

      _contextKeys = _preProcessPartialPar._contextKeys;
      partials = _preProcessPartialPar.partials;
      partialsComp = _preProcessPartialPar.partialsComp;
    }

    if (_contextKeys) {
      contextKeys = _contextKeys;
    }

    var _preProcessPartialPar2 = preProcessPartialParams(text, compilation, partials, partialsComp, contextKeys, context);

    compilation = _preProcessPartialPar2.compilation;
    return compilation;
  };

  var registerPartial = function registerPartial(partialName, partialTemplate, partialComp_, partials_, partialsComp_) {
    var partials = partials_ || this.partials || {};
    var partialsComp = partialsComp_ || this.partialsComp || {};

    if (!partials[partialName]) {
      partials[partialName] = {
        text: partialTemplate,
        parseArr: hogan.parse(hogan.scan(partialTemplate))
      };
    }

    if (!partialsComp[partialName]) {
      var partialComp = partialComp_ || hogan.generate(partials[partialName].parseArr, partialTemplate, {});
      partialsComp[partialName] = partialComp;
    }

    return {
      partials: partials,
      partialsComp: partialsComp
    };
  }; // For simplicity's sake, the partials_ arg is documented to be a key-value object of strings.
  // Will get converted to an object of objects internally.


  var render = function render() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var context_ = arguments.length > 1 ? arguments[1] : undefined;
    var partials_ = arguments.length > 2 ? arguments[2] : undefined;
    var partialsComp_ = arguments.length > 3 ? arguments[3] : undefined;
    var contextKeys_ = arguments.length > 4 ? arguments[4] : undefined;
    var context = context_ || this.context || {};
    var contextKeys = contextKeys_ || this && this.contextKeys;
    var partials;
    var partialsComp = partialsComp_ || this.partialsComp || {};
    var partialsKeys;

    if (partials_ instanceof Object) {
      partials = {};
      partialsKeys = Object.keys(partials_);

      for (var i = 0, l = partialsKeys.length; i < l; i++) {
        var partialKey = partialsKeys[i];
        var partial = partials_[partialKey];

        if (partial instanceof Object) {
          partials[partialKey] = partial;
        } else if (typeof partial === 'string') {
          partials[partialKey] = {
            text: partial,
            parseArr: hogan.parse(hogan.scan(partial))
          };
        }
      }
    } else {
      partials = this.partials;
    }

    if (partials instanceof Object) {
      partialsKeys = Object.keys(partials); // Using for loop because .registerPartial() is an exposed non-recursive method that does not accept an iterator.

      for (var _i2 = 0, _l2 = partialsKeys.length; _i2 < _l2; _i2++) {
        var _partialKey = partialsKeys[_i2];

        if (!partialsComp[_partialKey]) {
          var _registerPartial = registerPartial(_partialKey, partials[_partialKey].text, null, partials, partialsComp);

          partials = _registerPartial.partials;
          partialsComp = _registerPartial.partialsComp;
        }
      }
    } else {
      partials = {};
    }

    var compilation;

    if (Object.keys(partialsComp).length) {
      compilation = compile(text, null, partials, partialsComp, contextKeys, context);
    } else {
      compilation = hogan.compile(text);
    }

    var partialsTexts = {};
    partialsKeys = Object.keys(partials);

    for (var _i3 = 0, _l3 = partialsKeys.length; _i3 < _l3; _i3++) {
      partialsTexts[partialsKeys[_i3]] = partials[partialsKeys[_i3]].text;
    }

    return compilation.render(context, partialsTexts, null, partialsComp);
  };

  var unregisterPartial = function unregisterPartial(partialKey, partials_, partialsComp_) {
    var partials = partials_ || this.partials || {};
    var partialsComp = partialsComp_ || this.partialsComp || {};
    delete partials[partialKey];
    delete partialsComp[partialKey];
    return {
      partials: partials,
      partialsComp: partialsComp
    };
  };
} // PREPARE FOR EXPORT.
// The partials arg is not documented, but ideally, it should be an object of objects.
// For simplicity's sake, we allow a key-value object of strings to be converted internally.


function Feplet(context, partials, partialsComp, contextKeys) {
  this.context = context || {};
  this.partials = {};
  this.partialsComp = partialsComp || {};
  this.contextKeys = contextKeys || preProcessContextKeys(this.context);

  if (partials instanceof Object) {
    var partialsKeys = Object.keys(partials);

    for (var i = 0, l = partialsKeys.length; i < l; i++) {
      var partialKey = partialsKeys[i];
      var partial = partials[partialKey];

      if (partial instanceof Object) {
        this.partials[partialKey] = partial;
      } else if (typeof partial === 'string') {
        this.partials[partialKey] = {
          text: partial,
          parseArr: hogan.parse(hogan.scan(partial))
        };
      }
    }
  }
} // STATIC METHODS.


Object.assign(Feplet, hogan); // hogan is not a class so the constructor does not get overridden.

Feplet.compile = compile;
Feplet.preProcessContextKeys = preProcessContextKeys;
Feplet.preProcessPartialParams = preProcessPartialParams;
Feplet.registerPartial = registerPartial;
Feplet.render = render;
Feplet.unregisterPartial = unregisterPartial; // INSTANCE METHODS.

Feplet.prototype.compile = compile;
Feplet.prototype.preProcessPartialParams = preProcessPartialParams;
Feplet.prototype.registerPartial = registerPartial;
Feplet.prototype.render = render;
Feplet.prototype.unregisterPartial = unregisterPartial;

if (typeof define === 'function') {
  define(function () {
    return Feplet;
  });
}
/* istanbul ignore next */
else if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
    window.Feplet = Feplet;
  }

module.exports = Feplet;
