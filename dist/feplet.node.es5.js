// This package embraces functional programming to the extent that JavaScript allows. The benefits are mainly
// theoretical and educational. Being able to think functionally will be extremely valuable when working in languages
// that *are* purely functional, or paradigms that are strongly functional.
// We'll try to retain an iteration-instead-of-recursion-where-doable branch for the purpose of comparing performance.
// Fortunately, the functional master branch performs strongly compared to the more imperative branch.
// Labeled block statements are used to organize functions into logical divisions. We could also achieve this by
// breaking this file into multiple files. However, we need to compile our code into ES5 consumable by less modern
// browsers. Given that this is a relatively small file, it is easier to keep the code in one file.
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var hogan = require('../lib/hogan.js/lib/hogan.js');

var jsonEval = require('json-eval');

var paramRegex = /\([\S\s]*\)/;

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
  }; // styleModifiers are DEPRECATED.
  // It appears that Pattern Lab has dropped documentation of styleModifiers.
  // @see {@link https://patternlab.io/docs/installing-pattern-lab/} (There appears to be no documentation index page.)
  // Even if Pattern Lab eventually reinstates documentation for styleModifiers, Fepper will REMOVE this functionality.


  var styleModifierExtract = function styleModifierExtract(args) {
    var partialName = args.partialName; // eslint-disable-next-line no-useless-escape

    var styleModifierMatch = partialName.match(/\:([\w\-\|]+)/);
    var styleModClasses;
    var styleModifierMatchNew;

    if (styleModifierMatch && styleModifierMatch[1]) {
      styleModClasses = styleModifierMatch[1].replace(/\|/g, ' ').trim();
      /* istanbul ignore else */

      if (styleModClasses) {
        styleModifierMatchNew = styleModifierMatch;
      } else {
        styleModifierMatchNew = null;
      }
    } else {
      styleModClasses = '';
      styleModifierMatchNew = styleModifierMatch;
    } // Because we search and replace structured object properties to shorten the file prior to minification, we cannot
    // use "styleModifier" or other function substrings as structured object property names. "styleModifier" is also
    // reserved as a property name on paramsObj. Using "styleModClasses" instead.


    return {
      styleModClasses: styleModClasses,
      styleModifierMatch: styleModifierMatchNew
    };
  }; // The \u0002 and \u0003 unicodes could be replaced with variables, but it is more clear what they are and what their
  // intent is if left as unicode. They are respectively Start of Text and End of Text characters. Their purpose is to
  // be temporary alternate tag delimiters.


  TAG_REPLACER: {
    var spacesCount = function spacesCount(args) {
      var count_ = args.count_,
          inc = args.inc,
          partialText_ = args.partialText_;

      var counter = function spacesCountInPartialText_(index) {
        if (/\s/.test(partialText_[index])) {
          return spacesCountInPartialText_(index + inc);
        } else {
          return index;
        }
      }(count_);

      var count;

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
      var stopPos;

      switch (parseObj.tag) {
        case '{':
          stopPos = parseObj.i + 1;
          break;

        default:
          stopPos = parseObj.i;
      }

      var space1StopPos;

      switch (parseObj.tag) {
        case '{':
          space1StopPos = stopPos - 1 - parseObj.ctag.length - 1;
          break;

        default:
          space1StopPos = stopPos - 1 - parseObj.ctag.length;
      }

      var spacesCount1 = spacesCount({
        count_: space1StopPos,
        inc: -1,
        partialText_: partialText_
      }).count;
      var space1StartPos = space1StopPos - spacesCount1;
      var space0StopPos = space1StartPos - parseObj.n.length;
      var spacesCount0 = spacesCount({
        count_: space0StopPos,
        inc: -1,
        partialText_: partialText_
      }).count;
      var space0StartPos = space0StopPos - spacesCount0;
      var startPos;

      switch (parseObj.tag) {
        case '#':
        case '&':
        case '^':
        case '{':
          startPos = space0StartPos - parseObj.tag.length - parseObj.otag.length + 1;
          break;

        default:
          startPos = space0StartPos - parseObj.otag.length + 1;
      }

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
      var partialTextArr = ["\x02".repeat(parseObj.otag.length)]; //partialTextArr[0] = '֍'.repeat(parseObj.otag.length); // For debugging.

      switch (parseObj.tag) {
        case '#':
        case '&':
        case '^':
          partialTextArr.push(parseObj.tag);
          break;

        case '{':
          partialTextArr.push('&');
          break;
      }

      partialTextArr.push(partialText_.slice(space0StartPos + 1, space0StopPos + 1));
      partialTextArr.push(parseObj.n);
      partialTextArr.push(partialText_.slice(space1StartPos + 1, space1StopPos + 1));

      switch (parseObj.tag) {
        case '{':
          partialTextArr.push(' ');
      }

      partialTextArr.push("\x03".repeat(parseObj.ctag.length)); //partialTextArr[partialTextArr.length - 1] = '֎'.repeat(parseObj.ctag.length); // For debugging.

      return {
        partialText: partialTextArr.join('')
      };
    };

    var closeTagParse = function closeTagParse(args) {
      var parseObj = args.parseObj,
          partialText_ = args.partialText_;
      var startPos = parseObj.end;
      var space0StartPos = startPos + parseObj.otag.length + parseObj.tag.length;
      var spacesCount0 = spacesCount({
        count_: space0StartPos,
        inc: +1,
        partialText_: partialText_
      }).count;
      var space0StopPos = space0StartPos + spacesCount0;
      var space1StartPos = space0StopPos + parseObj.n.length;
      var spacesCount1 = spacesCount({
        count_: space1StartPos,
        inc: +1,
        partialText_: partialText_
      }).count;
      var space1StopPos = space1StartPos + spacesCount1;
      var stopPos = space1StopPos + parseObj.otag.length;
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
      var partialTextArr = ["\x02".repeat(parseObj.otag.length)]; //partialTextArr[0] = '֍'.repeat(parseObj.otag.length); // For debugging.

      partialTextArr.push('/');
      partialTextArr.push(partialText_.slice(space0StartPos, space0StopPos));
      partialTextArr.push(parseObj.n);
      partialTextArr.push(partialText_.slice(space1StartPos, space1StopPos));
      partialTextArr.push("\x03".repeat(parseObj.ctag.length)); //partialTextArr[partialTextArr.length - 1] = '֎'.repeat(parseObj.ctag.length); // For debugging.

      return {
        partialText: partialTextArr.join('')
      };
    };

    var tagReplace = function tagReplace(args) {
      var parseObj = args.parseObj,
          partialText_ = args.partialText_;
      var otag = parseObj.otag;
      var ctag = parseObj.ctag;
      var partialText;

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
          var closeTagData;

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
            partialText = partialText_.substring(0, openTagData.startPos) + startOfTextEncode({
              openTagData: openTagData,
              parseObj: parseObj,
              partialText_: partialText_
            }).partialText + partialText_.slice(openTagData.stopPos);
            break;
          }

          partialText = partialText_.substring(0, openTagData.startPos) + startOfTextEncode({
            openTagData: openTagData,
            parseObj: parseObj,
            partialText_: partialText_
          }).partialText + partialText_.substring(openTagData.stopPos, closeTagData.startPos) + endOfTextEncode({
            closeTagData: closeTagData,
            parseObj: parseObj,
            partialText_: partialText_
          }).partialText + partialText_.slice(closeTagData.stopPos);
          break;
      }

      return {
        otag: otag,
        ctag: ctag,
        partialText: partialText || ''
      };
    };
  }
}

COLLECTORS: {
  var contextKeysCollect = function contextKeysCollect(args) {
    var contextKey = args.contextKey;
    var contextKeys = args.contextKeys;

    args.contextKeys = function dotSlice(dottedString, contextKeys_) {
      var dotIndex = dottedString.indexOf('.');
      var slicedString = dottedString.slice(dotIndex + 1);

      if (dotIndex > -1 && !contextKeys_.includes(slicedString)) {
        contextKeys_.push(slicedString);
        return dotSlice(slicedString, contextKeys_);
      } else {
        return contextKeys_;
      }
    }(contextKey, contextKeys);

    return args;
  };

  var dataKeysWithDotNotationAdd = function dataKeysWithDotNotationAdd(args) {
    var parentObjSplit = args.parentObjSplit,
        dataKeys = args.dataKeys;

    if (parentObjSplit.length) {
      parentObjSplit.reduce(function (dataKey_, itemNext) {
        var dataKey = dataKey_ + '.' + itemNext;

        if (!dataKeys.includes(dataKey)) {
          dataKeys.push(dataKey);
        }

        return dataKey;
      });
    }

    return {
      dataKeys: dataKeys
    };
  }; // Declaring with const effectively makes this function private to this block.


  var dataKeysGetFromDataObj = function dataKeysGetFromDataObj(dataObjItem, dataKeys_, addlArgs) {
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var dataObjNestedObj = addlArgs.dataObjNestedObj,
        dataKey = addlArgs.dataKey,
        parentObjAsStr = addlArgs.parentObjAsStr,
        partialShort = addlArgs.partialShort;
    var dataObjItemKeys = Object.keys(dataObjItem);
    var dataKeys;

    if (dataObjItemKeys.length) {
      var parentObjAsStrNew;

      if (Array.isArray(dataObjNestedObj)) {
        parentObjAsStrNew = parentObjAsStr + (parentObjAsStr ? ".".concat(dataKey, ".").concat(index) : "".concat(dataKey, ".").concat(index));
      } else {
        parentObjAsStrNew = parentObjAsStr + (parentObjAsStr ? ".".concat(dataKey) : dataKey);
      }

      var parentObjSplit = parentObjAsStrNew.split('.');

      var _dataKeysWithDotNotat = dataKeysWithDotNotationAdd({
        dataKeys: dataKeys_,
        parentObjSplit: parentObjSplit
      });

      dataKeys = _dataKeysWithDotNotat.dataKeys;

      var _this = this;

      var _dataObjItemKeys$redu = dataObjItemKeys.reduce(function (dataStructures, dataKey) {
        var dataKeys = dataStructures.dataKeys,
            dataObj = dataStructures.dataObj,
            parentObjAsStr = dataStructures.parentObjAsStr,
            partialShort = dataStructures.partialShort;

        var _dataKeysCollect$call = dataKeysCollect.call( // eslint-disable-line no-use-before-define
        _this, {
          dataKey: dataKey,
          dataKeys: dataKeys,
          dataObj: dataObj,
          parentObjAsStr: parentObjAsStr,
          partialShort: partialShort
        });

        dataKeys = _dataKeysCollect$call.dataKeys;
        return {
          dataKeys: dataKeys,
          dataObj: dataObj,
          parentObjAsStr: parentObjAsStr,
          partialShort: partialShort
        };
      }, {
        dataKeys: dataKeys,
        dataObj: dataObjItem,
        parentObjAsStr: parentObjAsStrNew,
        partialShort: partialShort
      });

      dataKeys = _dataObjItemKeys$redu.dataKeys;
    }

    return {
      dataKeys: dataKeys || dataKeys_
    };
  };

  var dataKeysCollect = function dataKeysCollect(args) {
    var dataKey = args.dataKey,
        dataObj = args.dataObj,
        parentObjAsStr = args.parentObjAsStr,
        partialShort = args.partialShort;
    var dataKeys = args.dataKeys;

    if (!dataKeys.includes(dataKey) && !parentObjAsStr) {
      dataKeys.push(dataKey);
    } // Recurse deeper into dataObj if this property is an instance of Object.


    if (dataObj[dataKey] instanceof Object) {
      var dataObjNestedObj = dataObj[dataKey];

      if (Array.isArray(dataObjNestedObj)) {
        if (dataObjNestedObj.length) {
          var _this = this;

          var _dataObjNestedObj$red = dataObjNestedObj.reduce(function (dataStructures, dataObjItem, index) {
            var dataKeys = dataStructures.dataKeys;

            var _dataKeysGetFromDataO = dataKeysGetFromDataObj.call(_this, dataObjItem, dataKeys, {
              dataObjNestedObj: dataObjNestedObj,
              dataKey: dataKey,
              parentObjAsStr: parentObjAsStr,
              partialShort: partialShort
            }, index);

            dataKeys = _dataKeysGetFromDataO.dataKeys;
            return {
              dataKeys: dataKeys
            };
          }, {
            dataKeys: dataKeys
          });

          dataKeys = _dataObjNestedObj$red.dataKeys;
        }
      } else {
        var _dataKeysGetFromDataO2 = dataKeysGetFromDataObj(dataObjNestedObj, dataKeys, {
          dataObjNestedObj: dataObjNestedObj,
          dataKey: dataKey,
          parentObjAsStr: parentObjAsStr,
          partialShort: partialShort
        });

        dataKeys = _dataKeysGetFromDataO2.dataKeys;
      }
    } else {
      var parentObjSplit = parentObjAsStr ? parentObjAsStr.split('.') : [];

      if (!parentObjSplit.includes(dataKey)) {
        parentObjSplit.push(dataKey);
      }

      var _dataKeysWithDotNotat2 = dataKeysWithDotNotationAdd({
        dataKeys: dataKeys,
        parentObjSplit: parentObjSplit
      });

      dataKeys = _dataKeysWithDotNotat2.dataKeys;
    }

    return args;
  };
}

PARAMS_APPLIER: {
  // Declaring with const effectively makes this function private to this block.
  var dataKeysGetFromParamsObj = function dataKeysGetFromParamsObj(paramsObj, dataKeys_) {
    var paramsObjKeys = Object.keys(paramsObj);
    var dataKeys;

    if (paramsObjKeys.length) {
      var _this = this;

      var _paramsObjKeys$reduce = paramsObjKeys.reduce(function (dataStructures, dataKey) {
        var dataKeys = dataStructures.dataKeys,
            dataObj = dataStructures.dataObj,
            parentObjAsStr = dataStructures.parentObjAsStr;

        var _dataKeysCollect$call2 = dataKeysCollect.call(_this, {
          dataKey: dataKey,
          dataKeys: dataKeys,
          dataObj: dataObj,
          parentObjAsStr: parentObjAsStr
        });

        dataKeys = _dataKeysCollect$call2.dataKeys;
        return {
          dataKeys: dataKeys,
          dataObj: dataObj,
          parentObjAsStr: parentObjAsStr
        };
      }, {
        dataKeys: dataKeys_,
        dataObj: paramsObj,
        parentObjAsStr: ''
      });

      dataKeys = _paramsObjKeys$reduce.dataKeys;
    }

    return {
      dataKeys: dataKeys || dataKeys_
    };
  };

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
      var delimiterOpen = "\x02".repeat(otag.length); //delimiterOpen = '֍'.repeat(otag.length); // For debugging.

      var delimiterClose = "\x03".repeat(ctag.length); //delimiterClose = '֎'.repeat(ctag.length); // For debugging.

      delimiterUnicodes = delimiterOpen + ' ' + delimiterClose;
    }

    return {
      delimiterUnicodes: delimiterUnicodes || delimiterUnicodes_,
      partialText: partialText || partialText_
    };
  };

  var paramsApply = function paramsApply(args) {
    var contextKeys = args.contextKeys,
        paramKeys = args.paramKeys,
        paramsObj = args.paramsObj,
        parseObj = args.parseObj;
    var delimiterUnicodes_ = args.delimiterUnicodes_,
        partialText = args.partialText;
    var parseObjKeys = Object.keys(parseObj);
    var delimiterUnicodes;

    if (parseObjKeys.length) {
      var _this = this;

      var _parseObjKeys$reduce = parseObjKeys.reduce(function (dataStructures, parseObjKey) {
        var contextKeys = dataStructures.contextKeys,
            paramKeys = dataStructures.paramKeys,
            paramsObj = dataStructures.paramsObj,
            parseObj = dataStructures.parseObj;
        var delimiterUnicodes = dataStructures.delimiterUnicodes,
            partialText = dataStructures.partialText;

        var _paramsApplyToParseOb = paramsApplyToParseObj.call( // eslint-disable-line no-use-before-define
        _this, {
          contextKeys: contextKeys,
          delimiterUnicodes_: delimiterUnicodes,
          paramKeys: paramKeys,
          paramsObj: paramsObj,
          parseObj: parseObj,
          parseObjKey: parseObjKey,
          partialText_: partialText
        });

        delimiterUnicodes = _paramsApplyToParseOb.delimiterUnicodes;
        partialText = _paramsApplyToParseOb.partialText;
        return {
          contextKeys: contextKeys,
          delimiterUnicodes: delimiterUnicodes,
          paramKeys: paramKeys,
          paramsObj: paramsObj,
          parseObj: parseObj,
          partialText: partialText
        };
      }, {
        contextKeys: contextKeys,
        delimiterUnicodes: delimiterUnicodes,
        paramKeys: paramKeys,
        paramsObj: paramsObj,
        parseObj: parseObj,
        partialText: partialText
      });

      delimiterUnicodes = _parseObjKeys$reduce.delimiterUnicodes;
      partialText = _parseObjKeys$reduce.partialText;
    }

    return {
      delimiterUnicodes: delimiterUnicodes || delimiterUnicodes_,
      partialText: partialText
    };
  };

  var paramsApplyToParseObj = function paramsApplyToParseObj(args) {
    var contextKeys = args.contextKeys,
        delimiterUnicodes_ = args.delimiterUnicodes_,
        paramKeys = args.paramKeys,
        paramsObj = args.paramsObj,
        parseObj = args.parseObj,
        parseObjKey = args.parseObjKey,
        partialText_ = args.partialText_;
    var tagParse = parseObj[parseObjKey];
    var partialText = partialText_;
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
        if (Array.isArray(paramsWithDotNotation)) {
          if (paramsWithDotNotation.length) {
            var _this = this;

            var _paramsWithDotNotatio = paramsWithDotNotation.reduce(function (dataStructures, dataObjItem) {
              var dataKeys = dataStructures.dataKeys;

              var _dataKeysGetFromParam = dataKeysGetFromParamsObj.call(_this, dataObjItem, dataKeys);

              dataKeys = _dataKeysGetFromParam.dataKeys;
              return {
                dataKeys: dataKeys
              };
            }, {
              dataKeys: dataKeys
            });

            dataKeys = _paramsWithDotNotatio.dataKeys;
          }
        } else {
          var _dataKeysGetFromParam2 = dataKeysGetFromParamsObj(paramsWithDotNotation, dataKeys);

          dataKeys = _dataKeysGetFromParam2.dataKeys;
        }

        paramsObjNew = paramsWithDotNotation;
        paramKeysNew = paramKeys.concat(dataKeys);
      } else {
        paramKeysNew = paramKeys;
        paramsObjNew = paramsObj;
      }

      if (tagParse.length) {
        var _this2 = this;

        var _tagParse$reduce = tagParse.reduce(function (dataStructures, parseObj) {
          var contextKeys = dataStructures.contextKeys,
              paramKeys = dataStructures.paramKeys,
              paramsObj = dataStructures.paramsObj;
          var delimiterUnicodes = dataStructures.delimiterUnicodes,
              partialText = dataStructures.partialText;

          var _paramsApply$call = paramsApply.call(_this2, {
            contextKeys: contextKeys,
            delimiterUnicodes_: delimiterUnicodes,
            paramKeys: paramKeys,
            paramsObj: paramsObj,
            parseObj: parseObj,
            partialText: partialText
          });

          delimiterUnicodes = _paramsApply$call.delimiterUnicodes;
          partialText = _paramsApply$call.partialText;
          return {
            contextKeys: contextKeys,
            delimiterUnicodes: delimiterUnicodes,
            paramKeys: paramKeys,
            paramsObj: paramsObj,
            partialText: partialText
          };
        }, {
          contextKeys: contextKeys,
          delimiterUnicodes: delimiterUnicodes_,
          paramKeys: paramKeysNew,
          paramsObj: paramsObjNew,
          partialText: partialText
        });

        delimiterUnicodes = _tagParse$reduce.delimiterUnicodes;
        partialText = _tagParse$reduce.partialText;
      }
    } else {
      var _paramsApplyByKeyArra = paramsApplyByKeyArrays({
        contextKeys: contextKeys,
        delimiterUnicodes_: delimiterUnicodes_,
        tagParseVal: tagParse,
        paramKeys: paramKeys,
        parseObj: parseObj,
        parseObjKey: parseObjKey,
        partialText_: partialText_
      });

      delimiterUnicodes = _paramsApplyByKeyArra.delimiterUnicodes;
      partialText = _paramsApplyByKeyArra.partialText;
    }

    return {
      delimiterUnicodes: delimiterUnicodes || delimiterUnicodes_,
      partialText: partialText || partialText_
    };
  };

  var partialsWithParamsAdd = function partialsWithParamsAdd(args) {
    var compilation = args.compilation,
        contextKeys = args.contextKeys,
        partials = args.partials,
        partialsComp = args.partialsComp,
        partialsKey = args.partialsKey,
        options = args.options;
    var partialFull = compilation.partials[partialsKey].name;
    var styleModClasses;
    var styleModifierMatch;

    if (partials[partialFull]) {
      return args;
    }

    var paramsMatch = partialFull.match(paramRegex);
    var paramsObj;
    var partialShort;

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

          return args;
        }
        /* istanbul ignore if */


        if (!paramsObj || paramsObj.constructor !== Object) {
          return args;
        }
      }
    } else {
      paramsObj = {};
      partialShort = partialFull;

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


    if (partialFull === partialShort || !partials[partialShort]) {
      return args;
    }

    if (styleModClasses) {
      paramsObj.styleModifier = styleModClasses;
    }

    var paramsObjKeys = Object.keys(paramsObj);
    var dataKeys;

    if (paramsObjKeys.length) {
      var _this = this;

      var _paramsObjKeys$reduce2 = paramsObjKeys.reduce(function (dataStructures, dataKey) {
        var dataKeys = dataStructures.dataKeys,
            dataObj = dataStructures.dataObj,
            parentObjAsStr = dataStructures.parentObjAsStr;

        var _dataKeysCollect$call3 = dataKeysCollect.call(_this, {
          dataKey: dataKey,
          dataKeys: dataKeys,
          dataObj: dataObj,
          parentObjAsStr: parentObjAsStr
        });

        dataKeys = _dataKeysCollect$call3.dataKeys;
        return {
          dataKeys: dataKeys,
          dataObj: dataObj,
          parentObjAsStr: parentObjAsStr
        };
      }, {
        dataKeys: [],
        dataObj: paramsObj,
        parentObjAsStr: ''
      });

      dataKeys = _paramsObjKeys$reduce2.dataKeys;
    }

    var paramKeys = dataKeys;
    var partialText_ = partials[partialShort] || '';
    var delimiterUnicodes;
    var partialParseArr;
    var partialText;

    if (partialsComp[partialShort].parseArr) {
      partialParseArr = partialsComp[partialShort].parseArr;
    } else {
      partialParseArr = [];
    }

    if (partialParseArr.length) {
      var _this3 = this;

      var _partialParseArr$redu = partialParseArr.reduce(function (dataStructures, parseObj) {
        var contextKeys = dataStructures.contextKeys,
            paramKeys = dataStructures.paramKeys,
            paramsObj = dataStructures.paramsObj;
        var delimiterUnicodes = dataStructures.delimiterUnicodes,
            partialText = dataStructures.partialText;

        var _paramsApply$call2 = paramsApply.call(_this3, {
          contextKeys: contextKeys,
          delimiterUnicodes_: delimiterUnicodes,
          paramKeys: paramKeys,
          paramsObj: paramsObj,
          parseObj: parseObj,
          partialText: partialText
        });

        delimiterUnicodes = _paramsApply$call2.delimiterUnicodes;
        partialText = _paramsApply$call2.partialText;
        return {
          contextKeys: contextKeys,
          delimiterUnicodes: delimiterUnicodes,
          paramKeys: paramKeys,
          paramsObj: paramsObj,
          partialText: partialText
        };
      }, {
        contextKeys: contextKeys,
        delimiterUnicodes: delimiterUnicodes,
        paramKeys: paramKeys,
        paramsObj: paramsObj,
        partialText: partialText_
      });

      delimiterUnicodes = _partialParseArr$redu.delimiterUnicodes;
      partialText = _partialParseArr$redu.partialText;
    } else {
      partialText = '';
    }

    if (delimiterUnicodes && partialText !== partialText_) {
      // First, render with unicode delimiters.
      var optionsWithUnicodes = Object.assign({
        delimiters: delimiterUnicodes
      }, options);
      var compilationWithUnicodes = hogan.generate(hogan.parse(hogan.scan(partialText, delimiterUnicodes), partialText, optionsWithUnicodes), partialText, optionsWithUnicodes);
      partials[partialFull] = compilationWithUnicodes.render(paramsObj);
    }

    if (partialFull !== partialShort && !partials[partialFull]) {
      partials[partialFull] = partials[partialShort];
    }

    if (delimiterUnicodes && partialText !== partialText_ || !Object.keys(partialsComp[partialFull]).length) {
      // Then, write to partialsComp with previous render as partial text and with regular delimiters and options.
      var parseArr = hogan.parse(hogan.scan(partials[partialFull], options.delimiters), partials[partialFull], options);
      partialsComp[partialFull] = {
        parseArr: parseArr,
        compilation: hogan.generate(parseArr, partials[partialFull], options)
      };
    }

    return args;
  };
}

METHODS: {
  var preProcessContextKeys = function preProcessContextKeys(context) {
    /* istanbul ignore if */
    if (!context) {
      return [];
    }

    var contextArgKeys = Object.keys(context);
    var dataKeys = [];

    if (contextArgKeys.length) {
      var _this = this;

      var _contextArgKeys$reduc = contextArgKeys.reduce(function (dataStructures, dataKey) {
        var dataKeys = dataStructures.dataKeys,
            dataObj = dataStructures.dataObj,
            parentObjAsStr = dataStructures.parentObjAsStr;

        var _dataKeysCollect$call4 = dataKeysCollect.call(_this, {
          dataKey: dataKey,
          dataKeys: dataKeys,
          dataObj: dataObj,
          parentObjAsStr: parentObjAsStr
        });

        dataKeys = _dataKeysCollect$call4.dataKeys;
        return {
          dataKeys: dataKeys,
          dataObj: dataObj,
          parentObjAsStr: parentObjAsStr
        };
      }, {
        dataKeys: dataKeys,
        dataObj: context,
        parentObjAsStr: ''
      });

      dataKeys = _contextArgKeys$reduc.dataKeys;
    }

    var contextKeys;

    if (dataKeys.length) {
      var _this4 = this;

      var _dataKeys$reduce = dataKeys.reduce(function (dataStructures, contextKey) {
        var contextKeys = dataStructures.contextKeys;

        var _contextKeysCollect$c = contextKeysCollect.call(_this4, {
          contextKey: contextKey,
          contextKeys: contextKeys
        });

        contextKeys = _contextKeysCollect$c.contextKeys;
        return {
          contextKeys: contextKeys
        };
      }, {
        contextKeys: dataKeys.slice()
      });

      contextKeys = _dataKeys$reduce.contextKeys;
    } else {
      contextKeys = [];
    }

    return contextKeys;
  };

  var preProcessPartialParams = function preProcessPartialParams(text, compilation_, partials_, partialsComp_, contextKeys_, context, options_) {
    var options = options_ || this.options || {};
    var compilation = compilation_ || hogan.compile(text, options);
    var partialsKeys = Object.keys(compilation.partials);
    var contextKeysOrig = contextKeys_ || this && this.contextKeys;
    var contextKeys;

    var _contextKeys; // First, check if we still need to preprocess contextKeys because .render() was called statically.


    if (typeof contextKeysOrig === 'undefined' && partialsKeys.length) {
      var hasParam = partialsKeys.reduce(function (acc, partialsKey) {
        var partialFull = compilation.partials[partialsKey].name;

        if (paramRegex.test(partialFull) || partialFull.includes(':')) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0);

      if (hasParam) {
        contextKeys = _contextKeys = preProcessContextKeys(context);
      } else {
        contextKeys = [];
      }
    } else {
      contextKeys = contextKeysOrig;
    }

    var partials = partials_ || this.partials || {};
    var partialsComp = partialsComp_ || this.partialsComp || {};

    if (partialsKeys.length) {
      var _this = this;

      partialsKeys.reduce(function (dataStructures, partialsKey) {
        var compilation = dataStructures.compilation,
            contextKeys = dataStructures.contextKeys,
            options = dataStructures.options;
        var partials = dataStructures.partials,
            partialsComp = dataStructures.partialsComp;

        var _partialsWithParamsAd = partialsWithParamsAdd.call(_this, {
          compilation: compilation,
          contextKeys: contextKeys,
          partials: partials,
          partialsComp: partialsComp,
          partialsKey: partialsKey,
          options: options
        });

        partials = _partialsWithParamsAd.partials;
        partialsComp = _partialsWithParamsAd.partialsComp;
        return {
          compilation: compilation,
          contextKeys: contextKeys,
          partials: partials,
          partialsComp: partialsComp,
          options: options
        };
      }, {
        compilation: compilation,
        contextKeys: contextKeys,
        partials: partials,
        partialsComp: partialsComp,
        options: options
      });
    }

    return {
      compilation: compilation,
      _contextKeys: _contextKeys,
      // Only defined if hasParam.
      partials: partials,
      partialsComp: partialsComp
    };
  };

  var compile = function compile(text, options_, partials_, partialsComp_, contextKeys_, context) {
    var options = options_ || this.options || {};
    var contextKeysOrig = contextKeys_ || this && this.contextKeys;

    var _contextKeys;

    var partials = partials_ || this.partials || {};
    var partialsComp = partialsComp_ || this.partialsComp || {};
    var partialsKeys = Object.keys(partials);

    if (partialsKeys.length) {
      var _this = this;

      var _partialsKeys$reduce = partialsKeys.reduce(function (dataStructures, partialsKey) {
        var context = dataStructures.context,
            contextKeys = dataStructures.contextKeys,
            options = dataStructures.options;
        var _contextKeys = dataStructures._contextKeys,
            partials = dataStructures.partials,
            partialsComp = dataStructures.partialsComp;

        var _preProcessPartialPar = preProcessPartialParams.call(_this, partials[partialsKey], partialsComp[partialsKey].compilation, partials, partialsComp, contextKeys, context, options);

        _contextKeys = _preProcessPartialPar._contextKeys;
        partials = _preProcessPartialPar.partials;
        partialsComp = _preProcessPartialPar.partialsComp;
        return {
          context: context,
          contextKeys: contextKeys,
          _contextKeys: _contextKeys,
          partials: partials,
          partialsComp: partialsComp,
          options: options
        };
      }, {
        context: context,
        contextKeys: contextKeysOrig,
        _contextKeys: _contextKeys,
        partials: partials,
        partialsComp: partialsComp,
        options: options
      });

      _contextKeys = _partialsKeys$reduce._contextKeys;
      partials = _partialsKeys$reduce.partials;
      partialsComp = _partialsKeys$reduce.partialsComp;
    }

    var contextKeys = _contextKeys || contextKeysOrig;
    var compilation = hogan.compile(text, options);

    var _preProcessPartialPar2 = preProcessPartialParams(text, compilation, partials, partialsComp, contextKeys, context, options);

    compilation = _preProcessPartialPar2.compilation;
    return compilation;
  };

  var registerPartial = function registerPartial(partialName, partialTemplate, partialComp_, partials_, partialsComp_, options_) {
    var partials = partials_ || this.partials || {};
    var partialsComp = partialsComp_ || this.partialsComp || {};
    var options = options_ || this.options || {};

    if (!partials[partialName]) {
      partials[partialName] = partialTemplate;
    }

    if (!partialsComp[partialName]) {
      if (partialComp_) {
        partialsComp[partialName] = partialComp_;
      } else {
        var parseArr = hogan.parse(hogan.scan(partialTemplate, options.delimiters));
        partialsComp[partialName] = {
          parseArr: parseArr,
          compilation: hogan.generate(parseArr, partialTemplate, options)
        };
      }
    }

    return {
      partials: partials,
      partialsComp: partialsComp
    };
  };

  var render = function render() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var context_ = arguments.length > 1 ? arguments[1] : undefined;
    var partials_ = arguments.length > 2 ? arguments[2] : undefined;
    var partialsComp_ = arguments.length > 3 ? arguments[3] : undefined;
    var contextKeys_ = arguments.length > 4 ? arguments[4] : undefined;
    var options_ = arguments.length > 5 ? arguments[5] : undefined;
    var context = context_ || this.context || {};
    var contextKeys = contextKeys_ || this && this.contextKeys;
    var options = options_ || this.options || {};
    var partials = partials_ || this.partials || {};
    var partialsComp = partialsComp_ || this.partialsComp || {};
    var partialsKeys = Object.keys(partials);

    if (partialsKeys.length) {
      var _this = this;

      var _partialsKeys$reduce2 = partialsKeys.reduce(function (dataStructures, partialsKey) {
        var partials = dataStructures.partials,
            partialsComp = dataStructures.partialsComp,
            options = dataStructures.options;
        return registerPartial.call(_this, partialsKey, partials[partialsKey], null, partials, partialsComp, options);
      }, {
        partials: partials,
        partialsComp: partialsComp,
        options: options
      });

      partials = _partialsKeys$reduce2.partials;
      partialsComp = _partialsKeys$reduce2.partialsComp;
    }

    var compilation;

    if (Object.keys(partialsComp).length) {
      compilation = compile(text, options, partials, partialsComp, contextKeys, context);
    } else {
      compilation = hogan.compile(text, options);
    }

    return compilation.render(context, partials, null, partialsComp);
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
}
/* PREPARE FOR EXPORT */


function Feplet(context, partials, partialsComp, contextKeys, options) {
  this.context = context || {};
  this.partials = partials || {};
  this.partialsComp = partialsComp || {};
  this.contextKeys = contextKeys || preProcessContextKeys(this.context);
  this.options = options || {};
}
/* STATIC METHODS */


Object.assign(Feplet, hogan); // hogan is not a class so the constructor does not get overridden.

Feplet.compile = compile;
Feplet.preProcessContextKeys = preProcessContextKeys;
Feplet.preProcessPartialParams = preProcessPartialParams;
Feplet.registerPartial = registerPartial;
Feplet.render = render;
Feplet.unregisterPartial = unregisterPartial;
/* INSTANCE METHODS */

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
