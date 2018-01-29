'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var hogan = require('hogan.js');
var jsonEval = require('json-eval');

// HELPER FUNCTIONS.

function getDotDelimitedProp(args) {
  var obj = args.obj,
      prop_ = args.prop_;


  var propSplit = prop_.split('.');
  var prop0 = propSplit.shift();
  var prop = propSplit.join('.');

  var value = void 0;

  if (obj.hasOwnProperty(prop0)) {
    var _value = obj[prop0];

    if (_value && _value instanceof Object && prop.length) {
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


  var count = void 0;
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


  var openStart = void 0;
  var openSpace0Start = void 0;
  var openSpace0Stop = void 0;
  var openSpace1Start = void 0;
  var openSpace1Stop = void 0;
  var openStop = void 0;

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
  openStart -= spacesCount({ count_: openStart, inc: -1, partialText_: partialText_ }).count;
  openSpace1Start = openStart;
  openStart -= parseObj.n.length;
  openSpace0Stop = openStart;
  openStart -= spacesCount({ count_: openStart, inc: -1, partialText_: partialText_ }).count;
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

  var i = void 0;
  var partialText = '';

  i = parseObj.otag.length;

  while (i--) {
    partialText += '\x02';
    //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
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
    partialText += '\x03';
    //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
  }

  return {
    partialText: partialText
  };
}

function closeStartStopGet(args) {
  var parseObj = args.parseObj,
      partialText_ = args.partialText_;


  var closeStart = void 0;
  var closeSpace0Start = void 0;
  var closeSpace0Stop = void 0;
  var closeSpace1Start = void 0;
  var closeSpace1Stop = void 0;
  var closeStop = void 0;

  closeStart = parseObj.end;
  closeStop = closeStart;
  closeStop += parseObj.otag.length;
  closeStop += parseObj.tag.length;
  closeSpace0Start = closeStop;
  closeStop += spacesCount({ count_: closeStop, inc: +1, partialText_: partialText_ }).count;
  closeSpace0Stop = closeStop;
  closeStop += parseObj.n.length;
  closeSpace1Start = closeStop;
  closeStop += spacesCount({ count_: closeStop, inc: +1, partialText_: partialText_ }).count;
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

  var i = void 0;
  var partialText = '';

  i = parseObj.otag.length;

  while (i--) {
    partialText += '\x02';
    //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
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
    partialText += '\x03';
    //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
  }

  return {
    partialText: partialText
  };
}

function paramKeysWithDotNotation(args) {
  var paramKeysArr = args.paramKeysArr,
      parentObjSplit = args.parentObjSplit;


  var i = 0;
  var itemNext = void 0;
  var paramKey = parentObjSplit[i];

  // Using assigment as the condition for a while loop to avoid having to perform conditional check for starting a for
  // loop at index 1.
  while (itemNext = parentObjSplit[++i]) {
    // eslint-disable-line no-cond-assign
    paramKey += '.' + itemNext;

    if (paramKeysArr.indexOf(paramKey) === -1) {
      paramKeysArr.push(paramKey);
    }
  }

  return { paramKeysArr: paramKeysArr };
}

function paramsObjToParamKeysArr(args) {
  var paramKeysArr_ = args.paramKeysArr_,
      paramKeysShallowItrn = args.paramKeysShallowItrn,
      paramsObj = args.paramsObj,
      parentObjAsStr = args.parentObjAsStr;


  if (paramKeysShallowItrn.done) {
    return {
      paramKeysArr: paramKeysArr_
    };
  }

  var key = paramKeysShallowItrn.value;

  var paramKeysArr = paramKeysArr_;

  // paramKeysArr_ should only contain unique keys.
  if (!parentObjAsStr && !paramKeysArr.includes(key)) {
    paramKeysArr.push(key);
  }

  // Recurse deeper into paramsObj if this property is of type object.
  if (paramsObj[key] && _typeof(paramsObj[key]) === 'object') {
    var paramsObjNestedObj = paramsObj[key];

    // Recursion into an Array.
    if (Array.isArray(paramsObjNestedObj)) {
      for (var i = 0, l = paramsObjNestedObj.length; i < l; i++) {
        var paramsObjArrayItem = paramsObjNestedObj[i];

        if (paramsObjArrayItem && paramsObjArrayItem.constructor === Object) {
          // Clone args object for recursion deeper into paramsObj.
          var paramKeysDeeperItr = Object.keys(paramsObjArrayItem)[Symbol.iterator]();
          var paramKeysDeeperItrn = paramKeysDeeperItr.next();

          var parentObjAsStrNew = parentObjAsStr;

          if (paramKeysDeeperItrn.value) {
            parentObjAsStrNew += parentObjAsStr ? '.' + key + '.' + i : key + '.' + i;

            var parentObjSplit = parentObjAsStrNew.split('.');

            var _paramKeysWithDotNota = paramKeysWithDotNotation({ paramKeysArr: paramKeysArr, parentObjSplit: parentObjSplit });

            paramKeysArr = _paramKeysWithDotNota.paramKeysArr;
          }

          var argsDeeper = {
            paramKeysArr_: paramKeysArr,
            paramKeysShallowItr: paramKeysDeeperItr,
            paramKeysShallowItrn: paramKeysDeeperItrn,
            paramsObj: paramsObjArrayItem,
            parentObjAsStr: parentObjAsStrNew,
            partialShort: args.partialShort
          };

          var _paramsObjToParamKeys = paramsObjToParamKeysArr(argsDeeper);

          paramKeysArr = _paramsObjToParamKeys.paramKeysArr;
        }
      }
    }
    // Recursion into a plain Object.
    else {
        // Clone args object for recursion deeper into paramsObj.
        var _paramKeysDeeperItr = Object.keys(paramsObjNestedObj)[Symbol.iterator]();
        var _paramKeysDeeperItrn = _paramKeysDeeperItr.next();

        var _parentObjAsStrNew = parentObjAsStr;

        if (_paramKeysDeeperItrn.value) {
          _parentObjAsStrNew += parentObjAsStr ? '.' + key : key;

          var _parentObjSplit = _parentObjAsStrNew.split('.');

          var _paramKeysWithDotNota2 = paramKeysWithDotNotation({ paramKeysArr: paramKeysArr, parentObjSplit: _parentObjSplit });

          paramKeysArr = _paramKeysWithDotNota2.paramKeysArr;
        }

        var _argsDeeper = {
          paramKeysArr_: paramKeysArr,
          paramKeysShallowItr: _paramKeysDeeperItr,
          paramKeysShallowItrn: _paramKeysDeeperItrn,
          paramsObj: paramsObjNestedObj,
          parentObjAsStr: _parentObjAsStrNew,
          partialShort: args.partialShort
        };

        var _paramsObjToParamKeys2 = paramsObjToParamKeysArr(_argsDeeper);

        paramKeysArr = _paramsObjToParamKeys2.paramKeysArr;
      }
  } else {
    var _parentObjSplit2 = parentObjAsStr ? parentObjAsStr.split('.') : [];

    _parentObjSplit2.push(key);

    var _paramKeysWithDotNota3 = paramKeysWithDotNotation({ paramKeysArr: paramKeysArr, parentObjSplit: _parentObjSplit2 });

    paramKeysArr = _paramKeysWithDotNota3.paramKeysArr;
  }

  args.paramKeysArr_ = paramKeysArr;
  args.paramKeysShallowItrn = args.paramKeysShallowItr.next();

  return paramsObjToParamKeysArr(args);
}

function styleModifierExtract(args) {
  var partialName = args.partialName;


  var styleModifierMatch = partialName.match(/\:([\w\-\|]+)/);
  var styleModifier = '';

  if (styleModifierMatch && styleModifierMatch[1]) {
    styleModifier = styleModifierMatch[1].replace(/\|/g, ' ').trim();

    if (!styleModifier) {
      styleModifierMatch = null;
    }
  }

  return {
    styleModifierMatch: styleModifierMatch,
    styleModifier: styleModifier
  };
}

function tagReplace(args) {
  var parseObj = args.parseObj,
      partialText_ = args.partialText_;


  var otag = parseObj.otag;
  var ctag = parseObj.ctag;

  var partialText = '';

  switch (parseObj.tag) {
    case '!':
    case '#':
    case '$':
    case '&':
    case '<':
    case '^':
    case '_v':
    case '{':
      // eslint-disable-line no-case-declarations

      var openStartStop = openStartStopGet({ parseObj: parseObj, partialText_: partialText_ });
      var openStart = openStartStop.openStart;


      partialText += partialText_.substring(0, openStart);
      partialText += openTagBuild({ openStartStop: openStartStop, parseObj: parseObj, partialText_: partialText_ }).partialText;

      var closeStartStop = void 0;

      switch (parseObj.tag) {
        case '#':
        case '$':
        case '&':
        case '<':
        case '^':
          closeStartStop = closeStartStopGet({ parseObj: parseObj, partialText_: partialText_ });
      }

      if (!closeStartStop) {
        partialText += partialText_.slice(openStartStop.openStop);

        break;
      }

      partialText += partialText_.substring(openStartStop.openStop, closeStartStop.closeStart);
      partialText += closeTagBuild({ closeStartStop: closeStartStop, parseObj: parseObj, partialText_: partialText_ }).partialText;
      partialText += partialText_.slice(closeStartStop.closeStop);

      break;
  }

  return {
    otag: otag,
    ctag: ctag,
    partialText: partialText
  };
}

// CORE FUNCTIONS.

function paramsApplyByParamKey(args) {
  var delimiters_ = args.delimiters_,
      elementParse = args.elementParse,
      paramKeysItr = args.paramKeysItr,
      paramKeysItrn = args.paramKeysItrn,
      parseObj = args.parseObj,
      parseObjKey = args.parseObjKey,
      partialText_ = args.partialText_;


  if (paramKeysItrn.done) {
    return {
      delimiters: delimiters_,
      partialText: partialText_
    };
  }

  var paramKey = paramKeysItrn.value;

  var delimiters = void 0;
  var otag = void 0;
  var ctag = void 0;
  var partialText = void 0;

  if (parseObjKey === 'n') {
    if (elementParse === paramKey) {
      var _tagReplace = tagReplace({
        parseObj: parseObj,
        partialText_: partialText_
      });

      otag = _tagReplace.otag;
      ctag = _tagReplace.ctag;
      partialText = _tagReplace.partialText;
    }
  } else if (parseObjKey === 'tag' && !delimiters_) {
    otag = parseObj.otag;
    ctag = parseObj.ctag;
  }

  if (!delimiters_ && otag && ctag) {
    delimiters = '';

    for (var i = 0, l = otag.length; i < l; i++) {
      delimiters += '\x02';
      //delimiters = delimiters.slice(0, -1) + 'u'; // For debugging.
    }

    delimiters += ' ';

    for (var _i = 0, _l = ctag.length; _i < _l; _i++) {
      delimiters += '\x03';
      //delimiters = delimiters.slice(0, -1) + 'u'; // For debugging.
    }
  }

  args.delimiters_ = delimiters || delimiters_;
  args.paramKeysItrn = paramKeysItr.next();
  args.partialText_ = partialText || partialText_;

  return paramsApplyByParamKey(args);
}

function paramsApplyToParseObj(args) {
  var delimiters_ = args.delimiters_,
      paramKeysArr = args.paramKeysArr,
      paramsObj = args.paramsObj,
      parseObj = args.parseObj,
      parseObjKeysItr = args.parseObjKeysItr,
      parseObjKeysItrn = args.parseObjKeysItrn,
      partialShort = args.partialShort,
      partialText_ = args.partialText_;


  if (parseObjKeysItrn.done) {
    return {
      delimiters: delimiters_,
      partialText: partialText_
    };
  }

  var parseObjKey = parseObjKeysItrn.value;
  var elementParse = parseObj[parseObjKey];

  var partialText = void 0;
  var delimiters = void 0;

  if (parseObjKey === 'nodes' && Array.isArray(elementParse)) {
    var elementParseItr = elementParse[Symbol.iterator]();
    var elementParseItrn = elementParseItr.next();
    var paramsObjNested = getDotDelimitedProp({
      obj: paramsObj,
      prop_: parseObj.n
    });

    var paramKeysNew = void 0;
    var paramsObjNew = void 0;

    if (paramsObjNested) {
      if (Array.isArray(paramsObjNested)) {
        paramKeysNew = paramKeysArr;

        for (var i = 0, l = paramsObjNested.length; i < l; i++) {
          paramsObjNew = paramsObjNested[i];

          var paramKeysShallowItr = Object.keys(paramsObjNew)[Symbol.iterator]();
          var paramKeysShallowItrn = paramKeysShallowItr.next();
          var paramKeysNewObj = paramsObjToParamKeysArr({
            paramKeysArr_: [],
            paramKeysShallowItr: paramKeysShallowItr,
            paramKeysShallowItrn: paramKeysShallowItrn,
            paramsObj: paramsObjNew,
            parentObjAsStr: '',
            partialShort: partialShort // For debugging.
          });

          paramKeysNew = paramKeysNew.concat(paramKeysNewObj.paramKeysArr);
        }
      } else {
        paramsObjNew = paramsObjNested;

        var _paramKeysShallowItr = Object.keys(paramsObjNew)[Symbol.iterator]();
        var _paramKeysShallowItrn = _paramKeysShallowItr.next();
        var _paramKeysNewObj = paramsObjToParamKeysArr({
          paramKeysArr_: [],
          paramKeysShallowItr: _paramKeysShallowItr,
          paramKeysShallowItrn: _paramKeysShallowItrn,
          paramsObj: paramsObjNew,
          parentObjAsStr: '',
          partialShort: partialShort // For debugging.
        });

        paramKeysNew = paramKeysArr.concat(_paramKeysNewObj.paramKeysArr);
      }
    } else {
      paramKeysNew = paramKeysArr;
      paramsObjNew = paramsObj;
    }

    var _paramsApply = paramsApply({
      paramKeysArr: paramKeysNew,
      paramsObj: paramsObjNew,
      partialParseItr: elementParseItr,
      partialParseItrn: elementParseItrn,
      partialShort: partialShort, // For debugging.
      partialText_: partialText_
    });

    delimiters = _paramsApply.delimiters;
    partialText = _paramsApply.partialText;
  } else {
    var paramKeysItr = paramKeysArr[Symbol.iterator]();
    var paramKeysItrn = paramKeysItr.next();

    var _paramsApplyByParamKe = paramsApplyByParamKey({
      delimiters_: delimiters_,
      elementParse: elementParse,
      paramKeysItr: paramKeysItr,
      paramKeysItrn: paramKeysItrn,
      paramsObj: paramsObj, // For debugging.
      parseObj: parseObj,
      parseObjKey: parseObjKey,
      partialShort: partialShort, // For debugging.
      partialText_: partialText_
    });

    delimiters = _paramsApplyByParamKe.delimiters;
    partialText = _paramsApplyByParamKe.partialText;
  }

  args.delimiters_ = delimiters || delimiters_;
  args.parseObjKeysItrn = parseObjKeysItr.next();
  args.partialText_ = partialText || partialText_;

  return paramsApplyToParseObj(args);
}

function paramsApply(args) {
  var delimiters_ = args.delimiters_,
      paramKeysArr = args.paramKeysArr,
      paramsObj = args.paramsObj,
      partialParseItr = args.partialParseItr,
      partialParseItrn = args.partialParseItrn,
      partialShort = args.partialShort,
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
    delimiters_: delimiters_,
    paramKeysArr: paramKeysArr,
    paramsObj: paramsObj,
    parseObj: parseObj,
    parseObjKeysItr: parseObjKeysItr,
    parseObjKeysItrn: parseObjKeysItrn,
    partialShort: partialShort, // For debugging.
    partialText_: partialText_
  }),
      delimiters = _paramsApplyToParseOb.delimiters,
      partialText = _paramsApplyToParseOb.partialText;

  args.delimiters_ = delimiters || delimiters_;
  args.partialParseItrn = partialParseItr.next();
  args.partialText_ = partialText || partialText_;

  return paramsApply(args);
}

// PREPARE FOR EXPORT.

var feplet = Object.assign({}, hogan);

feplet.preprocessPartialParams = function (template, partials) {
  var generated = hogan.compile(template);

  for (var i in generated.partials) {
    if (!generated.partials.hasOwnProperty(i)) {
      continue;
    }

    var partialFull = generated.partials[i].name;

    if (partials[partialFull]) {
      continue;
    }

    var paramsMatch = partialFull.match(/\([\S\s]*\)/);

    var paramsObj = void 0;
    var partialShort = partialFull;
    var styleModifierMatch = void 0;
    var styleModifier = void 0;

    if (paramsMatch) {
      var paramsStr = paramsMatch[0];

      partialShort = partialFull.replace(paramsStr, '');

      var _styleModifierExtract = styleModifierExtract({ partialName: partialShort });

      styleModifierMatch = _styleModifierExtract.styleModifierMatch;
      styleModifier = _styleModifierExtract.styleModifier;


      if (partialFull !== partialShort) {
        try {
          paramsObj = jsonEval('{' + paramsStr.slice(1, -1).trim() + '}');
        } catch (err) {
          continue;
        }

        if (!paramsObj || paramsObj.constructor !== Object) {
          continue;
        }
      }
    } else {
      var _styleModifierExtract2 = styleModifierExtract({ partialName: partialFull });

      styleModifierMatch = _styleModifierExtract2.styleModifierMatch;
      styleModifier = _styleModifierExtract2.styleModifier;
    }

    if (styleModifierMatch) {
      partialShort = partialShort.replace(styleModifierMatch[0], '');
    }

    if (partialShort === partialFull) {
      continue;
    }

    paramsObj = paramsObj || {};

    if (styleModifier) {
      paramsObj.styleModifier = styleModifier;
    }

    var paramKeysShallowItr = Object.keys(paramsObj)[Symbol.iterator]();
    var paramKeysShallowItrn = paramKeysShallowItr.next();

    var _paramsObjToParamKeys3 = paramsObjToParamKeysArr({
      paramKeysArr_: [],
      paramKeysShallowItr: paramKeysShallowItr,
      paramKeysShallowItrn: paramKeysShallowItrn,
      paramsObj: paramsObj,
      parentObjAsStr: '',
      partialShort: partialShort // For debugging.
    }),
        paramKeysArr = _paramsObjToParamKeys3.paramKeysArr;

    var partialText_ = partials[partialShort] || '';

    var partialScan = hogan.scan(partialText_);
    var partialParseArr = hogan.parse(partialScan);
    var partialParseItr = partialParseArr[Symbol.iterator]();
    var partialParseItrn = partialParseItr.next();

    var _paramsApply2 = paramsApply({
      paramKeysArr: paramKeysArr,
      paramsObj: paramsObj,
      partialParseItr: partialParseItr,
      partialParseItrn: partialParseItrn,
      partialShort: partialShort, // For debugging.
      partialText_: partialText_
    }),
        delimiters = _paramsApply2.delimiters,
        partialText = _paramsApply2.partialText;

    if (delimiters) {
      var options = { delimiters: delimiters };
      var partialScanNew = hogan.scan(partialText, delimiters);
      var partialParseArrNew = hogan.parse(partialScanNew, partialText, options);
      var partialGenerated = hogan.generate(partialParseArrNew, partialText, options);

      partials[partialFull] = partialGenerated.render(paramsObj);
    } else {
      partials[partialFull] = partialText;
    }
  }

  return {
    generated: generated,
    partials: partials
  };
};

feplet.render = function () {
  var template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var partials_ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var generated = void 0;
  var partials = partials_;

  // Remove any reference between partialsArr and partials object because we need to add to the partials object.
  // We therefore do not want to iterate on the partials object itself.
  var partialsArr = Object.values(partials);

  for (var i = 0, l = partialsArr.length; i < l; i++) {
    var partialText = partialsArr[i];

    var _feplet$preprocessPar = feplet.preprocessPartialParams(partialText, partials);

    partials = _feplet$preprocessPar.partials;
  }

  var _feplet$preprocessPar2 = feplet.preprocessPartialParams(template, partials);

  generated = _feplet$preprocessPar2.generated;
  partials = _feplet$preprocessPar2.partials;


  return generated.render(context, partials);
};

if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
  // Following the convention of first-letter caps for packages attached to the window object (like Hogan and Mustache)
  // but since this isn't a class, keeping it all lowercase for Node and for internal use.
  window.Feplet = feplet;
}

module.exports = feplet;
