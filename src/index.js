// This package embraces functional programming to the extent that JavaScript allows. The benefits are mainly
// theoretical and educational. Being able to think functionally will be extremely valuable when working in languages
// that *are* purely functional.

// We'll try to retain an iteration-instead-of-recursion-where-doable branch for the purpose of comparing performance.
// Fortunately, the functional master branch does not suffer from performance-loss compared to the more imperative
// branch.

// Labeled block statements are used to organize functions into logical divisions. We could also achieve this by
// breaking this file into multiple files. However, we need to compile our code into ES5 consumable by less modern
// browsers. Given that this is a relatively small file, it is easier to keep the code in one file.

'use strict';

const hogan = require('../lib/hogan.js/lib/hogan.js');
const jsonEval = require('json-eval');

const paramRegex = /\([\S\s]*\)/;

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

      const counter = (function spacesCountInPartialText_(index) {
        if (/\s/.test(partialText_[index])) {
          return spacesCountInPartialText_(index + inc);
        }
        else {
          return index;
        }
      })(count_);

      let count;

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

      let partialTextArr = [];

      partialTextArr[0] = parseObj.otag.replace(/./g, '\u0002');
      //partialTextArr[0] = parseObj.otag.replace(/./g, '֍'); // For debugging.

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

      partialTextArr = (function partialTextSlice(partialTextArr_, index) {
        if (index < space0StopPos) {
          const indexNew = index + 1;

          partialTextArr_.push(partialText_[indexNew]);

          return partialTextSlice(partialTextArr_, indexNew);
        }
        else {
          return partialTextArr_;
        }
      })(partialTextArr, space0StartPos);

      partialTextArr.push(parseObj.n);

      partialTextArr = (function partialTextSlice(partialTextArr_, index) {
        if (index < space1StopPos) {
          const indexNew = index + 1;

          partialTextArr_.push(partialText_[indexNew]);

          return partialTextSlice(partialTextArr_, indexNew);
        }
        else {
          return partialTextArr_;
        }
      })(partialTextArr, space1StartPos);

      switch (parseObj.tag) {
        case '{':
          partialTextArr.push(' ');
      }

      const l = partialTextArr.length;

      partialTextArr[l] = parseObj.otag.replace(/./g, '\u0003');
      //partialTextArr[l] = parseObj.otag.replace(/./g, '֎'); // For debugging.;

      return {
        partialText: partialTextArr.join('')
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

      let partialTextArr = [];

      partialTextArr[0] = parseObj.otag.replace(/./g, '\u0002');
      //partialTextArr[0] = parseObj.otag.replace(/./g, '֍'); // For debugging.

      partialTextArr.push('/');

      partialTextArr = (function partialTextSlice(partialTextArr_, index) {
        if (index < space0StopPos) {
          partialTextArr_.push(partialText_[index]);

          return partialTextSlice(partialTextArr_, index + 1);
        }
        else {
          return partialTextArr_;
        }
      })(partialTextArr, space0StartPos);

      partialTextArr.push(parseObj.n);

      partialTextArr = (function partialTextSlice(partialTextArr_, index) {
        if (index < space1StopPos) {
          partialTextArr_.push(partialText_[index]);

          return partialTextSlice(partialTextArr_, index + 1);
        }
        else {
          return partialTextArr_;
        }
      })(partialTextArr, space1StartPos);

      const l = partialTextArr.length;

      partialTextArr[l] = parseObj.otag.replace(/./g, '\u0003');
      //partialTextArr[l] = parseObj.otag.replace(/./g, '֎'); // For debugging.;

      return {
        partialText: partialTextArr.join('')
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

COLLECTORS: {
  var contextKeysCollect = function (args) {
    const {
      contextKey
    } = args;
    let {
      contextKeys
    } = args;

    args.contextKeys = (function dotSlice(dottedString, contextKeys_) {
      const dotIndex = dottedString.indexOf('.');
      const slicedString = dottedString.slice(dotIndex + 1);

      if (dotIndex > -1 && !contextKeys_.includes(slicedString)) {
        contextKeys_.push(slicedString);

        return dotSlice(slicedString, contextKeys_);
      }
      else {
        return contextKeys_;
      }
    })(contextKey, contextKeys);

    return args;
  };

  var dataKeysWithDotNotationAdd = function (args) {
    const {
      parentObjSplit,
      dataKeys
    } = args;

    if (parentObjSplit.length) {
      parentObjSplit.reduce((dataKey_, itemNext) => {
        const dataKey = dataKey_ + '.' + itemNext;

        if (!dataKeys.includes(dataKey)) {
          dataKeys.push(dataKey);
        }

        return dataKey;
      });
    }

    return {dataKeys};
  };

  // Declaring with const effectively makes this function private to this block.
  const dataKeysGetFromDataObj = function (dataObjItem, dataKeys_, addlArgs, index = 0) {
    const {
      dataObjNestedObj,
      dataKey,
      parentObjAsStr,
      partialShort
    } = addlArgs;

    const dataObjItemKeys = Object.keys(dataObjItem);
    let dataKeys;

    if (dataObjItemKeys.length) {
      let parentObjAsStrNew = parentObjAsStr;

      if (Array.isArray(dataObjNestedObj)) {
        parentObjAsStrNew += parentObjAsStr ? `.${dataKey}.${index}` : `${dataKey}.${index}`;
      }
      else {
        parentObjAsStrNew += parentObjAsStr ? `.${dataKey}` : dataKey;
      }

      const parentObjSplit = parentObjAsStrNew.split('.');

      ({dataKeys} = dataKeysWithDotNotationAdd({dataKeys: dataKeys_, parentObjSplit}));

      const _this = this;

      ({dataKeys} = dataObjItemKeys.reduce(
        (dataStructures, dataKey) => {
          let {
            dataKeys,
            dataObj,
            parentObjAsStr,
            partialShort
          } = dataStructures;

          ({dataKeys} = dataKeysCollect.call( // eslint-disable-line no-use-before-define
            _this,
            {
              dataKey,
              dataKeys,
              dataObj,
              parentObjAsStr,
              partialShort
            }
          ));

          return {
            dataKeys,
            dataObj,
            parentObjAsStr,
            partialShort
          };
        },
        {
          dataKeys,
          dataObj: dataObjItem,
          parentObjAsStr: parentObjAsStrNew,
          partialShort
        }
      ));
    }

    return {
      dataKeys: dataKeys || dataKeys_
    };
  };

  var dataKeysCollect = function (args) {
    const {
      dataKey,
      dataObj,
      parentObjAsStr,
      partialShort
    } = args;
    let {
      dataKeys
    } = args;

    if (!dataKeys.includes(dataKey) && !parentObjAsStr) {
      dataKeys.push(dataKey);
    }

    // Recurse deeper into dataObj if this property is an instance of Object.
    if (dataObj[dataKey] instanceof Object) {
      const dataObjNestedObj = dataObj[dataKey];

      if (Array.isArray(dataObjNestedObj)) {
        if (dataObjNestedObj.length) {
          const _this = this;

          ({dataKeys} = dataObjNestedObj.reduce(
            (dataStructures, dataObjItem, index) => {
              let {dataKeys} = dataStructures;

              ({dataKeys} = dataKeysGetFromDataObj.call(
                _this,
                dataObjItem,
                dataKeys,
                {
                  dataObjNestedObj,
                  dataKey,
                  parentObjAsStr,
                  partialShort
                },
                index
              ));

              return {dataKeys};
            },
            {dataKeys}
          ));
        }
      }
      else {
        ({dataKeys} = dataKeysGetFromDataObj(
          dataObjNestedObj,
          dataKeys,
          {
            dataObjNestedObj,
            dataKey,
            parentObjAsStr,
            partialShort
          }
        ));
      }
    }
    else {
      const parentObjSplit = parentObjAsStr ? parentObjAsStr.split('.') : [];

      if (!parentObjSplit.includes(dataKey)) {
        parentObjSplit.push(dataKey);
      }

      ({dataKeys} = dataKeysWithDotNotationAdd({dataKeys, parentObjSplit}));
    }

    return args;
  };
}

PARAMS_APPLIER: {
  // Declaring with const effectively makes this function private to this block.
  const dataKeysGetFromParamsObj = function (paramsObj, dataKeys_) {
    const paramsObjKeys = Object.keys(paramsObj);
    let dataKeys;

    if (paramsObjKeys.length) {
      const _this = this;

      ({dataKeys} = paramsObjKeys.reduce(
        (dataStructures, dataKey) => {
          let {
            dataKeys,
            dataObj,
            parentObjAsStr
          } = dataStructures;

          ({dataKeys} = dataKeysCollect.call(
            _this,
            {
              dataKey,
              dataKeys,
              dataObj,
              parentObjAsStr
            }
          ));

          return {
            dataKeys,
            dataObj,
            parentObjAsStr
          };
        },
        {
          dataKeys: dataKeys_,
          dataObj: paramsObj,
          parentObjAsStr: ''
        }
      ));
    }

    return {
      dataKeys: dataKeys || dataKeys_
    };
  };

  var paramsApplyByKeyArrays = function (args) {
    const {
      contextKeys,
      delimiterUnicodes_,
      tagParseVal,
      paramKeys,
      parseObj,
      parseObjKey,
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
      const delimiterOpen = otag.split('').reduce((acc) => {
        let retVal = acc + '\u0002';
        //retVal = retVal.slice(0, -1) + '֍'; // For debugging.

        return retVal;
      }, '');

      const delimiterClose = ctag.split('').reduce((acc) => {
        let retVal = acc + '\u0003';
        //retVal = retVal.slice(0, -1) + '֎'; // For debugging.

        return retVal;
      }, '');

      delimiterUnicodes = delimiterOpen + ' ' + delimiterClose;
    }

    return {
      delimiterUnicodes: delimiterUnicodes || delimiterUnicodes_,
      partialText: partialText || partialText_
    };
  };

  var paramsApply = function (args) {
    const {
      contextKeys,
      paramKeys,
      paramsObj,
      parseObj
    } = args;
    let {
      delimiterUnicodes_,
      partialText
    } = args;

    const parseObjKeys = Object.keys(parseObj);
    let delimiterUnicodes;

    if (parseObjKeys.length) {
      const _this = this;

      ({
        delimiterUnicodes,
        partialText
      } = parseObjKeys.reduce(
        (dataStructures, parseObjKey) => {
          const {
            contextKeys,
            paramKeys,
            paramsObj,
            parseObj
          } = dataStructures;
          let {
            delimiterUnicodes,
            partialText
          } = dataStructures;

          ({
            delimiterUnicodes,
            partialText
          } = paramsApplyToParseObj.call( // eslint-disable-line no-use-before-define
            _this,
            {
              contextKeys,
              delimiterUnicodes_: delimiterUnicodes,
              paramKeys,
              paramsObj,
              parseObj,
              parseObjKey,
              partialText_: partialText
            }
          ));

          return {
            contextKeys,
            delimiterUnicodes,
            paramKeys,
            paramsObj,
            parseObj,
            partialText
          };
        },
        {
          contextKeys,
          delimiterUnicodes,
          paramKeys,
          paramsObj,
          parseObj,
          partialText
        }
      ));
    }

    return {
      delimiterUnicodes: delimiterUnicodes || delimiterUnicodes_,
      partialText
    };
  };

  var paramsApplyToParseObj = function (args) {
    const {
      contextKeys,
      delimiterUnicodes_,
      paramKeys,
      paramsObj,
      parseObj,
      parseObjKey,
      partialText_
    } = args;

    const tagParse = parseObj[parseObjKey];
    let partialText = partialText_;
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
        if (Array.isArray(paramsWithDotNotation)) {
          if (paramsWithDotNotation.length) {
            const _this = this;

            ({dataKeys} = paramsWithDotNotation.reduce(
              (dataStructures, dataObjItem) => {
                let {dataKeys} = dataStructures;

                ({dataKeys} = dataKeysGetFromParamsObj.call(
                  _this,
                  dataObjItem,
                  dataKeys
                ));

                return {dataKeys};
              },
              {dataKeys}
            ));
          }
        }
        else {
          ({dataKeys} = dataKeysGetFromParamsObj(
            paramsWithDotNotation,
            dataKeys
          ));
        }

        paramsObjNew = paramsWithDotNotation;
        paramKeysNew = paramKeys.concat(dataKeys);
      }
      else {
        paramKeysNew = paramKeys;
        paramsObjNew = paramsObj;
      }

      if (tagParse.length) {
        const _this = this;

        ({
          delimiterUnicodes,
          partialText
        } = tagParse.reduce(
          (dataStructures, parseObj) => {
            const {
              contextKeys,
              paramKeys,
              paramsObj
            } = dataStructures;
            let {
              delimiterUnicodes,
              partialText
            } = dataStructures;

            ({
              delimiterUnicodes,
              partialText
            } = paramsApply.call(
              _this,
              {
                contextKeys,
                delimiterUnicodes_: delimiterUnicodes,
                paramKeys,
                paramsObj,
                parseObj,
                partialText
              }
            ));

            return {
              contextKeys,
              delimiterUnicodes,
              paramKeys,
              paramsObj,
              partialText
            };
          },
          {
            contextKeys,
            delimiterUnicodes: delimiterUnicodes_,
            paramKeys: paramKeysNew,
            paramsObj: paramsObjNew,
            partialText
          }
        ));
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
        parseObj,
        parseObjKey,
        partialText_
      }));
    }

    return {
      delimiterUnicodes: delimiterUnicodes || delimiterUnicodes_,
      partialText: partialText || partialText_
    };
  };

  var partialsWithParamsAdd = function (args) {
    const {
      compilation,
      contextKeys,
      partials,
      partialsComp,
      partialsKey,
      options
    } = args;

    const partialFull = compilation.partials[partialsKey].name;
    let styleModClasses;
    let styleModifierMatch;

    if (partials[partialFull]) {
      return args;
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
          return args;
        }

        /* istanbul ignore if */
        if (!paramsObj || paramsObj.constructor !== Object) {
          return args;
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
      return args;
    }

    if (styleModClasses) {
      paramsObj.styleModifier = styleModClasses;
    }

    const paramsObjKeys = Object.keys(paramsObj);
    let dataKeys;

    if (paramsObjKeys.length) {
      const _this = this;

      ({dataKeys} = paramsObjKeys.reduce(
        (dataStructures, dataKey) => {
          let {
            dataKeys,
            dataObj,
            parentObjAsStr
          } = dataStructures;

          ({dataKeys} = dataKeysCollect.call(
            _this,
            {
              dataKey,
              dataKeys,
              dataObj,
              parentObjAsStr
            }
          ));

          return {
            dataKeys,
            dataObj,
            parentObjAsStr
          };
        },
        {
          dataKeys: [],
          dataObj: paramsObj,
          parentObjAsStr: ''
        }
      ));
    }

    const paramKeys = dataKeys;
    const partialText_ = partials[partialShort] || '';
    let delimiterUnicodes;
    let partialParseArr = [];
    let partialText = '';

    if (partialsComp[partialShort].parseArr) {
      partialParseArr = partialsComp[partialShort].parseArr;
    }

    if (partialParseArr.length) {
      const _this = this;

      ({
        delimiterUnicodes,
        partialText
      } = partialParseArr.reduce(
        (dataStructures, parseObj) => {
          const {
            contextKeys,
            paramKeys,
            paramsObj
          } = dataStructures;
          let {
            delimiterUnicodes,
            partialText
          } = dataStructures;

          ({
            delimiterUnicodes,
            partialText
          } = paramsApply.call(
            _this,
            {
              contextKeys,
              delimiterUnicodes_: delimiterUnicodes,
              paramKeys,
              paramsObj,
              parseObj,
              partialText
            }
          ));

          return {
            contextKeys,
            delimiterUnicodes,
            paramKeys,
            paramsObj,
            partialText
          };
        },
        {
          contextKeys,
          delimiterUnicodes,
          paramKeys,
          paramsObj,
          partialText: partialText_
        }
      ));
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

    return args;
  };
}

METHODS: {
  var preProcessContextKeys = function (context) {
    /* istanbul ignore if */
    if (!context) {
      return [];
    }

    const contextArgKeys = Object.keys(context);
    let dataKeys = [];

    if (contextArgKeys.length) {
      const _this = this;

      ({dataKeys} = contextArgKeys.reduce(
        (dataStructures, dataKey) => {
          let {
            dataKeys,
            dataObj,
            parentObjAsStr
          } = dataStructures;

          ({dataKeys} = dataKeysCollect.call(
            _this,
            {
              dataKey,
              dataKeys,
              dataObj,
              parentObjAsStr
            }
          ));

          return {
            dataKeys,
            dataObj,
            parentObjAsStr
          };
        },
        {
          dataKeys,
          dataObj: context,
          parentObjAsStr: '',
        }
      ));
    }

    let contextKeys = [];

    if (dataKeys.length) {
      const _this = this;

      ({contextKeys} = dataKeys.reduce(
        (dataStructures, contextKey) => {
          let {contextKeys} = dataStructures;

          ({contextKeys} = contextKeysCollect.call(
            _this,
            {
              contextKey,
              contextKeys
            }
          ));

          return {contextKeys};
        },
        {
          contextKeys: dataKeys.slice()
        }
      ));
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
    if (typeof contextKeys === 'undefined' && partialsKeys.length) {
      const hasParam = partialsKeys.reduce((acc, partialsKey) => {
        const partialFull = compilation.partials[partialsKey].name;

        if (paramRegex.test(partialFull) || partialFull.includes(':')) {
          return acc + 1;
        }
        else {
          return acc;
        }
      }, 0);

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
      const _this = this;

      partialsKeys.reduce(
        (dataStructures, partialsKey) => {
          const {
            compilation,
            contextKeys,
            options
          } = dataStructures;
          let {
            partials,
            partialsComp
          } = dataStructures;

          ({
            partials,
            partialsComp
          } = partialsWithParamsAdd.call(
            _this,
            {
              compilation,
              contextKeys,
              partials,
              partialsComp,
              partialsKey,
              options
            }
          ));

          return {
            compilation,
            contextKeys,
            partials,
            partialsComp,
            options
          };
        },
        {
          compilation,
          contextKeys,
          partials,
          partialsComp,
          options
        }
      );
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

    if (partialsKeys.length) {
      const _this = this;

      ({
        _contextKeys,
        partials,
        partialsComp
      } = partialsKeys.reduce(
        (dataStructures, partialsKey) => {
          const {
            context,
            contextKeys,
            options
          } = dataStructures;
          let {
            _contextKeys,
            partials,
            partialsComp
          } = dataStructures;

          ({
            _contextKeys,
            partials,
            partialsComp
          } = preProcessPartialParams.call(
            _this,
            partials[partialsKey],
            partialsComp[partialsKey].compilation,
            partials,
            partialsComp,
            contextKeys,
            context,
            options
          ));

          return {
            context,
            contextKeys,
            _contextKeys,
            partials,
            partialsComp,
            options
          };
        },
        {
          context,
          contextKeys,
          _contextKeys,
          partials,
          partialsComp,
          options
        }
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
    const partialsKeys = Object.keys(partials);

    if (partialsKeys.length) {
      const _this = this;

      ({
        partials,
        partialsComp
      } = partialsKeys.reduce(
        (dataStructures, partialsKey) => {
          const {
            partials,
            partialsComp,
            options
          } = dataStructures;

          return registerPartial.call(
            _this,
            partialsKey,
            partials[partialsKey],
            null,
            partials,
            partialsComp,
            options
          );
        },
        {
          partials,
          partialsComp,
          options
        }
      ));
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
