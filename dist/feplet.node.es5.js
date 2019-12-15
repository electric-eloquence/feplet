// The \u0002 and \u0003 unicodes could be replaced with variables, but it is more clear what they are and what their
// intent is if left as unicode. They are respectively Start of Text and End of Text characters. Their purpose is to be
// temporary alternate tag delimiters.
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var hogan = require('../lib/hogan.js/lib/hogan.js');

var jsonEval = require('json-eval');

var paramRegex = /\([\S\s]*\)/; // HELPER FUNCTIONS.

function contextKeysPreProcess(args) {
  var contextKeys = args.contextKeys;

  for (var _i = 0, _Object$keys = Object.keys(contextKeys); _i < _Object$keys.length; _i++) {
    var contextKey = _Object$keys[_i];

    /* istanbul ignore if */
    if (!contextKeys[contextKey]) {
      continue;
    }

    var contextKeySplit = contextKey.split('.');

    while (contextKeySplit.length > 1) {
      contextKeySplit.shift();
      var contextKeyNew = contextKeySplit.join('.');
      contextKeys[contextKeyNew] = true;
    }
  }

  return {
    contextKeys: contextKeys
  };
}

function getDotDelimitedProp(args) {
  var obj = args.obj,
      prop_ = args.prop_;
  var propSplit = prop_.split('.');
  var prop0 = propSplit.shift();
  var prop = propSplit.join('.');
  var value; // eslint-disable-next-line no-prototype-builtins

  if (obj.hasOwnProperty(prop0)) {
    var _value = obj[prop0];

    if (_value instanceof Object && prop.length) {
      value = getDotDelimitedProp({
        obj: _value,
        prop_: prop
      });
    } else {
      value = _value;
    }
  }

  return value;
}

function spacesCount(args) {
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
}

function openStartStopGet(args) {
  var parseObj = args.parseObj,
      partialText_ = args.partialText_;
  var openStart;
  var openSpace0Start;
  var openSpace0Stop;
  var openSpace1Start;
  var openSpace1Stop;
  var openStop;
  openStop = parseObj.i;

  switch (parseObj.tag) {
    case '{':
      openStop++;
  }

  openStart = openStop - 1;
  openStart -= parseObj.ctag.length;

  switch (parseObj.tag) {
    case '{':
      openStart--;
  }

  openSpace1Stop = openStart;
  openStart -= spacesCount({
    count_: openStart,
    inc: -1,
    partialText_: partialText_
  }).count;
  openSpace1Start = openStart;
  openStart -= parseObj.n.length;
  openSpace0Stop = openStart;
  openStart -= spacesCount({
    count_: openStart,
    inc: -1,
    partialText_: partialText_
  }).count;
  openSpace0Start = openStart;

  switch (parseObj.tag) {
    case '#':
    case '&':
    case '^':
    case '{':
      openStart -= parseObj.tag.length;
  }

  openStart -= parseObj.otag.length;
  openStart++;
  return {
    openStart: openStart,
    openSpace0Start: openSpace0Start,
    openSpace0Stop: openSpace0Stop,
    openSpace1Start: openSpace1Start,
    openSpace1Stop: openSpace1Stop,
    openStop: openStop
  };
}

function openTagBuild(args) {
  var openStartStop = args.openStartStop,
      parseObj = args.parseObj,
      partialText_ = args.partialText_;
  var openSpace0Start = openStartStop.openSpace0Start,
      openSpace0Stop = openStartStop.openSpace0Stop,
      openSpace1Start = openStartStop.openSpace1Start,
      openSpace1Stop = openStartStop.openSpace1Stop;
  var i;
  var partialText = '';
  i = parseObj.otag.length;

  while (i--) {
    partialText += "\x02"; //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
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

  i = openSpace0Start;

  while (i < openSpace0Stop) {
    i++;
    partialText += partialText_[i];
  }

  partialText += parseObj.n;
  i = openSpace1Start;

  while (i < openSpace1Stop) {
    i++;
    partialText += partialText_[i];
  }

  switch (parseObj.tag) {
    case '{':
      partialText += ' ';
  }

  i = parseObj.ctag.length;

  while (i--) {
    partialText += "\x03"; //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
  }

  return {
    partialText: partialText
  };
}

function closeStartStopGet(args) {
  var parseObj = args.parseObj,
      partialText_ = args.partialText_;
  var closeStart;
  var closeSpace0Start;
  var closeSpace0Stop;
  var closeSpace1Start;
  var closeSpace1Stop;
  var closeStop;
  closeStart = parseObj.end;
  closeStop = closeStart;
  closeStop += parseObj.otag.length;
  closeStop += parseObj.tag.length;
  closeSpace0Start = closeStop;
  closeStop += spacesCount({
    count_: closeStop,
    inc: +1,
    partialText_: partialText_
  }).count;
  closeSpace0Stop = closeStop;
  closeStop += parseObj.n.length;
  closeSpace1Start = closeStop;
  closeStop += spacesCount({
    count_: closeStop,
    inc: +1,
    partialText_: partialText_
  }).count;
  closeSpace1Stop = closeStop;
  closeStop += parseObj.otag.length;
  return {
    closeStart: closeStart,
    closeSpace0Start: closeSpace0Start,
    closeSpace0Stop: closeSpace0Stop,
    closeSpace1Start: closeSpace1Start,
    closeSpace1Stop: closeSpace1Stop,
    closeStop: closeStop
  };
}

function closeTagBuild(args) {
  var closeStartStop = args.closeStartStop,
      parseObj = args.parseObj,
      partialText_ = args.partialText_;
  var closeSpace0Start = closeStartStop.closeSpace0Start,
      closeSpace0Stop = closeStartStop.closeSpace0Stop,
      closeSpace1Start = closeStartStop.closeSpace1Start,
      closeSpace1Stop = closeStartStop.closeSpace1Stop;
  var i;
  var partialText = '';
  i = parseObj.otag.length;

  while (i--) {
    partialText += "\x02"; //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
  }

  partialText += '/';
  i = closeSpace0Start;

  while (i < closeSpace0Stop) {
    partialText += partialText_[i];
    i++;
  }

  partialText += parseObj.n;
  i = closeSpace1Start;

  while (i < closeSpace1Stop) {
    partialText += partialText_[i];
    i++;
  }

  i = parseObj.ctag.length;

  while (i--) {
    partialText += "\x03"; //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
  }

  return {
    partialText: partialText
  };
}

function dataKeysWithDotNotation(args) {
  var dataKeys = args.dataKeys,
      parentObjSplit = args.parentObjSplit;
  var i = 0;
  var itemNext;
  var dataKey = parentObjSplit[i]; // Using assigment as the condition for a while loop to avoid having to perform conditional check for starting a for
  // loop at index 1.

  while (itemNext = parentObjSplit[++i]) {
    // eslint-disable-line no-cond-assign
    dataKey += ".".concat(itemNext);
    dataKeys[dataKey] = true;
  }

  return {
    dataKeys: dataKeys
  };
}

function dataObjToDataKeysObj(args) {
  var dataKeys_ = args.dataKeys_,
      dataKeysShallowItrn = args.dataKeysShallowItrn,
      dataObj = args.dataObj,
      parentObjAsStr = args.parentObjAsStr;

  if (dataKeysShallowItrn.done) {
    return {
      dataKeys: dataKeys_
    };
  }

  var key = dataKeysShallowItrn.value;
  var dataKeys = dataKeys_;

  if (!parentObjAsStr) {
    dataKeys[key] = true;
  } // Recurse deeper into dataObj if this property is of type object.


  if (dataObj[key] && _typeof(dataObj[key]) === 'object') {
    var dataObjNestedObj = dataObj[key]; // Recursion into an Array.

    if (Array.isArray(dataObjNestedObj)) {
      for (var i = 0, l = dataObjNestedObj.length; i < l; i++) {
        var dataObjArrayItem = dataObjNestedObj[i];

        if (dataObjArrayItem && dataObjArrayItem.constructor === Object) {
          // Clone args object for recursion deeper into dataObj.
          var dataKeysDeeperItr = Object.keys(dataObjArrayItem)[Symbol.iterator]();
          var dataKeysDeeperItrn = dataKeysDeeperItr.next();
          var parentObjAsStrNew = parentObjAsStr;

          if (dataKeysDeeperItrn.value) {
            parentObjAsStrNew += parentObjAsStr ? ".".concat(key, ".").concat(i) : "".concat(key, ".").concat(i);
            var parentObjSplit = parentObjAsStrNew.split('.');

            var _dataKeysWithDotNotat = dataKeysWithDotNotation({
              dataKeys: dataKeys,
              parentObjSplit: parentObjSplit
            });

            dataKeys = _dataKeysWithDotNotat.dataKeys;
          }

          var argsDeeper = {
            dataKeys_: dataKeys,
            dataKeysShallowItr: dataKeysDeeperItr,
            dataKeysShallowItrn: dataKeysDeeperItrn,
            dataObj: dataObjArrayItem,
            parentObjAsStr: parentObjAsStrNew,
            partialShort: args.partialShort
          };

          var _dataObjToDataKeysObj = dataObjToDataKeysObj(argsDeeper);

          dataKeys = _dataObjToDataKeysObj.dataKeys;
        }
      }
    } // Recursion into a plain Object.
    else {
        // Clone args object for recursion deeper into dataObj.
        var _dataKeysDeeperItr = Object.keys(dataObjNestedObj)[Symbol.iterator]();

        var _dataKeysDeeperItrn = _dataKeysDeeperItr.next();

        var _parentObjAsStrNew = parentObjAsStr;

        if (_dataKeysDeeperItrn.value) {
          _parentObjAsStrNew += parentObjAsStr ? ".".concat(key) : key;

          var _parentObjSplit = _parentObjAsStrNew.split('.');

          var _dataKeysWithDotNotat2 = dataKeysWithDotNotation({
            dataKeys: dataKeys,
            parentObjSplit: _parentObjSplit
          });

          dataKeys = _dataKeysWithDotNotat2.dataKeys;
        }

        var _argsDeeper = {
          dataKeys_: dataKeys,
          dataKeysShallowItr: _dataKeysDeeperItr,
          dataKeysShallowItrn: _dataKeysDeeperItrn,
          dataObj: dataObjNestedObj,
          parentObjAsStr: _parentObjAsStrNew,
          partialShort: args.partialShort
        };

        var _dataObjToDataKeysObj2 = dataObjToDataKeysObj(_argsDeeper);

        dataKeys = _dataObjToDataKeysObj2.dataKeys;
      }
  } else {
    var _parentObjSplit2 = parentObjAsStr ? parentObjAsStr.split('.') : [];

    _parentObjSplit2.push(key);

    var _dataKeysWithDotNotat3 = dataKeysWithDotNotation({
      dataKeys: dataKeys,
      parentObjSplit: _parentObjSplit2
    });

    dataKeys = _dataKeysWithDotNotat3.dataKeys;
  }

  args.dataKeys_ = dataKeys;
  args.dataKeysShallowItrn = args.dataKeysShallowItr.next();
  return dataObjToDataKeysObj(args);
}

function styleModifierExtract(args) {
  var partialName = args.partialName; // eslint-disable-next-line no-useless-escape

  var styleModifierMatch = partialName.match(/\:([\w\-\|]+)/);
  var styleModClasses = '';

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
    styleModifierMatch: styleModifierMatch,
    styleModClasses: styleModClasses
  };
}

function tagReplace(args) {
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
      var openStartStop = openStartStopGet({
        parseObj: parseObj,
        partialText_: partialText_
      });
      var openStart = openStartStop.openStart;
      partialText += partialText_.substring(0, openStart);
      partialText += openTagBuild({
        openStartStop: openStartStop,
        parseObj: parseObj,
        partialText_: partialText_
      }).partialText;
      var closeStartStop;
      /* eslint-enable no-case-declarations */

      switch (parseObj.tag) {
        case '#':
        case '$':
        case '&':
        case '<':
        case '^':
          closeStartStop = closeStartStopGet({
            parseObj: parseObj,
            partialText_: partialText_
          });
      }

      if (!closeStartStop) {
        partialText += partialText_.slice(openStartStop.openStop);
        break;
      }

      partialText += partialText_.substring(openStartStop.openStop, closeStartStop.closeStart);
      partialText += closeTagBuild({
        closeStartStop: closeStartStop,
        parseObj: parseObj,
        partialText_: partialText_
      }).partialText;
      partialText += partialText_.slice(closeStartStop.closeStop);
      break;
  }

  return {
    otag: otag,
    ctag: ctag,
    partialText: partialText
  };
} // CORE FUNCTIONS.


function paramsApplyByKeyArrays(args) {
  var contextKeys = args.contextKeys,
      delimiters_ = args.delimiters_,
      tagParseVal = args.tagParseVal,
      paramKeys = args.paramKeys,
      parseObj = args.parseObj,
      parseObjKey = args.parseObjKey,
      partialText_ = args.partialText_;
  var delimiters;
  var otag;
  var ctag;
  var partialText;

  if (parseObjKey === 'n' && (paramKeys[tagParseVal] || !contextKeys[tagParseVal])) {
    var _tagReplace = tagReplace({
      parseObj: parseObj,
      partialText_: partialText_
    });

    otag = _tagReplace.otag;
    ctag = _tagReplace.ctag;
    partialText = _tagReplace.partialText;
  } else if (parseObjKey === 'tag' && !delimiters_) {
    otag = parseObj.otag;
    ctag = parseObj.ctag;
  }

  if (!delimiters_ && otag && ctag) {
    delimiters = '';

    for (var i = 0, l = otag.length; i < l; i++) {
      delimiters += "\x02"; //delimiters = delimiters.slice(0, -1) + 'u'; // For debugging.
    }

    delimiters += ' ';

    for (var _i2 = 0, _l = ctag.length; _i2 < _l; _i2++) {
      delimiters += "\x03"; //delimiters = delimiters.slice(0, -1) + 'u'; // For debugging.
    }
  }

  return {
    delimiters: delimiters || delimiters_,
    partialText: partialText || partialText_
  };
}

function paramsApplyToParseObj(args) {
  var contextKeys = args.contextKeys,
      delimiters_ = args.delimiters_,
      paramKeys = args.paramKeys,
      paramsObj = args.paramsObj,
      parseObj = args.parseObj,
      parseObjKeysItr = args.parseObjKeysItr,
      parseObjKeysItrn = args.parseObjKeysItrn,
      partialText_ = args.partialText_;

  if (parseObjKeysItrn.done) {
    return {
      delimiters: delimiters_,
      partialText: partialText_
    };
  }

  var parseObjKey = parseObjKeysItrn.value;
  var tagParse = parseObj[parseObjKey];
  var partialText;
  var delimiters;

  if (parseObjKey === 'nodes' && Array.isArray(tagParse)) {
    var tagParseItr = tagParse[Symbol.iterator]();
    var tagParseItrn = tagParseItr.next();
    var paramsObjNested = getDotDelimitedProp({
      obj: paramsObj,
      prop_: parseObj.n
    });
    var paramKeysNew;
    var paramsObjNew;

    if (paramsObjNested) {
      if (Array.isArray(paramsObjNested)) {
        paramKeysNew = paramKeys;

        for (var i = 0, l = paramsObjNested.length; i < l; i++) {
          paramsObjNew = paramsObjNested[i];
          var paramKeysShallowItr = Object.keys(paramsObjNew)[Symbol.iterator]();
          var paramKeysShallowItrn = paramKeysShallowItr.next();

          var _dataObjToDataKeysObj3 = dataObjToDataKeysObj({
            dataKeys_: {},
            dataKeysShallowItr: paramKeysShallowItr,
            dataKeysShallowItrn: paramKeysShallowItrn,
            dataObj: paramsObjNew,
            parentObjAsStr: '' //partialShort // For debugging.

          }),
              dataKeys = _dataObjToDataKeysObj3.dataKeys;

          Object.assign(paramKeysNew, dataKeys);
        }
      } else {
        paramsObjNew = paramsObjNested;

        var _paramKeysShallowItr = Object.keys(paramsObjNew)[Symbol.iterator]();

        var _paramKeysShallowItrn = _paramKeysShallowItr.next();

        var _dataObjToDataKeysObj4 = dataObjToDataKeysObj({
          dataKeys_: {},
          dataKeysShallowItr: _paramKeysShallowItr,
          dataKeysShallowItrn: _paramKeysShallowItrn,
          dataObj: paramsObjNew,
          parentObjAsStr: '' //partialShort // For debugging.

        }),
            _dataKeys = _dataObjToDataKeysObj4.dataKeys;

        paramKeysNew = Object.assign(paramKeys, _dataKeys);
      }
    } else {
      paramKeysNew = paramKeys;
      paramsObjNew = paramsObj;
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

    delimiters = _paramsApply.delimiters;
    partialText = _paramsApply.partialText;
  } else {
    var _paramsApplyByKeyArra = paramsApplyByKeyArrays({
      contextKeys: contextKeys,
      delimiters_: delimiters_,
      tagParseVal: tagParse,
      paramKeys: paramKeys,
      //paramsObj, // For debugging.
      parseObj: parseObj,
      parseObjKey: parseObjKey,
      //partialShort, // For debugging.
      partialText_: partialText_
    });

    delimiters = _paramsApplyByKeyArra.delimiters;
    partialText = _paramsApplyByKeyArra.partialText;
  }

  args.delimiters_ = delimiters || delimiters_;
  args.parseObjKeysItrn = parseObjKeysItr.next();
  args.partialText_ = partialText || partialText_;
  return paramsApplyToParseObj(args);
}

function paramsApply(args) {
  var contextKeys = args.contextKeys,
      delimiters_ = args.delimiters_,
      paramKeys = args.paramKeys,
      paramsObj = args.paramsObj,
      partialParseItr = args.partialParseItr,
      partialParseItrn = args.partialParseItrn,
      partialText_ = args.partialText_;

  if (partialParseItrn.done) {
    return {
      delimiters: delimiters_,
      partialText: partialText_
    };
  }

  var parseObj = partialParseItrn.value;
  var parseObjKeysItr = Object.keys(parseObj)[Symbol.iterator]();
  var parseObjKeysItrn = parseObjKeysItr.next();

  var _paramsApplyToParseOb = paramsApplyToParseObj({
    contextKeys: contextKeys,
    delimiters_: delimiters_,
    paramKeys: paramKeys,
    paramsObj: paramsObj,
    parseObj: parseObj,
    parseObjKeysItr: parseObjKeysItr,
    parseObjKeysItrn: parseObjKeysItrn,
    //partialShort, // For debugging.
    partialText_: partialText_
  }),
      delimiters = _paramsApplyToParseOb.delimiters,
      partialText = _paramsApplyToParseOb.partialText;

  args.delimiters_ = delimiters || delimiters_;
  args.partialParseItrn = partialParseItr.next();
  args.partialText_ = partialText || partialText_;
  return paramsApply(args);
} // REFERENCES FOR STATIC AND INSTANCE METHODS


function preProcessContextKeys(context) {
  /* istanbul ignore if */
  if (!context) {
    return {};
  }

  var dataKeysShallowItr = Object.keys(context)[Symbol.iterator]();
  var dataKeysShallowItrn = dataKeysShallowItr.next();

  var _dataObjToDataKeysObj5 = dataObjToDataKeysObj({
    dataKeys_: {},
    dataKeysShallowItr: dataKeysShallowItr,
    dataKeysShallowItrn: dataKeysShallowItrn,
    dataObj: context,
    parentObjAsStr: ''
  }),
      dataKeys = _dataObjToDataKeysObj5.dataKeys;

  var _contextKeysPreProces = contextKeysPreProcess({
    contextKeys: dataKeys
  }),
      contextKeys = _contextKeysPreProces.contextKeys;

  return contextKeys;
}

function preProcessPartialParams(text, compilation_, partials_, partialsComp_, contextKeys_, context) {
  var partials = partials_ || this.partials || {};
  var partialsComp = partialsComp_ || this.partialsComp || {};
  var contextKeys = contextKeys_ || this && this.contextKeys;

  var _contextKeys;

  var hasParam = false;
  var styleModClasses;
  var styleModifierMatch;
  var compilation = compilation_ || hogan.compile(text); // First, check if we still need to preprocess contextKeys because .render() was called statically.

  if (typeof contextKeys === 'undefined') {
    for (var _i3 = 0, _Object$keys2 = Object.keys(compilation.partials); _i3 < _Object$keys2.length; _i3++) {
      var i = _Object$keys2[_i3];
      var partialFull = compilation.partials[i].name;
      hasParam = paramRegex.test(partialFull) || partialFull.indexOf(':') > -1;

      if (hasParam) {
        break;
      }
    }

    if (hasParam) {
      contextKeys = _contextKeys = preProcessContextKeys(context);
    } else {
      contextKeys = {};
    }
  }

  for (var _i4 = 0, _Object$keys3 = Object.keys(compilation.partials); _i4 < _Object$keys3.length; _i4++) {
    var _i5 = _Object$keys3[_i4];
    var _partialFull = compilation.partials[_i5].name;

    if (partials[_partialFull]) {
      continue;
    }

    var paramsMatch = _partialFull.match(paramRegex);

    var paramsObj = void 0;
    var partialShort = _partialFull;

    if (paramsMatch) {
      var paramsStr = paramsMatch[0];
      partialShort = _partialFull.replace(paramsStr, '');

      var _styleModifierExtract = styleModifierExtract({
        partialName: partialShort
      });

      styleModifierMatch = _styleModifierExtract.styleModifierMatch;
      styleModClasses = _styleModifierExtract.styleModClasses;

      if (_partialFull !== partialShort) {
        try {
          paramsObj = jsonEval("{".concat(paramsStr.slice(1, -1).trim(), "}"));
        } catch (err) {
          /* istanbul ignore next */
          console.error(err); // eslint-disable-line no-console

          /* istanbul ignore next */

          continue;
        }
        /* istanbul ignore if */


        if (!paramsObj || paramsObj.constructor !== Object) {
          continue;
        }
      }
    } else {
      var _styleModifierExtract2 = styleModifierExtract({
        partialName: _partialFull
      });

      styleModifierMatch = _styleModifierExtract2.styleModifierMatch;
      styleModClasses = _styleModifierExtract2.styleModClasses;
    }

    if (styleModifierMatch) {
      partialShort = partialShort.replace(styleModifierMatch[0], '');
    }
    /* istanbul ignore if */


    if (partialShort === _partialFull) {
      continue;
    }

    paramsObj = paramsObj || {};

    if (styleModClasses) {
      paramsObj.styleModifier = styleModClasses;
    }

    var paramKeysShallowItr = Object.keys(paramsObj)[Symbol.iterator]();
    var paramKeysShallowItrn = paramKeysShallowItr.next();

    var _dataObjToDataKeysObj6 = dataObjToDataKeysObj({
      dataKeys_: {},
      dataKeysShallowItr: paramKeysShallowItr,
      dataKeysShallowItrn: paramKeysShallowItrn,
      dataObj: paramsObj,
      parentObjAsStr: '' //partialShort // For debugging.

    }),
        dataKeys = _dataObjToDataKeysObj6.dataKeys;

    var paramKeys = dataKeys;
    var partialText_ = partials[partialShort] || '';
    var partialScan = hogan.scan(partialText_);
    var partialParseArr = hogan.parse(partialScan);
    var partialParseItr = partialParseArr[Symbol.iterator]();
    var partialParseItrn = partialParseItr.next();

    var _paramsApply2 = paramsApply({
      contextKeys: contextKeys,
      paramKeys: paramKeys,
      paramsObj: paramsObj,
      partialParseItr: partialParseItr,
      partialParseItrn: partialParseItrn,
      //partialShort, // For debugging.
      partialText_: partialText_
    }),
        delimiters = _paramsApply2.delimiters,
        partialText = _paramsApply2.partialText;

    if (delimiters) {
      var options = {
        delimiters: delimiters
      };
      var partialScanNew = hogan.scan(partialText, delimiters);
      var partialParseArrNew = hogan.parse(partialScanNew, partialText, options);
      var partialGeneration = hogan.generate(partialParseArrNew, partialText, options);
      partials[_partialFull] = partialGeneration.render(paramsObj);
      partialsComp[_partialFull] = hogan.compile(partials[_partialFull]);
    } else {
      // Do not have nyc/istanbul ignore this.
      // Stay open to the possibility of testing this.
      partials[_partialFull] = partialText;
      partialsComp[_partialFull] = hogan.generate(partialParseArr, partialText, {});
    }
  }

  return {
    compilation: compilation,
    _contextKeys: _contextKeys,
    partials: partials,
    partialsComp: partialsComp
  };
} // Declared after preProcessPartialParams because compile is dependent on it.


function compile(text, options, partials_, partialsComp_, contextKeys_, context) {
  var compilation = hogan.compile(text, options);
  var contextKeys = contextKeys_ || this && this.contextKeys;

  var _contextKeys;

  var partials = partials_ || this.partials || {};
  var partialsComp = partialsComp_ || this.partialsComp || {}; // Remove any reference between partialsArr and partials object because we need to add to the partials object.
  // We therefore do not want to iterate on the partials object itself.

  var partialsArr = Object.values(partials);

  for (var i = 0, l = partialsArr.length; i < l; i++) {
    var partialText = partialsArr[i];

    var _preProcessPartialPar = preProcessPartialParams(partialText, partialsComp[i], partials, partialsComp, contextKeys, context);

    _contextKeys = _preProcessPartialPar._contextKeys;
  }

  if (_contextKeys) {
    contextKeys = _contextKeys;
  }

  var _preProcessPartialPar2 = preProcessPartialParams(text, compilation, partials, partialsComp, contextKeys, context);

  compilation = _preProcessPartialPar2.compilation;
  return compilation;
}

function registerPartial(name, partialTemplate, partialComp_, partials_, partialsComp_) {
  var partials = partials_ || this.partials || {};
  var partialsComp = partialsComp_ || this.partialsComp || {};

  if (!partials[name]) {
    partials[name] = partialTemplate;
  }

  if (!partialsComp[name]) {
    var partialComp = partialComp_ || hogan.compile(partialTemplate);
    partialsComp[name] = partialComp;
  }

  return {
    partials: partials,
    partialsComp: partialsComp
  };
}

function render() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var context_ = arguments.length > 1 ? arguments[1] : undefined;
  var partials_ = arguments.length > 2 ? arguments[2] : undefined;
  var partialsComp_ = arguments.length > 3 ? arguments[3] : undefined;
  var contextKeys_ = arguments.length > 4 ? arguments[4] : undefined;
  var context = context_ || this.context || {};
  var contextKeys = contextKeys_ || this && this.contextKeys;
  var partials = partials_ || this.partials || {};
  var partialsComp = partialsComp_ || this.partialsComp || {};

  for (var _i6 = 0, _Object$keys4 = Object.keys(partials); _i6 < _Object$keys4.length; _i6++) {
    var i = _Object$keys4[_i6];

    if (!partialsComp[i]) {
      var _registerPartial = registerPartial(i, partials[i], null, partials, partialsComp);

      partials = _registerPartial.partials;
      partialsComp = _registerPartial.partialsComp;
    }
  }

  var compilation;

  if (Object.keys(partialsComp).length) {
    compilation = compile(text, null, partials, partialsComp, contextKeys, context);
  } else {
    compilation = hogan.compile(text);
  }

  return compilation.render(context, partials, null, partialsComp);
}

function unregisterPartial(name, partials_, partialsComp_) {
  var partials = partials_ || this.partials || {};
  var partialsComp = partialsComp_ || this.partialsComp || {};
  delete partials[name];
  delete partialsComp[name];
  return {
    partials: partials,
    partialsComp: partialsComp
  };
} // PREPARE FOR EXPORT.


function Feplet(context, partials, partialsComp, contextKeys) {
  this.context = context || {};
  this.partials = partials || {};
  this.partialsComp = partialsComp || {};
  this.contextKeys = contextKeys || preProcessContextKeys(this.context);
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
