// For loops are generally replaced by recursion through iterators. This is more verbose, and more difficult to read for
// the uninitiated, but the idea of recursing on .next() values and terminating on .done values should be easy to grasp.
// In accordance with the "functional progamming" paradigm, this is useful for traversing nested data structures. In
// addition, since many functions herein add to data structures while recursing through them, we can avoid ambiguity as
// to whether added values are recomputed as .next() values. (They are.) Plain for, for..of, for..in, and forEach loops,
// as well as the .map(), .filter(), and .reduce() Array methods, all do this differently. No hints from the loops or
// Array methods imply whether or not recomputation occurs. .next() unambiguously expresses computation on each call.

// Labeled block statements are used to segregate functions into organizational units. We could also achieve this end by
// breaking this file into multiple files. However, we need to compile our code into ES5 consumable by less modern
// browsers. Given that this is a relatively small file, it is easier to keep the code in one file.

'use strict';

const hogan = require('../lib/hogan.js/lib/hogan.js');
const jsonEval = require('json-eval');

COLLECTORS: {
  var contextKeysCollect = function (args) {
    const {
      contextKeys_,
      contextKeysItr,
      contextKeysItrn
    } = args;

    if (contextKeysItrn.done) {
      return {
        contextKeys: contextKeys_
      };
    }

    const contextKey = contextKeysItrn.value;
    const contextKeySplit = contextKey.split('.');

    while (contextKeySplit.length > 1) {
      contextKeySplit.shift();

      const contextKeyNew = contextKeySplit.join('.');

      contextKeys_.push(contextKeyNew);
    }

    args.contextKeysItrn = contextKeysItr.next();

    return contextKeysCollect(args);
  };

  var dataKeysWithDotNotationAdd = function (args) {
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
      dataKeys.push(dataKey);
    }

    return {dataKeys};
  };

  var dataKeysCollect = function (args) {
    const {
      dataKeys_,
      //dataObjShallowItr, // For debugging.
      dataObjShallowItrn,
      dataObj,
      parentObjAsStr,
      //partialShort // For debugging.
    } = args;
    let dataKeys = dataKeys_;

    if (dataObjShallowItrn.done) {
      return {dataKeys};
    }

    const key = dataObjShallowItrn.value;

    if (!parentObjAsStr) {
      dataKeys.push(key);
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
            const dataObjDeeperItr = Object.keys(dataObjArrayItem)[Symbol.iterator]();
            const dataObjDeeperItrn = dataObjDeeperItr.next();

            let parentObjAsStrNew = parentObjAsStr;

            if (dataObjDeeperItrn.value) {
              parentObjAsStrNew += parentObjAsStr ? `.${key}.${i}` : `${key}.${i}`;

              const parentObjSplit = parentObjAsStrNew.split('.');

              ({dataKeys} = dataKeysWithDotNotationAdd({dataKeys, parentObjSplit}));
            }

            const argsDeeper = {
              dataKeys_: dataKeys,
              dataObjShallowItr: dataObjDeeperItr,
              dataObjShallowItrn: dataObjDeeperItrn,
              dataObj: dataObjArrayItem,
              parentObjAsStr: parentObjAsStrNew,
              partialShort: args.partialShort
            };

            ({dataKeys} = dataKeysCollect(argsDeeper));
          }
        }
      }
      // Recursion into a plain Object.
      else {
        // Clone args object for recursion deeper into dataObj.
        const dataObjDeeperItr = Object.keys(dataObjNestedObj)[Symbol.iterator]();
        const dataObjDeeperItrn = dataObjDeeperItr.next();

        let parentObjAsStrNew = parentObjAsStr;

        if (dataObjDeeperItrn.value) {
          parentObjAsStrNew += parentObjAsStr ? `.${key}` : key;

          const parentObjSplit = parentObjAsStrNew.split('.');

          ({dataKeys} = dataKeysWithDotNotationAdd({dataKeys, parentObjSplit}));
        }

        const argsDeeper = {
          dataKeys_: dataKeys,
          dataObjShallowItr: dataObjDeeperItr,
          dataObjShallowItrn: dataObjDeeperItrn,
          dataObj: dataObjNestedObj,
          parentObjAsStr: parentObjAsStrNew,
          partialShort: args.partialShort
        };

        ({dataKeys} = dataKeysCollect(argsDeeper));
      }
    }
    else {
      const parentObjSplit = parentObjAsStr ? parentObjAsStr.split('.') : [];

      parentObjSplit.push(key);
      ({dataKeys} = dataKeysWithDotNotationAdd({dataKeys, parentObjSplit}));
    }

    args.dataKeys_ = dataKeys;
    args.dataObjShallowItrn = args.dataObjShallowItr.next();

    return dataKeysCollect(args);
  };
}

HELPERS: {
  var paramsObjDotNotationParse = function (args) {
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
        value = paramsObjDotNotationParse({
          obj: _value,
          prop_: prop
        });
      }
      else {
        value = _value;
      }
    }

    return value;
  };

  var styleModifierExtract = function (args) {
    const {
      partialName
    } = args;
    let styleModClasses = '';
    // eslint-disable-next-line no-useless-escape
    let styleModifierMatch = partialName.match(/\:([\w\-\|]+)/);

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
      styleModClasses,
      styleModifierMatch
    };
  };

  // The \u0002 and \u0003 unicodes could be replaced with variables, but it is more clear what they are and what their
  // intent is if left as unicode. They are respectively Start of Text and End of Text characters. Their purpose is to
  // be temporary alternate tag delimiters.

  TAG_REPLACER: {
    var spacesCount = function (args) {
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
    };

    var openTagParse = function (args) {
      const {
        parseObj,
        partialText_
      } = args;
      let startPos;
      let space0StartPos;
      let space0StopPos;
      let space1StartPos;
      let space1StopPos;
      let stopPos;

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
      startPos -= spacesCount({count_: startPos, inc: -1, partialText_}).count;
      space1StartPos = startPos;
      startPos -= parseObj.n.length;
      space0StopPos = startPos;
      startPos -= spacesCount({count_: startPos, inc: -1, partialText_}).count;
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
        startPos,
        space0StartPos,
        space0StopPos,
        space1StartPos,
        space1StopPos,
        stopPos
      };
    };

    var startOfTextEncode = function (args) {
      const {
        openTagData,
        parseObj,
        partialText_
      } = args;
      let {
        //startPos, // For debugging.
        space0StartPos,
        space0StopPos,
        space1StartPos,
        space1StopPos,
        //stopPos // For debugging.
      } = openTagData;
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
        partialText += '\u0003';
        //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
      }

      return {
        partialText
      };
    };

    var closeTagParse = function (args) {
      const {
        parseObj,
        partialText_
      } = args;
      let startPos;
      let space0StartPos;
      let space0StopPos;
      let space1StartPos;
      let space1StopPos;
      let stopPos;

      startPos = parseObj.end;
      stopPos = startPos;
      stopPos += parseObj.otag.length;
      stopPos += parseObj.tag.length;
      space0StartPos = stopPos;
      stopPos += spacesCount({count_: stopPos, inc: +1, partialText_}).count;
      space0StopPos = stopPos;
      stopPos += parseObj.n.length;
      space1StartPos = stopPos;
      stopPos += spacesCount({count_: stopPos, inc: +1, partialText_}).count;
      space1StopPos = stopPos;
      stopPos += parseObj.otag.length;

      return {
        startPos,
        space0StartPos,
        space0StopPos,
        space1StartPos,
        space1StopPos,
        stopPos
      };
    };

    var endOfTextEncode = function (args) {
      const {
        closeTagData,
        parseObj,
        partialText_
      } = args;
      let {
        //startPos, // For debugging.
        space0StartPos,
        space0StopPos,
        space1StartPos,
        space1StopPos,
        //stopPos // For debugging.
      } = closeTagData;
      let i;
      let partialText = '';

      i = parseObj.otag.length;

      while (i--) {
        partialText += '\u0002';
        //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
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
        partialText += '\u0003';
        //partialText = partialText.slice(0, -1) + 'u'; // For debugging.
      }

      return {
        partialText
      };
    };

    var tagReplace = function (args) {
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
          let openTagData = openTagParse({parseObj, partialText_});
          let {
            startPos,
            //space0StartPos, // For debugging.
            //space0StopPos, // For debugging.
            //space1StartPos, // For debugging.
            //space1StopPos, // For debugging.
            //stopPos // For debugging.
          } = openTagData;

          partialText += partialText_.substring(0, startPos);
          partialText += startOfTextEncode({openTagData, parseObj, partialText_}).partialText;

          let closeTagData;
          /* eslint-enable no-case-declarations */

          switch (parseObj.tag) {
            case '#':
            case '$':
            case '&':
            case '<':
            case '^':
              closeTagData = closeTagParse({parseObj, partialText_});
          }

          if (!closeTagData) {
            partialText += partialText_.slice(openTagData.stopPos);

            break;
          }

          partialText += partialText_.substring(openTagData.stopPos, closeTagData.startPos);
          partialText += endOfTextEncode({closeTagData, parseObj, partialText_}).partialText;
          partialText += partialText_.slice(closeTagData.stopPos);

          break;
      }

      return {
        otag,
        ctag,
        partialText
      };
    };
  }
}

PARAMS_APPLIER: {
  var paramsApplyByKeyArrays = function (args) {
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

    if (parseObjKey === 'n' && (paramKeys.includes(tagParseVal) || !contextKeys.includes(tagParseVal))) {
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
  };

  var paramsApplyToParseObj = function (args) {
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
      const paramsWithDotNotation = paramsObjDotNotationParse({
        obj: paramsObj,
        prop_: parseObj.n
      });
      let dataKeys = [];
      let paramKeysNew;
      let paramsObjNew;

      if (paramsWithDotNotation) {
        if (Array.isArray(paramsWithDotNotation)) {
          for (let i = 0, l = paramsWithDotNotation.length; i < l; i++) {
            paramsObjNew = paramsWithDotNotation[i];

            const paramsObjShallowItr = Object.keys(paramsObjNew)[Symbol.iterator]();
            const paramsObjShallowItrn = paramsObjShallowItr.next();
            ({dataKeys} = dataKeysCollect({
              dataKeys_: [],
              dataObjShallowItr: paramsObjShallowItr,
              dataObjShallowItrn: paramsObjShallowItrn,
              dataObj: paramsObjNew,
              parentObjAsStr: '',
              //partialShort // For debugging.
            }));
          }
        }
        else {
          paramsObjNew = paramsWithDotNotation;

          const paramsObjShallowItr = Object.keys(paramsObjNew)[Symbol.iterator]();
          const paramsObjShallowItrn = paramsObjShallowItr.next();
          ({dataKeys} = dataKeysCollect({
            dataKeys_: [],
            dataObjShallowItr: paramsObjShallowItr,
            dataObjShallowItrn: paramsObjShallowItrn,
            dataObj: paramsObjNew,
            parentObjAsStr: '',
            //partialShort // For debugging.
          }));
        }

        paramKeysNew = paramKeys.concat(dataKeys);
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
  };

  var paramsApply = function (args) {
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
  };
}

METHODS: {
  const paramRegex = /\([\S\s]*\)/;

  PRE_PROCESSORS: {
    var partialsCollect = function (args) {
      const {
        compilation,
        contextKeys,
        partials,
        partialsComp,
        partialsKeysItr,
        partialsKeysItrn
      } = args;

      if (partialsKeysItrn.done) {
        return {
          partials,
          partialsComp
        };
      }

      const partialFull = compilation.partials[partialsKeysItrn.value].name;
      let styleModClasses;
      let styleModifierMatch;
      args.partialsKeysItrn = partialsKeysItr.next();

      if (partials[partialFull]) {
        return partialsCollect(args);
      }

      const paramsMatch = partialFull.match(paramRegex);
      let paramsObj;
      let partialShort = partialFull;

      if (paramsMatch) {
        const paramsStr = paramsMatch[0];

        partialShort = partialFull.replace(paramsStr, '');

        ({
          styleModClasses,
          styleModifierMatch
        } = styleModifierExtract({partialName: partialShort}));

        if (partialFull !== partialShort) {
          try {
            paramsObj = jsonEval(`{${paramsStr.slice(1, -1).trim()}}`);
          }
          catch (err) {
            /* istanbul ignore next */
            console.error(err); // eslint-disable-line no-console
            /* istanbul ignore next */
            return partialsCollect(args);
          }

          /* istanbul ignore if */
          if (!paramsObj || paramsObj.constructor !== Object) {
            return partialsCollect(args);
          }
        }
      }
      else {
        ({
          styleModClasses,
          styleModifierMatch
        } = styleModifierExtract({partialName: partialFull}));
      }

      if (styleModifierMatch) {
        partialShort = partialShort.replace(styleModifierMatch[0], '');
      }

      /* istanbul ignore if */
      if (partialShort === partialFull) {
        return partialsCollect(args);
      }

      paramsObj = paramsObj || {};

      if (styleModClasses) {
        paramsObj.styleModifier = styleModClasses;
      }

      const paramsObjShallowItr = Object.keys(paramsObj)[Symbol.iterator]();
      const paramsObjShallowItrn = paramsObjShallowItr.next();
      const {dataKeys} = dataKeysCollect({
        dataKeys_: [],
        dataObjShallowItr: paramsObjShallowItr,
        dataObjShallowItrn: paramsObjShallowItrn,
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

      return partialsCollect(args);
    };

    var preProcessContextKeys = function (context) {
      /* istanbul ignore if */
      if (!context) {
        return {};
      }

      const dataObjShallowItr = Object.keys(context)[Symbol.iterator]();
      const dataObjShallowItrn = dataObjShallowItr.next();
      const {dataKeys} = dataKeysCollect({
        dataKeys_: [],
        dataObjShallowItr,
        dataObjShallowItrn,
        dataObj: context,
        parentObjAsStr: '',
      });
      const contextKeysItr = dataKeys.slice()[Symbol.iterator](); // Cloned so .next() doesn't recompute on added values
      const contextKeysItrn = contextKeysItr.next();
      const {contextKeys} = contextKeysCollect({
        contextKeys_: dataKeys,
        contextKeysItr,
        contextKeysItrn
      });

      return contextKeys;
    };

    var preProcessPartialParams = function (text, compilation_, partials_, partialsComp_, contextKeys_, context) {
      const compilation = compilation_ || hogan.compile(text);
      const partialsKeys = Object.keys(compilation.partials);
      let contextKeys = contextKeys_ || (this && this.contextKeys);
      let _contextKeys;

      // First, check if we still need to preprocess contextKeys because .render() was called statically.
      if (typeof contextKeys === 'undefined') {
        let hasParam = false;

        for (let i of partialsKeys) {
          const partialFull = compilation.partials[i].name;
          hasParam = paramRegex.test(partialFull) || partialFull.includes(':');

          if (hasParam) {
            break;
          }
        }

        if (hasParam) {
          contextKeys = _contextKeys = preProcessContextKeys(context);
        }
        else {
          contextKeys = [];
        }
      }

      const partialsKeysItr = partialsKeys[Symbol.iterator]();
      const partialsKeysItrn = partialsKeysItr.next();
      let partials = partials_ || this.partials || {};
      let partialsComp = partialsComp_ || this.partialsComp || {};

      ({
        partials,
        partialsComp
      } = partialsCollect({
        compilation,
        contextKeys,
        partials,
        partialsComp,
        partialsKeysItr,
        partialsKeysItrn
      }));

      return {
        compilation,
        _contextKeys,
        partials,
        partialsComp
      };
    };
  }

  var compile = function (text, options, partials_, partialsComp_, contextKeys_, context) {
    let compilation = hogan.compile(text, options);
    let contextKeys = contextKeys_ || (this && this.contextKeys);
    let _contextKeys;
    let partials = partials_ || this.partials || {};
    let partialsComp = partialsComp_ || this.partialsComp || {};

    // Remove any reference between partialsArr and partials object because we need to add to the partials object.
    // We therefore do not want to iterate on the partials object itself.
    const partialsArr = Object.values(partials);

    // Using for because .preProcessPartialParams() is an exposed non-recursive method that does not accept an iterator.
    for (let i = 0, l = partialsArr.length; i < l; i++) {
      ({
        _contextKeys,
        partials,
        partialsComp
      } = preProcessPartialParams(partialsArr[i], partialsComp[i], partials, partialsComp, contextKeys, context));
    }

    if (_contextKeys) {
      contextKeys = _contextKeys;
    }

    ({
      compilation
    } = preProcessPartialParams(text, compilation, partials, partialsComp, contextKeys, context));

    return compilation;
  };

  var registerPartial = function (name, partialTemplate, partialComp_, partials_, partialsComp_) {
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
  };

  var render = function (text = '', context_, partials_, partialsComp_, contextKeys_) {
    const context = context_ || this.context || {};
    const contextKeys = contextKeys_ || (this && this.contextKeys);
    let partials = partials_ || this.partials || {};
    let partialsComp = partialsComp_ || this.partialsComp || {};

    // Using for..of because .registerPartial() is an exposed non-recursive method that does not accept an iterator.
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
  };

  var unregisterPartial = function (name, partials_, partialsComp_) {
    const partials = partials_ || this.partials || {};
    const partialsComp = partialsComp_ || this.partialsComp || {};

    delete partials[name];
    delete partialsComp[name];

    return {
      partials,
      partialsComp
    };
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
