'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var hogan = require('../lib/hogan.js/lib/hogan.js');
var jsonEval = require('json-eval');

var paramRegex = /\([\S\s]*\)/;

// HELPER FUNCTIONS.

function contextKeysPreprocess(args) {
  var contextKeys_ = args.contextKeys_;


  var contextKeys = contextKeys_.slice();

  for (var i = 0, l = contextKeys_.length; i < l; i++) {
    var contextKey = contextKeys_[i];
    var contextKeySplit = contextKey.split('.');

    while (contextKeySplit.length > 1) {
      contextKeySplit.shift();

      var contextKeyNew = contextKeySplit.join('.');

      if (contextKeys.indexOf(contextKeyNew) === -1) {
        contextKeys.push(contextKeyNew);
      }
    }
  }

  return { contextKeys: contextKeys };
}

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

function dataKeysWithDotNotation(args) {
  var dataKeys = args.dataKeys,
      parentObjSplit = args.parentObjSplit;


  var i = 0;
  var itemNext = void 0;
  var dataKey = parentObjSplit[i];

  // Using assigment as the condition for a while loop to avoid having to perform conditional check for starting a for
  // loop at index 1.
  while (itemNext = parentObjSplit[++i]) {
    // eslint-disable-line no-cond-assign
    dataKey += '.' + itemNext;

    if (dataKeys.indexOf(dataKey) === -1) {
      dataKeys.push(dataKey);
    }
  }

  return { dataKeys: dataKeys };
}

function dataObjToDataKeysArr(args) {
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

  // dataKeys_ should only contain unique keys.
  if (!parentObjAsStr && !dataKeys.includes(key)) {
    dataKeys.push(key);
  }

  // Recurse deeper into dataObj if this property is of type object.
  if (dataObj[key] && _typeof(dataObj[key]) === 'object') {
    var dataObjNestedObj = dataObj[key];

    // Recursion into an Array.
    if (Array.isArray(dataObjNestedObj)) {
      for (var i = 0, l = dataObjNestedObj.length; i < l; i++) {
        var dataObjArrayItem = dataObjNestedObj[i];

        if (dataObjArrayItem && dataObjArrayItem.constructor === Object) {
          // Clone args object for recursion deeper into dataObj.
          var dataKeysDeeperItr = Object.keys(dataObjArrayItem)[Symbol.iterator]();
          var dataKeysDeeperItrn = dataKeysDeeperItr.next();

          var parentObjAsStrNew = parentObjAsStr;

          if (dataKeysDeeperItrn.value) {
            parentObjAsStrNew += parentObjAsStr ? '.' + key + '.' + i : key + '.' + i;

            var parentObjSplit = parentObjAsStrNew.split('.');

            var _dataKeysWithDotNotat = dataKeysWithDotNotation({ dataKeys: dataKeys, parentObjSplit: parentObjSplit });

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

          var _dataObjToDataKeysArr = dataObjToDataKeysArr(argsDeeper);

          dataKeys = _dataObjToDataKeysArr.dataKeys;
        }
      }
    }
    // Recursion into a plain Object.
    else {
        // Clone args object for recursion deeper into dataObj.
        var _dataKeysDeeperItr = Object.keys(dataObjNestedObj)[Symbol.iterator]();
        var _dataKeysDeeperItrn = _dataKeysDeeperItr.next();

        var _parentObjAsStrNew = parentObjAsStr;

        if (_dataKeysDeeperItrn.value) {
          _parentObjAsStrNew += parentObjAsStr ? '.' + key : key;

          var _parentObjSplit = _parentObjAsStrNew.split('.');

          var _dataKeysWithDotNotat2 = dataKeysWithDotNotation({ dataKeys: dataKeys, parentObjSplit: _parentObjSplit });

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

        var _dataObjToDataKeysArr2 = dataObjToDataKeysArr(_argsDeeper);

        dataKeys = _dataObjToDataKeysArr2.dataKeys;
      }
  } else {
    var _parentObjSplit2 = parentObjAsStr ? parentObjAsStr.split('.') : [];

    _parentObjSplit2.push(key);

    var _dataKeysWithDotNotat3 = dataKeysWithDotNotation({ dataKeys: dataKeys, parentObjSplit: _parentObjSplit2 });

    dataKeys = _dataKeysWithDotNotat3.dataKeys;
  }

  args.dataKeys_ = dataKeys;
  args.dataKeysShallowItrn = args.dataKeysShallowItr.next();

  return dataObjToDataKeysArr(args);
}

function styleModifierExtract(args) {
  var partialName = args.partialName;


  var styleModifierMatch = partialName.match(/\:([\w\-\|]+)/);
  var styleModClasses = '';

  if (styleModifierMatch && styleModifierMatch[1]) {
    styleModClasses = styleModifierMatch[1].replace(/\|/g, ' ').trim();

    if (!styleModClasses) {
      styleModifierMatch = null;
    }
  }

  // Because we search and replace structured object properties to shorten the file prior to minification, we cannot
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

function paramsApplyByKeyArrays(args) {
  var contextKeys = args.contextKeys,
      delimiters_ = args.delimiters_,
      tagParseVal = args.tagParseVal,
      paramKeys = args.paramKeys,
      parseObj = args.parseObj,
      parseObjKey = args.parseObjKey,
      partialText_ = args.partialText_;


  var delimiters = void 0;
  var otag = void 0;
  var ctag = void 0;
  var partialText = void 0;

  if (parseObjKey === 'n') {
    if (paramKeys.indexOf(tagParseVal) > -1 || contextKeys.indexOf(tagParseVal) === -1) {
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

  var partialText = void 0;
  var delimiters = void 0;

  if (parseObjKey === 'nodes' && Array.isArray(tagParse)) {
    var tagParseItr = tagParse[Symbol.iterator]();
    var tagParseItrn = tagParseItr.next();
    var paramsObjNested = getDotDelimitedProp({
      obj: paramsObj,
      prop_: parseObj.n
    });

    var paramKeysNew = void 0;
    var paramsObjNew = void 0;

    if (paramsObjNested) {
      if (Array.isArray(paramsObjNested)) {
        paramKeysNew = paramKeys;

        for (var i = 0, l = paramsObjNested.length; i < l; i++) {
          paramsObjNew = paramsObjNested[i];

          var paramKeysShallowItr = Object.keys(paramsObjNew)[Symbol.iterator]();
          var paramKeysShallowItrn = paramKeysShallowItr.next();

          var _dataObjToDataKeysArr3 = dataObjToDataKeysArr({
            dataKeys_: [],
            dataKeysShallowItr: paramKeysShallowItr,
            dataKeysShallowItrn: paramKeysShallowItrn,
            dataObj: paramsObjNew,
            parentObjAsStr: ''
            //partialShort // For debugging.
          }),
              dataKeys = _dataObjToDataKeysArr3.dataKeys;

          paramKeysNew = paramKeysNew.concat(dataKeys);
        }
      } else {
        paramsObjNew = paramsObjNested;

        var _paramKeysShallowItr = Object.keys(paramsObjNew)[Symbol.iterator]();
        var _paramKeysShallowItrn = _paramKeysShallowItr.next();

        var _dataObjToDataKeysArr4 = dataObjToDataKeysArr({
          dataKeys_: [],
          dataKeysShallowItr: _paramKeysShallowItr,
          dataKeysShallowItrn: _paramKeysShallowItrn,
          dataObj: paramsObjNew,
          parentObjAsStr: ''
          //partialShort // For debugging.
        }),
            _dataKeys = _dataObjToDataKeysArr4.dataKeys;

        paramKeysNew = paramKeys.concat(_dataKeys);
      }
    } else {
      paramKeysNew = paramKeys;
      paramsObjNew = paramsObj;
    }

    var _paramsApply = paramsApply({
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
}

// REFERENCES FOR STATIC AND INSTANCE METHODS

function preprocessPartialParams(text, compilation_, partials_, partialsComp_, contextKeys_) {
  var partials = partials_ || this.partials || {};
  var partialsComp = partialsComp_ || this.partialsComp || {};
  var contextKeys = contextKeys_ || this.contextKeys || [];

  var paramsMatch = void 0;
  var styleModClasses = void 0;
  var styleModifierMatch = void 0;

  var compilation = compilation_ || hogan.compile(text);

  for (var i in compilation.partials) {
    if (!compilation.partials.hasOwnProperty(i)) {
      continue;
    }

    var partialFull = compilation.partials[i].name;

    if (partials[partialFull]) {
      continue;
    }

    paramsMatch = partialFull.match(paramRegex);

    var paramsObj = void 0;
    var partialShort = partialFull;

    if (paramsMatch) {
      var paramsStr = paramsMatch[0];

      partialShort = partialFull.replace(paramsStr, '');

      var _styleModifierExtract = styleModifierExtract({ partialName: partialShort });

      styleModifierMatch = _styleModifierExtract.styleModifierMatch;
      styleModClasses = _styleModifierExtract.styleModClasses;


      if (partialFull !== partialShort) {
        try {
          paramsObj = jsonEval('{' + paramsStr.slice(1, -1).trim() + '}');
        } catch (err) {
          console.error(err); // eslint-disable-line no-console

          continue;
        }

        if (!paramsObj || paramsObj.constructor !== Object) {
          continue;
        }
      }
    } else {
      var _styleModifierExtract2 = styleModifierExtract({ partialName: partialFull });

      styleModifierMatch = _styleModifierExtract2.styleModifierMatch;
      styleModClasses = _styleModifierExtract2.styleModClasses;
    }

    if (styleModifierMatch) {
      partialShort = partialShort.replace(styleModifierMatch[0], '');
    }

    if (partialShort === partialFull) {
      continue;
    }

    paramsObj = paramsObj || {};

    if (styleModClasses) {
      paramsObj.styleModifier = styleModClasses;
    }

    var paramKeysShallowItr = Object.keys(paramsObj)[Symbol.iterator]();
    var paramKeysShallowItrn = paramKeysShallowItr.next();

    var _dataObjToDataKeysArr5 = dataObjToDataKeysArr({
      dataKeys_: [],
      dataKeysShallowItr: paramKeysShallowItr,
      dataKeysShallowItrn: paramKeysShallowItrn,
      dataObj: paramsObj,
      parentObjAsStr: ''
      //partialShort // For debugging.
    }),
        dataKeys = _dataObjToDataKeysArr5.dataKeys;

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
      var options = { delimiters: delimiters };
      var partialScanNew = hogan.scan(partialText, delimiters);
      var partialParseArrNew = hogan.parse(partialScanNew, partialText, options);
      var partialGeneration = hogan.generate(partialParseArrNew, partialText, options);

      partials[partialFull] = partialGeneration.render(paramsObj);
      partialsComp[partialFull] = hogan.compile(partials[partialFull]);
    } else {
      partials[partialFull] = partialText;
      partialsComp[partialFull] = hogan.generate(partialParseArr, partialText, {});
    }
  }

  return {
    compilation: compilation,
    partials: partials,
    partialsComp: partialsComp
  };
}

function compile(text, options, partials_, partialsComp_, contextKeys_) {
  var contextKeys = contextKeys_ || this.contextKeys;
  var compilation = hogan.compile(text, options);

  var partials = partials_ || this.partials || {};
  var partialsComp = partialsComp_ || this.partialsComp || {};

  // Remove any reference between partialsArr and partials object because we need to add to the partials object.
  // We therefore do not want to iterate on the partials object itself.
  var partialsArr = Object.values(partials);

  for (var i = 0, l = partialsArr.length; i < l; i++) {
    var partialText = partialsArr[i];

    var _preprocessPartialPar = preprocessPartialParams(partialText, partialsComp[i], partials, partialsComp, contextKeys);

    partials = _preprocessPartialPar.partials;
  }

  var _preprocessPartialPar2 = preprocessPartialParams(text, compilation, partials, partialsComp, contextKeys);

  partials = _preprocessPartialPar2.partials;
  partialsComp = _preprocessPartialPar2.partialsComp;


  return compilation;
}

function preprocessContextKeys(context) {
  if (!context) {
    return [];
  }

  var dataKeysShallowItr = Object.keys(context)[Symbol.iterator]();
  var dataKeysShallowItrn = dataKeysShallowItr.next();

  var _dataObjToDataKeysArr6 = dataObjToDataKeysArr({
    dataKeys_: [],
    dataKeysShallowItr: dataKeysShallowItr,
    dataKeysShallowItrn: dataKeysShallowItrn,
    dataObj: context,
    parentObjAsStr: ''
  }),
      dataKeys = _dataObjToDataKeysArr6.dataKeys;

  var _contextKeysPreproces = contextKeysPreprocess({ contextKeys_: dataKeys }),
      contextKeys = _contextKeysPreproces.contextKeys;

  return contextKeys;
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

function unregisterPartial(name, partials_, partialsComp_) {
  var partials = partials_ || this.partials || {};
  var partialsComp = partialsComp_ || this.partialsComp || {};

  delete partials[name];
  delete partialsComp[name];

  return {
    partials: partials,
    partialsComp: partialsComp
  };
}

function render() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var context_ = arguments[1];
  var partials_ = arguments[2];
  var partialsComp_ = arguments[3];
  var contextKeys_ = arguments[4];

  var context = context_ || this.context || {};
  var contextKeys = contextKeys_ || this.contextKeys || [];

  var partials = partials_ || this.partials || {};
  var partialsComp = partialsComp_ || this.partialsComp || {};

  for (var i in partials) {
    if (!partials.hasOwnProperty(i)) {
      continue;
    }

    if (!partialsComp[i]) {
      var _registerPartial = registerPartial(i, partials[i], null, partials, partialsComp);

      partials = _registerPartial.partials;
      partialsComp = _registerPartial.partialsComp;
    }
  }

  var compilation = void 0;

  if (Object.keys(partialsComp).length) {
    compilation = compile(text, null, partials, partialsComp, contextKeys);
  } else {
    compilation = hogan.compile(text);
  }

  return compilation.render(context, partials, null, partialsComp);
}

// PREPARE FOR EXPORT.

function Feplet(context, partials, partialsComp, contextKeys) {
  this.context = context || {};
  this.partials = partials || {};
  this.partialsComp = partialsComp || {};
  this.contextKeys = contextKeys || preprocessContextKeys(context);
}

// STATIC METHODS.

Object.assign(Feplet, hogan); // hogan is not a class so the constructor does not get overridden.

Feplet.compile = compile;

Feplet.preprocessContextKeys = preprocessContextKeys;

Feplet.preprocessPartialParams = preprocessPartialParams;

Feplet.registerPartial = registerPartial;

Feplet.unregisterPartial = unregisterPartial;

Feplet.render = render;

// INSTANCE METHODS.

Feplet.prototype.compile = compile;

Feplet.prototype.preprocessPartialParams = preprocessPartialParams;

Feplet.prototype.registerPartial = registerPartial;

Feplet.prototype.unregisterPartial = unregisterPartial;

Feplet.prototype.render = render;

if (typeof define === 'function') {
  define(function () {
    return Feplet;
  });
} else if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
  window.Feplet = Feplet;
}

module.exports = Feplet;
