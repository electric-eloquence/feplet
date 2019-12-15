// The \u0002 and \u0003 unicodes could be replaced with variables, but it is more clear what they are and what their
// intent is if left as unicode. They are respectively Start of Text and End of Text characters. Their purpose is to be
// temporary alternate tag delimiters.

'use strict';

const hogan = require('../lib/hogan.js/lib/hogan.js');
const jsonEval = require('json-eval');

const paramRegex = /\([\S\s]*\)/;

// HELPER FUNCTIONS.

function contextKeysPreProcess(args) {
  const {
    contextKeys
  } = args;

  for (let contextKey of Object.keys(contextKeys)) {
    /* istanbul ignore if */
    if (!contextKeys[contextKey]) {
      continue;
    }

    const contextKeySplit = contextKey.split('.');

    while (contextKeySplit.length > 1) {
      contextKeySplit.shift();

      const contextKeyNew = contextKeySplit.join('.');

      contextKeys[contextKeyNew] = true;
    }
  }

  return {contextKeys};
}

function getDotDelimitedProp(args) {
  const {
    obj,
    prop_
  } = args;

  const propSplit = prop_.split('.');
  const prop0 = propSplit.shift();
  const prop = propSplit.join('.');

  let value;

  // eslint-disable-next-line no-prototype-builtins
  if (obj.hasOwnProperty(prop0)) {
    const _value = obj[prop0];

    if (_value instanceof Object && prop.length) {
      value = getDotDelimitedProp({
        obj: _value,
        prop_: prop
      });
    }
    else {
      value = _value;
    }
  }

  return value;
}

function spacesCount(args) {
  const {
    count_,
    inc,
    partialText_
  } = args;

  let count;
  let counter = count_;

  while (/\s/.test(partialText_[counter])) {
    counter += inc;
  }

  if (inc > 0) {
    count = counter - count_;
  }
  else {
    count = -(counter - count_);
  }

  return {
    count
  };
}

function openStartStopGet(args) {
  const {
    parseObj,
    partialText_
  } = args;

  let openStart;
  let openSpace0Start;
  let openSpace0Stop;
  let openSpace1Start;
  let openSpace1Stop;
  let openStop;

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
  openStart -= spacesCount({count_: openStart, inc: -1, partialText_}).count;
  openSpace1Start = openStart;
  openStart -= parseObj.n.length;
  openSpace0Stop = openStart;
  openStart -= spacesCount({count_: openStart, inc: -1, partialText_}).count;
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
    openStart,
    openSpace0Start,
    openSpace0Stop,
    openSpace1Start,
    openSpace1Stop,
    openStop
  };
}

function openTagBuild(args) {
  const {
    openStartStop,
    parseObj,
    partialText_
  } = args;

  let {
    //openStart, // For debugging.
    openSpace0Start,
    openSpace0Stop,
    openSpace1Start,
    openSpace1Stop,
    //openStop // For debugging.
  } = openStartStop;
  let i;
  let partialText = '';

  i = parseObj.otag.length;

  while (i--) {
    partialText += '\u0002';
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
    partialText += '\u0003';
    //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
  }

  return {
    partialText
  };
}

function closeStartStopGet(args) {
  const {
    parseObj,
    partialText_
  } = args;

  let closeStart;
  let closeSpace0Start;
  let closeSpace0Stop;
  let closeSpace1Start;
  let closeSpace1Stop;
  let closeStop;

  closeStart = parseObj.end;
  closeStop = closeStart;
  closeStop += parseObj.otag.length;
  closeStop += parseObj.tag.length;
  closeSpace0Start = closeStop;
  closeStop += spacesCount({count_: closeStop, inc: +1, partialText_}).count;
  closeSpace0Stop = closeStop;
  closeStop += parseObj.n.length;
  closeSpace1Start = closeStop;
  closeStop += spacesCount({count_: closeStop, inc: +1, partialText_}).count;
  closeSpace1Stop = closeStop;
  closeStop += parseObj.otag.length;

  return {
    closeStart,
    closeSpace0Start,
    closeSpace0Stop,
    closeSpace1Start,
    closeSpace1Stop,
    closeStop
  };
}

function closeTagBuild(args) {
  const {
    closeStartStop,
    parseObj,
    partialText_
  } = args;

  let {
    //closeStart, // For debugging.
    closeSpace0Start,
    closeSpace0Stop,
    closeSpace1Start,
    closeSpace1Stop,
    //closeStop // For debugging.
  } = closeStartStop;
  let i;
  let partialText = '';

  i = parseObj.otag.length;

  while (i--) {
    partialText += '\u0002';
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
    partialText += '\u0003';
    //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
  }

  return {
    partialText
  };
}

function dataKeysWithDotNotation(args) {
  const {
    dataKeys,
    parentObjSplit
  } = args;

  let i = 0;
  let itemNext;
  let dataKey = parentObjSplit[i];

  // Using assigment as the condition for a while loop to avoid having to perform conditional check for starting a for
  // loop at index 1.
  while (itemNext = parentObjSplit[++i]) { // eslint-disable-line no-cond-assign
    dataKey += `.${itemNext}`;
    dataKeys[dataKey] = true;
  }

  return {dataKeys};
}

function dataObjToDataKeysObj(args) {
  const {
    dataKeys_,
    //dataKeysShallowItr, // For debugging.
    dataKeysShallowItrn,
    dataObj,
    parentObjAsStr,
    //partialShort // For debugging.
  } = args;

  if (dataKeysShallowItrn.done) {
    return {
      dataKeys: dataKeys_
    };
  }

  const key = dataKeysShallowItrn.value;

  let dataKeys = dataKeys_;

  if (!parentObjAsStr) {
    dataKeys[key] = true;
  }

  // Recurse deeper into dataObj if this property is of type object.
  if (dataObj[key] && typeof dataObj[key] === 'object') {
    const dataObjNestedObj = dataObj[key];

    // Recursion into an Array.
    if (Array.isArray(dataObjNestedObj)) {
      for (let i = 0, l = dataObjNestedObj.length; i < l; i++) {
        const dataObjArrayItem = dataObjNestedObj[i];

        if (dataObjArrayItem && dataObjArrayItem.constructor === Object) {
          // Clone args object for recursion deeper into dataObj.
          const dataKeysDeeperItr = Object.keys(dataObjArrayItem)[Symbol.iterator]();
          const dataKeysDeeperItrn = dataKeysDeeperItr.next();

          let parentObjAsStrNew = parentObjAsStr;

          if (dataKeysDeeperItrn.value) {
            parentObjAsStrNew += parentObjAsStr ? `.${key}.${i}` : `${key}.${i}`;

            const parentObjSplit = parentObjAsStrNew.split('.');

            ({dataKeys} = dataKeysWithDotNotation({dataKeys, parentObjSplit}));
          }

          const argsDeeper = {
            dataKeys_: dataKeys,
            dataKeysShallowItr: dataKeysDeeperItr,
            dataKeysShallowItrn: dataKeysDeeperItrn,
            dataObj: dataObjArrayItem,
            parentObjAsStr: parentObjAsStrNew,
            partialShort: args.partialShort
          };

          ({dataKeys} = dataObjToDataKeysObj(argsDeeper));
        }
      }
    }
    // Recursion into a plain Object.
    else {
      // Clone args object for recursion deeper into dataObj.
      const dataKeysDeeperItr = Object.keys(dataObjNestedObj)[Symbol.iterator]();
      const dataKeysDeeperItrn = dataKeysDeeperItr.next();

      let parentObjAsStrNew = parentObjAsStr;

      if (dataKeysDeeperItrn.value) {
        parentObjAsStrNew += parentObjAsStr ? `.${key}` : key;

        const parentObjSplit = parentObjAsStrNew.split('.');

        ({dataKeys} = dataKeysWithDotNotation({dataKeys, parentObjSplit}));
      }

      const argsDeeper = {
        dataKeys_: dataKeys,
        dataKeysShallowItr: dataKeysDeeperItr,
        dataKeysShallowItrn: dataKeysDeeperItrn,
        dataObj: dataObjNestedObj,
        parentObjAsStr: parentObjAsStrNew,
        partialShort: args.partialShort
      };

      ({dataKeys} = dataObjToDataKeysObj(argsDeeper));
    }
  }
  else {
    const parentObjSplit = parentObjAsStr ? parentObjAsStr.split('.') : [];

    parentObjSplit.push(key);
    ({dataKeys} = dataKeysWithDotNotation({dataKeys, parentObjSplit}));
  }

  args.dataKeys_ = dataKeys;
  args.dataKeysShallowItrn = args.dataKeysShallowItr.next();

  return dataObjToDataKeysObj(args);
}

function styleModifierExtract(args) {
  const {
    partialName
  } = args;

  // eslint-disable-next-line no-useless-escape
  let styleModifierMatch = partialName.match(/\:([\w\-\|]+)/);
  let styleModClasses = '';

  if (styleModifierMatch && styleModifierMatch[1]) {
    styleModClasses = styleModifierMatch[1].replace(/\|/g, ' ').trim();

    /* istanbul ignore if */
    if (!styleModClasses) {
      styleModifierMatch = null;
    }
  }

  // Because we search and replace structured object properties to shorten the file prior to minification, we cannot
  // use "styleModifier" or other function substrings as structured object property names. "styleModifier" is also
  // reserved as a property name on paramsObj. Using "styleModClasses" instead.
  return {
    styleModifierMatch,
    styleModClasses
  };
}

function tagReplace(args) {
  const {
    parseObj,
    partialText_
  } = args;

  const otag = parseObj.otag;
  const ctag = parseObj.ctag;

  let partialText = '';

  switch (parseObj.tag) {
    case '#':
    case '$':
    case '&':
    case '<':
    case '^':
    case '_v':
    case '{':

      /* eslint-disable no-case-declarations */
      let openStartStop = openStartStopGet({parseObj, partialText_});
      let {
        openStart,
        //openSpace0Start, // For debugging.
        //openSpace0Stop, // For debugging.
        //openSpace1Start, // For debugging.
        //openSpace1Stop, // For debugging.
        //openStop // For debugging.
      } = openStartStop;

      partialText += partialText_.substring(0, openStart);
      partialText += openTagBuild({openStartStop, parseObj, partialText_}).partialText;

      let closeStartStop;
      /* eslint-enable no-case-declarations */

      switch (parseObj.tag) {
        case '#':
        case '$':
        case '&':
        case '<':
        case '^':
          closeStartStop = closeStartStopGet({parseObj, partialText_});
      }

      if (!closeStartStop) {
        partialText += partialText_.slice(openStartStop.openStop);

        break;
      }

      partialText += partialText_.substring(openStartStop.openStop, closeStartStop.closeStart);
      partialText += closeTagBuild({closeStartStop, parseObj, partialText_}).partialText;
      partialText += partialText_.slice(closeStartStop.closeStop);

      break;
  }

  return {
    otag,
    ctag,
    partialText
  };
}

// CORE FUNCTIONS.

function paramsApplyByKeyArrays(args) {
  const {
    contextKeys,
    delimiters_,
    tagParseVal,
    paramKeys,
    //paramsObj, // For debugging.
    parseObj,
    parseObjKey,
    //partialShort, // For debugging.
    partialText_
  } = args;

  let delimiters;
  let otag;
  let ctag;
  let partialText;

  if (parseObjKey === 'n' && (paramKeys[tagParseVal] || !contextKeys[tagParseVal])) {
    ({
      otag,
      ctag,
      partialText
    } = tagReplace({
      parseObj,
      partialText_
    }));
  }
  else if (parseObjKey === 'tag' && !delimiters_) {
    otag = parseObj.otag;
    ctag = parseObj.ctag;
  }

  if (!delimiters_ && otag && ctag) {
    delimiters = '';

    for (let i = 0, l = otag.length; i < l; i++) {
      delimiters += '\u0002';
      //delimiters = delimiters.slice(0, -1) + 'u'; // For debugging.
    }

    delimiters += ' ';

    for (let i = 0, l = ctag.length; i < l; i++) {
      delimiters += '\u0003';
      //delimiters = delimiters.slice(0, -1) + 'u'; // For debugging.
    }
  }

  return {
    delimiters: delimiters || delimiters_,
    partialText: partialText || partialText_
  };
}

function paramsApplyToParseObj(args) {
  const {
    contextKeys,
    delimiters_,
    paramKeys,
    paramsObj,
    parseObj,
    parseObjKeysItr,
    parseObjKeysItrn,
    //partialShort, // For debugging.
    partialText_
  } = args;

  if (parseObjKeysItrn.done) {
    return {
      delimiters: delimiters_,
      partialText: partialText_
    };
  }

  const parseObjKey = parseObjKeysItrn.value;
  const tagParse = parseObj[parseObjKey];

  let partialText;
  let delimiters;

  if (parseObjKey === 'nodes' && Array.isArray(tagParse)) {
    const tagParseItr = tagParse[Symbol.iterator]();
    const tagParseItrn = tagParseItr.next();
    const paramsObjNested = getDotDelimitedProp({
      obj: paramsObj,
      prop_: parseObj.n
    });

    let paramKeysNew;
    let paramsObjNew;

    if (paramsObjNested) {
      if (Array.isArray(paramsObjNested)) {
        paramKeysNew = paramKeys;

        for (let i = 0, l = paramsObjNested.length; i < l; i++) {
          paramsObjNew = paramsObjNested[i];

          const paramKeysShallowItr = Object.keys(paramsObjNew)[Symbol.iterator]();
          const paramKeysShallowItrn = paramKeysShallowItr.next();
          const {dataKeys} = dataObjToDataKeysObj({
            dataKeys_: {},
            dataKeysShallowItr: paramKeysShallowItr,
            dataKeysShallowItrn: paramKeysShallowItrn,
            dataObj: paramsObjNew,
            parentObjAsStr: '',
            //partialShort // For debugging.
          });

          Object.assign(paramKeysNew, dataKeys);
        }
      }

      else {
        paramsObjNew = paramsObjNested;

        const paramKeysShallowItr = Object.keys(paramsObjNew)[Symbol.iterator]();
        const paramKeysShallowItrn = paramKeysShallowItr.next();
        const {dataKeys} = dataObjToDataKeysObj({
          dataKeys_: {},
          dataKeysShallowItr: paramKeysShallowItr,
          dataKeysShallowItrn: paramKeysShallowItrn,
          dataObj: paramsObjNew,
          parentObjAsStr: '',
          //partialShort // For debugging.
        });

        paramKeysNew = Object.assign(paramKeys, dataKeys);
      }
    }
    else {
      paramKeysNew = paramKeys;
      paramsObjNew = paramsObj;
    }

    ({
      delimiters,
      partialText
    } = paramsApply({ // eslint-disable-line no-use-before-define
      contextKeys,
      paramKeys: paramKeysNew,
      paramsObj: paramsObjNew,
      partialParseItr: tagParseItr,
      partialParseItrn: tagParseItrn,
      //partialShort, // For debugging.
      partialText_
    }));
  }
  else {
    ({
      delimiters,
      partialText
    } = paramsApplyByKeyArrays({
      contextKeys,
      delimiters_,
      tagParseVal: tagParse,
      paramKeys,
      //paramsObj, // For debugging.
      parseObj,
      parseObjKey,
      //partialShort, // For debugging.
      partialText_
    }));
  }

  args.delimiters_ = delimiters || delimiters_;
  args.parseObjKeysItrn = parseObjKeysItr.next();
  args.partialText_ = partialText || partialText_;

  return paramsApplyToParseObj(args);
}

function paramsApply(args) {
  const {
    contextKeys,
    delimiters_,
    paramKeys,
    paramsObj,
    partialParseItr,
    partialParseItrn,
    //partialShort, // For debugging.
    partialText_
  } = args;

  if (partialParseItrn.done) {
    return {
      delimiters: delimiters_,
      partialText: partialText_
    };
  }

  const parseObj = partialParseItrn.value;
  const parseObjKeysItr = Object.keys(parseObj)[Symbol.iterator]();
  const parseObjKeysItrn = parseObjKeysItr.next();

  let {
    delimiters,
    partialText
  } = paramsApplyToParseObj({
    contextKeys,
    delimiters_,
    paramKeys,
    paramsObj,
    parseObj,
    parseObjKeysItr,
    parseObjKeysItrn,
    //partialShort, // For debugging.
    partialText_
  });

  args.delimiters_ = delimiters || delimiters_;
  args.partialParseItrn = partialParseItr.next();
  args.partialText_ = partialText || partialText_;

  return paramsApply(args);
}

// REFERENCES FOR STATIC AND INSTANCE METHODS

function preProcessContextKeys(context) {
  /* istanbul ignore if */
  if (!context) {
    return {};
  }

  const dataKeysShallowItr = Object.keys(context)[Symbol.iterator]();
  const dataKeysShallowItrn = dataKeysShallowItr.next();
  const {dataKeys} = dataObjToDataKeysObj({
    dataKeys_: {},
    dataKeysShallowItr,
    dataKeysShallowItrn,
    dataObj: context,
    parentObjAsStr: '',
  });

  const {contextKeys} = contextKeysPreProcess({contextKeys: dataKeys});

  return contextKeys;
}

function preProcessPartialParams(text, compilation_, partials_, partialsComp_, contextKeys_, context) {
  const partials = partials_ || this.partials || {};
  const partialsComp = partialsComp_ || this.partialsComp || {};
  let contextKeys = contextKeys_ || (this && this.contextKeys);
  let _contextKeys;

  let hasParam = false;
  let styleModClasses;
  let styleModifierMatch;

  const compilation = compilation_ || hogan.compile(text);

  // First, check if we still need to preprocess contextKeys because .render() was called statically.
  if (typeof contextKeys === 'undefined') {
    for (let i of Object.keys(compilation.partials)) {
      const partialFull = compilation.partials[i].name;
      hasParam = paramRegex.test(partialFull) || partialFull.indexOf(':') > -1;

      if (hasParam) {
        break;
      }
    }

    if (hasParam) {
      contextKeys = _contextKeys = preProcessContextKeys(context);
    }
    else {
      contextKeys = {};
    }
  }

  for (let i of Object.keys(compilation.partials)) {
    const partialFull = compilation.partials[i].name;

    if (partials[partialFull]) {
      continue;
    }

    const paramsMatch = partialFull.match(paramRegex);

    let paramsObj;
    let partialShort = partialFull;

    if (paramsMatch) {
      const paramsStr = paramsMatch[0];

      partialShort = partialFull.replace(paramsStr, '');

      ({
        styleModifierMatch,
        styleModClasses
      } = styleModifierExtract({partialName: partialShort}));

      if (partialFull !== partialShort) {
        try {
          paramsObj = jsonEval(`{${paramsStr.slice(1, -1).trim()}}`);
        }
        catch (err) {
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
    }
    else {
      ({
        styleModifierMatch,
        styleModClasses
      } = styleModifierExtract({partialName: partialFull}));
    }

    if (styleModifierMatch) {
      partialShort = partialShort.replace(styleModifierMatch[0], '');
    }

    /* istanbul ignore if */
    if (partialShort === partialFull) {
      continue;
    }

    paramsObj = paramsObj || {};

    if (styleModClasses) {
      paramsObj.styleModifier = styleModClasses;
    }

    const paramKeysShallowItr = Object.keys(paramsObj)[Symbol.iterator]();
    const paramKeysShallowItrn = paramKeysShallowItr.next();
    const {dataKeys} = dataObjToDataKeysObj({
      dataKeys_: {},
      dataKeysShallowItr: paramKeysShallowItr,
      dataKeysShallowItrn: paramKeysShallowItrn,
      dataObj: paramsObj,
      parentObjAsStr: '',
      //partialShort // For debugging.
    });
    const paramKeys = dataKeys;

    let partialText_ = partials[partialShort] || '';

    const partialScan = hogan.scan(partialText_);
    const partialParseArr = hogan.parse(partialScan);
    const partialParseItr = partialParseArr[Symbol.iterator]();
    const partialParseItrn = partialParseItr.next();

    let {
      delimiters,
      partialText
    } = paramsApply({
      contextKeys,
      paramKeys,
      paramsObj,
      partialParseItr,
      partialParseItrn,
      //partialShort, // For debugging.
      partialText_
    });

    if (delimiters) {
      const options = {delimiters};
      const partialScanNew = hogan.scan(partialText, delimiters);
      const partialParseArrNew = hogan.parse(partialScanNew, partialText, options);
      const partialGeneration = hogan.generate(partialParseArrNew, partialText, options);

      partials[partialFull] = partialGeneration.render(paramsObj);
      partialsComp[partialFull] = hogan.compile(partials[partialFull]);
    }
    else {
      // Do not have nyc/istanbul ignore this.
      // Stay open to the possibility of testing this.
      partials[partialFull] = partialText;
      partialsComp[partialFull] = hogan.generate(partialParseArr, partialText, {});
    }
  }

  return {
    compilation,
    _contextKeys,
    partials,
    partialsComp
  };
}

// Declared after preProcessPartialParams because compile is dependent on it.
function compile(text, options, partials_, partialsComp_, contextKeys_, context) {
  let compilation = hogan.compile(text, options);
  let contextKeys = contextKeys_ || (this && this.contextKeys);
  let _contextKeys;
  let partials = partials_ || this.partials || {};
  let partialsComp = partialsComp_ || this.partialsComp || {};

  // Remove any reference between partialsArr and partials object because we need to add to the partials object.
  // We therefore do not want to iterate on the partials object itself.
  const partialsArr = Object.values(partials);

  for (let i = 0, l = partialsArr.length; i < l; i++) {
    const partialText = partialsArr[i];

    ({
      _contextKeys
    } = preProcessPartialParams(partialText, partialsComp[i], partials, partialsComp, contextKeys, context));
  }

  if (_contextKeys) {
    contextKeys = _contextKeys;
  }

  ({
    compilation
  } = preProcessPartialParams(text, compilation, partials, partialsComp, contextKeys, context));

  return compilation;
}

function registerPartial(name, partialTemplate, partialComp_, partials_, partialsComp_) {
  const partials = partials_ || this.partials || {};
  const partialsComp = partialsComp_ || this.partialsComp || {};

  if (!partials[name]) {
    partials[name] = partialTemplate;
  }

  if (!partialsComp[name]) {
    const partialComp = partialComp_ || hogan.compile(partialTemplate);

    partialsComp[name] = partialComp;
  }

  return {
    partials,
    partialsComp
  };
}

function render(text = '', context_, partials_, partialsComp_, contextKeys_) {
  const context = context_ || this.context || {};
  const contextKeys = contextKeys_ || (this && this.contextKeys);

  let partials = partials_ || this.partials || {};
  let partialsComp = partialsComp_ || this.partialsComp || {};

  for (let i of Object.keys(partials)) {
    if (!partialsComp[i]) {
      ({
        partials,
        partialsComp
      } = registerPartial(i, partials[i], null, partials, partialsComp));
    }
  }

  let compilation;

  if (Object.keys(partialsComp).length) {
    compilation = compile(text, null, partials, partialsComp, contextKeys, context);
  }
  else {
    compilation = hogan.compile(text);
  }

  return compilation.render(context, partials, null, partialsComp);
}

function unregisterPartial(name, partials_, partialsComp_) {
  const partials = partials_ || this.partials || {};
  const partialsComp = partialsComp_ || this.partialsComp || {};

  delete partials[name];
  delete partialsComp[name];

  return {
    partials,
    partialsComp
  };
}

// PREPARE FOR EXPORT.

function Feplet(context, partials, partialsComp, contextKeys) {
  this.context = context || {};
  this.partials = partials || {};
  this.partialsComp = partialsComp || {};
  this.contextKeys = contextKeys || preProcessContextKeys(this.context);
}

// STATIC METHODS.

Object.assign(Feplet, hogan); // hogan is not a class so the constructor does not get overridden.

Feplet.compile = compile;

Feplet.preProcessContextKeys = preProcessContextKeys;

Feplet.preProcessPartialParams = preProcessPartialParams;

Feplet.registerPartial = registerPartial;

Feplet.render = render;

Feplet.unregisterPartial = unregisterPartial;

// INSTANCE METHODS.

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
else if (typeof window === 'object') {
  window.Feplet = Feplet;
}

module.exports = Feplet;
