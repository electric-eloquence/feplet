// For loops are generally replaced by recursion through iterators. This is more verbose, and more difficult to read for
// the uninitiated, but the idea of recursing on .next() values and terminating on .done values should be easy to grasp.
// In accordance with the "functional programming" paradigm, this is useful for traversing nested data structures. In
// addition, since many functions herein add to data structures while recursing through them, we can avoid ambiguity as
// to whether added values are recomputed as .next() values. (They are.) Plain for, for..of, for..in, and forEach loops,
// as well as the .map(), .filter(), and .reduce() Array methods, all do this differently. Neither the loop statements
// nor Array methods inherently imply whether or not recomputation occurs. On the other hand, iterators' .next()
// unambiguously expresses computation on each call.

// We'll try to retain an iteration-instead-of-recursion-where-doable branch for the purpose of comparing performance
// and readability. It can be argued that iterative loop mutation of variables declared outside the scope of said loops
// is an eye (and brain) sore to those who've embraced functional programming.

// Labeled block statements are used to segregate functions into organizational units. We could also achieve this by
// breaking this file into multiple files. However, we need to compile our code into ES5 consumable by less modern
// browsers. Given that this is a relatively small file, it is easier to keep the code in one file.

'use strict';

const hogan = require('../lib/hogan.js/lib/hogan.js');
const jsonEval = require('json-eval');

const paramRegex = /\([\S\s]*\)/;

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

      if (!contextKeys_.includes(contextKeyNew)) {
        contextKeys_.push(contextKeyNew);
      }
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

      if (!dataKeys.includes(dataKey)) {
        dataKeys.push(dataKey);
      }
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

    if (!dataKeys.includes(key) && !parentObjAsStr) {
      dataKeys.push(key);
    }

    // Recurse deeper into dataObj if this property is an instance of Object.
    if (dataObj[key] instanceof Object) {
      const dataObjNestedObj = dataObj[key];
      let l = 1;

      if (Array.isArray(dataObjNestedObj)) {
        l = dataObjNestedObj.length;
      }

      for (let i = 0; i < l; i++) {
        let dataObjItem;

        if (Array.isArray(dataObjNestedObj)) {
          // Recursion into an Array.
          dataObjItem = dataObjNestedObj[i];
        }
        else {
          // Recursion into a plain Object.
          dataObjItem = dataObjNestedObj;
        }

        if (dataObjItem && dataObjItem.constructor === Object) {
          const dataObjItemKeys = Object.keys(dataObjItem);

          if (dataObjItemKeys.length) {
            let dataObjDeeperItr;
            let dataObjDeeperItrn;

            if (dataObjItemKeys.length === 1) {
              dataObjDeeperItr = {
                next: () => {return {done: true};}
              };
              dataObjDeeperItrn = {
                value: dataObjItemKeys[0]
              };
            }
            else {
              dataObjDeeperItr = dataObjItemKeys[Symbol.iterator]();
              dataObjDeeperItrn = dataObjDeeperItr.next();
            }

            let parentObjAsStrNew = parentObjAsStr;

            if (dataObjDeeperItrn.value) {
              if (Array.isArray(dataObjNestedObj)) {
                parentObjAsStrNew += parentObjAsStr ? `.${key}.${i}` : `${key}.${i}`;
              }
              else {
                parentObjAsStrNew += parentObjAsStr ? `.${key}` : key;
              }

              const parentObjSplit = parentObjAsStrNew.split('.');

              ({dataKeys} = dataKeysWithDotNotationAdd({dataKeys, parentObjSplit}));
            }

            // Clone args object for recursion deeper into dataObj.
            const argsDeeper = {
              dataKeys_: dataKeys,
              dataObjShallowItr: dataObjDeeperItr,
              dataObjShallowItrn: dataObjDeeperItrn,
              dataObj: dataObjItem,
              parentObjAsStr: parentObjAsStrNew,
              partialShort: args.partialShort
            };

            ({dataKeys} = dataKeysCollect(argsDeeper));
          }
        }
      }
    }
    else {
      const parentObjSplit = parentObjAsStr ? parentObjAsStr.split('.') : [];

      if (!parentObjSplit.includes(key)) {
        parentObjSplit.push(key);
      }

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
      paramsObjPart,
      parseObjTagName
    } = args;

    const tagNameSplit = parseObjTagName.split('.');
    const tagName0 = tagNameSplit.shift(); // First delimit.
    const tagNameShifted = tagNameSplit.join('.'); // Rest of the dot-delimited tagName.
    let value;

    if (tagName0 in paramsObjPart) {
      const _value = paramsObjPart[tagName0];

      if (_value instanceof Object && tagNameShifted.length) {
        value = paramsObjDotNotationParse({
          paramsObjPart: _value,
          parseObjTagName: tagNameShifted
        });
      }
      else {
        value = _value;
      }
    }

    if (value instanceof Object) {
      return value;
    }
    else {
      // Ok to return null because we only need keys, not values.
      return null;
    }
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
        //partialText = partialText.slice(0, -1) + 'Ü'; // For debugging.
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
        //partialText = partialText.slice(0, -1) + 'ü'; // For debugging.
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
        //partialText = partialText.slice(0, -1) + 'Ü'; // For debugging.
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
        //partialText = partialText.slice(0, -1) + 'ü'; // For debugging.
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
      delimiterUnicodes_,
      tagParseVal,
      paramKeys,
      //paramsObj, // For debugging.
      parseObj,
      parseObjKey,
      //partialShort, // For debugging.
      partialText_
    } = args;

    let delimiterUnicodes;
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
    else if (parseObjKey === 'tag' && !delimiterUnicodes_) {
      otag = parseObj.otag;
      ctag = parseObj.ctag;
    }

    if (!delimiterUnicodes_ && otag && ctag) {
      delimiterUnicodes = '';

      for (let i = 0, l = otag.length; i < l; i++) {
        delimiterUnicodes += '\u0002';
        //delimiterUnicodes = delimiterUnicodes.slice(0, -1) + 'Ü'; // For debugging.
      }

      delimiterUnicodes += ' ';

      for (let i = 0, l = ctag.length; i < l; i++) {
        delimiterUnicodes += '\u0003';
        //delimiterUnicodes = delimiterUnicodes.slice(0, -1) + 'ü'; // For debugging.
      }
    }

    return {
      delimiterUnicodes: delimiterUnicodes || delimiterUnicodes_,
      partialText: partialText || partialText_
    };
  };

  var paramsApplyToParseObj = function (args) {
    const {
      contextKeys,
      delimiterUnicodes_,
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
        delimiterUnicodes: delimiterUnicodes_,
        partialText: partialText_
      };
    }

    const parseObjKey = parseObjKeysItrn.value;
    const tagParse = parseObj[parseObjKey];
    let partialText;
    let delimiterUnicodes;

    if (parseObjKey === 'nodes' && Array.isArray(tagParse)) {
      const paramsWithDotNotation = paramsObjDotNotationParse({
        paramsObjPart: paramsObj,
        parseObjTagName: parseObj.n
      });

      let dataKeys = [];
      let paramKeysNew;
      let paramsObjNew;

      if (paramsWithDotNotation instanceof Object) {
        let l = 1;

        if (Array.isArray(paramsWithDotNotation)) {
          l = paramsWithDotNotation.length;
        }

        for (let i = 0; i < l; i++) {
          if (Array.isArray(paramsWithDotNotation)) {
            // Recursion into an Array.
            paramsObjNew = paramsWithDotNotation[i];
          }
          else {
            // Recursion into a plain Object.
            paramsObjNew = paramsWithDotNotation;
          }

          const paramsObjKeys = Object.keys(paramsObjNew);

          if (paramsObjKeys.length) {
            let paramsObjShallowItr;
            let paramsObjShallowItrn;

            if (paramsObjKeys.length === 1) {
              paramsObjShallowItr = {
                next: () => {return {done: true};}
              };
              paramsObjShallowItrn = {
                value: paramsObjKeys[0]
              };
            }
            else {
              paramsObjShallowItr = paramsObjKeys[Symbol.iterator]();
              paramsObjShallowItrn = paramsObjShallowItr.next();
            }

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

        paramKeysNew = paramKeys.concat(dataKeys);
      }
      else {
        paramKeysNew = paramKeys;
        paramsObjNew = paramsObj;
      }

      if (tagParse.length) {
        let tagParseItr;
        let tagParseItrn;

        if (tagParse.length === 1) {
          tagParseItr = {
            next: () => {return {done: true};}
          };
          tagParseItrn = {
            value: tagParse[0]
          };
        }
        else {
          tagParseItr = tagParse[Symbol.iterator]();
          tagParseItrn = tagParseItr.next();
        }

        ({
          delimiterUnicodes,
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
    }
    else {
      ({
        delimiterUnicodes,
        partialText
      } = paramsApplyByKeyArrays({
        contextKeys,
        delimiterUnicodes_,
        tagParseVal: tagParse,
        paramKeys,
        //paramsObj, // For debugging.
        parseObj,
        parseObjKey,
        //partialShort, // For debugging.
        partialText_
      }));
    }

    args.delimiterUnicodes_ = delimiterUnicodes || delimiterUnicodes_;
    args.parseObjKeysItrn = parseObjKeysItr.next();
    args.partialText_ = partialText || partialText_;

    return paramsApplyToParseObj(args);
  };

  var paramsApply = function (args) {
    const {
      contextKeys,
      delimiterUnicodes_,
      paramKeys,
      paramsObj,
      partialParseItr,
      partialParseItrn,
      //partialShort, // For debugging.
      partialText_
    } = args;

    if (partialParseItrn.done) {
      return {
        delimiterUnicodes: delimiterUnicodes_,
        partialText: partialText_
      };
    }

    const parseObj = partialParseItrn.value;
    const parseObjKeys = Object.keys(parseObj);
    let delimiterUnicodes;
    let partialText;

    if (parseObjKeys.length) {
      // At this point, parseObjKeys.length is always > 1.
      const parseObjKeysItr = parseObjKeys[Symbol.iterator]();
      const parseObjKeysItrn = parseObjKeysItr.next();
      ({
        delimiterUnicodes,
        partialText
      } = paramsApplyToParseObj({
        contextKeys,
        delimiterUnicodes_,
        paramKeys,
        paramsObj,
        parseObj,
        parseObjKeysItr,
        parseObjKeysItrn,
        //partialShort, // For debugging.
        partialText_
      }));
    }

    args.delimiterUnicodes_ = delimiterUnicodes || delimiterUnicodes_;
    args.partialParseItrn = partialParseItr.next();
    args.partialText_ = partialText || partialText_;

    return paramsApply(args);
  };

  var partialsWithParamsAdd = function (args) {
    const {
      compilation,
      contextKeys,
      partials,
      partialsComp,
      partialsKeysItr,
      partialsKeysItrn,
      options
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
      return partialsWithParamsAdd(args);
    }

    const paramsMatch = partialFull.match(paramRegex);
    let paramsObj = {};
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
          return partialsWithParamsAdd(args);
        }

        /* istanbul ignore if */
        if (!paramsObj || paramsObj.constructor !== Object) {
          return partialsWithParamsAdd(args);
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
    if (partialFull === partialShort || !partials[partialShort]) {
      return partialsWithParamsAdd(args);
    }

    if (styleModClasses) {
      paramsObj.styleModifier = styleModClasses;
    }

    const paramsObjKeys = Object.keys(paramsObj);
    let dataKeys;

    if (paramsObjKeys.length) {
      let paramsObjShallowItr;
      let paramsObjShallowItrn;

      if (paramsObjKeys.length === 1) {
        paramsObjShallowItr = {
          next: () => {return {done: true};}
        };
        paramsObjShallowItrn = {
          value: paramsObjKeys[0]
        };
      }
      else {
        paramsObjShallowItr = paramsObjKeys[Symbol.iterator]();
        paramsObjShallowItrn = paramsObjShallowItr.next();
      }

      ({dataKeys} = dataKeysCollect({
        dataKeys_: [],
        dataObjShallowItr: paramsObjShallowItr,
        dataObjShallowItrn: paramsObjShallowItrn,
        dataObj: paramsObj,
        parentObjAsStr: '',
        //partialShort // For debugging.
      }));
    }

    const paramKeys = dataKeys;
    const partialText_ = partials[partialShort] || '';
    let delimiterUnicodes;
    let partialParseArr = [];
    let partialText = '';

    if (partialsComp[partialShort].parseArr) {
      partialParseArr = partialsComp[partialShort].parseArr;
    }
    // DEPRECATED.
    // TODO: This accommodates old usage of partialsComp. To be removed.
    else {
      partialParseArr = hogan.parse(
        hogan.scan(
          partials[partialShort],
          options.delimiters
        ),
        partials[partialShort],
        options
      );
      partialsComp[partialShort] = {
        parseArr: partialParseArr,
        compilation: partialsComp[partialShort]
      };
    }

    if (partialParseArr.length) {
      let partialParseItr;
      let partialParseItrn;

      if (partialParseArr.length === 1) {
        partialParseItr = {
          next: () => {return {done: true};}
        };
        partialParseItrn = {
          value: partialParseArr[0]
        };
      }
      else {
        partialParseItr = partialParseArr[Symbol.iterator]();
        partialParseItrn = partialParseItr.next();
      }

      ({
        delimiterUnicodes,
        partialText
      } = paramsApply({
        contextKeys,
        paramKeys,
        paramsObj,
        partialParseItr,
        partialParseItrn,
        //partialShort, // For debugging.
        partialText_
      }));
    }

    if (delimiterUnicodes && partialText !== partialText_) {
      // First, render with unicode delimiters.
      const optionsWithUnicodes = Object.assign({delimiters: delimiterUnicodes}, options);
      const compilationWithUnicodes = hogan.generate(
        hogan.parse(
          hogan.scan(
            partialText,
            delimiterUnicodes
          ),
          partialText,
          optionsWithUnicodes
        ),
        partialText,
        optionsWithUnicodes
      );
      partials[partialFull] = compilationWithUnicodes.render(paramsObj);
    }

    if (partialFull !== partialShort && !partials[partialFull]) {
      partials[partialFull] = partials[partialShort];
    }

    if (
      (delimiterUnicodes && partialText !== partialText_) ||
      !Object.keys(partialsComp[partialFull]).length
    ) {
      // Then, write to partialsComp with previous render as partial text and with regular delimiters and options.
      const parseArr = hogan.parse(
        hogan.scan(
          partials[partialFull],
          options.delimiters
        ),
        partials[partialFull],
        options
      );
      partialsComp[partialFull] = {
        parseArr,
        compilation: hogan.generate(parseArr, partials[partialFull], options)
      };
    }

    return partialsWithParamsAdd(args);
  };
}

METHODS: {
  var preProcessContextKeys = function (context) {
    /* istanbul ignore if */
    if (!context) {
      return [];
    }

    const contextObjKeys = Object.keys(context);
    let dataKeys = [];

    if (contextObjKeys.length) {
      let dataObjShallowItr;
      let dataObjShallowItrn;

      if (contextObjKeys.length === 1) {
        dataObjShallowItr = {
          next: () => {return {done: true};}
        };
        dataObjShallowItrn = {
          value: contextObjKeys[0]
        };
      }
      else {
        dataObjShallowItr = contextObjKeys[Symbol.iterator]();
        dataObjShallowItrn = dataObjShallowItr.next();
      }

      ({dataKeys} = dataKeysCollect({
        dataKeys_: [],
        dataObjShallowItr,
        dataObjShallowItrn,
        dataObj: context,
        parentObjAsStr: '',
      }));
    }

    let contextKeys = [];

    if (dataKeys.length) {
      let contextKeysItr;
      let contextKeysItrn;

      if (dataKeys.length === 1) {
        contextKeysItr = {
          next: () => {return {done: true};}
        };
        contextKeysItrn = {
          value: dataKeys[0]
        };
      }
      else {
        contextKeysItr = dataKeys.slice()[Symbol.iterator](); // Cloned so .next() doesn't recompute added values.
        contextKeysItrn = contextKeysItr.next();
      }

      ({contextKeys} = contextKeysCollect({
        contextKeys_: dataKeys,
        contextKeysItr,
        contextKeysItrn
      }));
    }

    return contextKeys;
  };

  var preProcessPartialParams =
  function (text, compilation_, partials_, partialsComp_, contextKeys_, context, options_) {
    const options = options_ || this.options || {};
    const compilation = compilation_ || hogan.compile(text, options);
    const partialsKeys = Object.keys(compilation.partials);
    let contextKeys = contextKeys_ || (this && this.contextKeys);
    let _contextKeys;

    // First, check if we still need to preprocess contextKeys because .render() was called statically.
    if (typeof contextKeys === 'undefined') {
      let hasParam = false;

      for (let i = 0, l = partialsKeys.length; i < l; i++) {
        const partialFull = compilation.partials[partialsKeys[i]].name;
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

    let partials = partials_ || this.partials || {};
    let partialsComp = partialsComp_ || this.partialsComp || {};

    if (partialsKeys.length) {
      let partialsKeysItr;
      let partialsKeysItrn;

      if (partialsKeys.length === 1) {
        partialsKeysItr = {
          next: () => {return {done: true};}
        };
        partialsKeysItrn = {
          value: partialsKeys[0]
        };
      }
      else {
        partialsKeysItr = partialsKeys[Symbol.iterator]();
        partialsKeysItrn = partialsKeysItr.next();
      }

      ({
        partials,
        partialsComp
      } = partialsWithParamsAdd({
        compilation,
        contextKeys,
        partials,
        partialsComp,
        partialsKeysItr,
        partialsKeysItrn,
        options
      }));
    }

    return {
      compilation,
      _contextKeys, // Only defined if hasParam.
      partials,
      partialsComp
    };
  };

  var compile = function (text, options_, partials_, partialsComp_, contextKeys_, context) {
    const options = options_ || this.options || {};
    let compilation = hogan.compile(text, options);
    let contextKeys = contextKeys_ || (this && this.contextKeys);
    let _contextKeys;
    let partials = partials_ || this.partials || {};
    let partialsComp = partialsComp_ || this.partialsComp || {};

    const partialsKeys = Object.keys(partials);

    // Using for because .preProcessPartialParams() is an exposed non-recursive method that does not accept an iterator.
    for (let i = 0, l = partialsKeys.length; i < l; i++) {
      const partialKey = partialsKeys[i];

      // DEPRECATED.
      // TODO: This accommodates old usage of partialsComp. To be removed.
      if (!partialsComp[partialKey].compilation) {
        const parseArr = hogan.parse(
          hogan.scan(
            partials[partialKey],
            options.delimiters
          ),
          partials[partialKey],
          options
        );
        partialsComp[partialKey] = {
          parseArr,
          compilation: partialsComp[partialKey]
        };
      }

      ({
        _contextKeys,
        partials,
        partialsComp
      } = preProcessPartialParams(
        partials[partialKey],
        partialsComp[partialKey].compilation,
        partials,
        partialsComp,
        contextKeys,
        context,
        options
      ));
    }

    if (_contextKeys) {
      contextKeys = _contextKeys;
    }

    ({
      compilation
    } = preProcessPartialParams(
      text,
      compilation,
      partials,
      partialsComp,
      contextKeys,
      context,
      options
    ));

    return compilation;
  };

  var registerPartial = function (partialName, partialTemplate, partialComp_, partials_, partialsComp_, options_) {
    const partials = partials_ || this.partials || {};
    const partialsComp = partialsComp_ || this.partialsComp || {};
    const options = options_ || this.options || {};

    if (!partials[partialName]) {
      partials[partialName] = partialTemplate;
    }

    if (!partialsComp[partialName]) {
      if (partialComp_) {
        partialsComp[partialName] = partialComp_;
      }
      else {
        const parseArr = hogan.parse(hogan.scan(partialTemplate, options.delimiters));

        partialsComp[partialName] = {
          parseArr,
          compilation: hogan.generate(parseArr, partialTemplate, options)
        };
      }
    }

    return {
      partials,
      partialsComp
    };
  };

  var render = function (text = '', context_, partials_, partialsComp_, contextKeys_, options_) {
    const context = context_ || this.context || {};
    const contextKeys = contextKeys_ || (this && this.contextKeys);
    const options = options_ || this.options || {};
    let partials = partials_ || this.partials || {};
    let partialsComp = partialsComp_ || this.partialsComp || {};
    let partialsKeys = Object.keys(partials);

    // Using for loop because .registerPartial() is an exposed non-recursive method that does not accept an iterator.
    for (let i = 0, l = partialsKeys.length; i < l; i++) {
      const partialKey = partialsKeys[i];

      if (!partialsComp[partialKey]) {
        ({
          partials,
          partialsComp
        } = registerPartial(partialKey, partials[partialKey], null, partials, partialsComp, options));
      }
    }

    let compilation;

    if (Object.keys(partialsComp).length) {
      compilation = compile(text, options, partials, partialsComp, contextKeys, context);
    }
    else {
      compilation = hogan.compile(text, options);
    }

    return compilation.render(context, partials, null, partialsComp);
  };

  var unregisterPartial = function (partialKey, partials_, partialsComp_) {
    const partials = partials_ || this.partials || {};
    const partialsComp = partialsComp_ || this.partialsComp || {};

    delete partials[partialKey];
    delete partialsComp[partialKey];

    return {
      partials,
      partialsComp
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
else if (typeof window === 'object') {
  window.Feplet = Feplet;
}

module.exports = Feplet;
