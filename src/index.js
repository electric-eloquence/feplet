// This package embraces functional programming to the extent that JavaScript allows. The benefits are mainly
// theoretical and educational. Being able to think functionally will be extremely valuable when working in languages
// that *are* purely functional, or paradigms that are strongly functional.

// We'll try to retain an iteration-instead-of-recursion-where-doable branch for the purpose of comparing performance.
// Fortunately, the functional master branch performs strongly compared to the more imperative branch.

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

  // TODO: prepare this to be DEPRECATED.
  // It appears that Pattern Lab has dropped documentation of styleModifiers. If this persists to the point that it
  // should be considered permanent, DEPRECATE and then remove all functionality for and references to styleModifiers.
  // @see {@link https://patternlab.io/docs/installing-pattern-lab/} (There appears to be no documentation index page.)
  var styleModifierExtract = function (args) {
    const {
      partialName
    } = args;

    // eslint-disable-next-line no-useless-escape
    const styleModifierMatch = partialName.match(/\:([\w\-\|]+)/);
    let styleModClasses;
    let styleModifierMatchNew;

    if (styleModifierMatch && styleModifierMatch[1]) {
      styleModClasses = styleModifierMatch[1].replace(/\|/g, ' ').trim();

      /* istanbul ignore else */
      if (styleModClasses) {
        styleModifierMatchNew = styleModifierMatch;
      }
      else {
        styleModifierMatchNew = null;
      }
    }
    else {
      styleModClasses = '';
      styleModifierMatchNew = styleModifierMatch;
    }

    // Because we search and replace structured object properties to shorten the file prior to minification, we cannot
    // use "styleModifier" or other function substrings as structured object property names. "styleModifier" is also
    // reserved as a property name on paramsObj. Using "styleModClasses" instead.
    return {
      styleModClasses,
      styleModifierMatch: styleModifierMatchNew
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

      let stopPos;

      switch (parseObj.tag) {
        case '{':
          stopPos = parseObj.i + 1;
          break;
        default:
          stopPos = parseObj.i;
      }

      let space1StopPos;

      switch (parseObj.tag) {
        case '{':
          space1StopPos = stopPos - 1 - parseObj.ctag.length - 1;
          break;
        default:
          space1StopPos = stopPos - 1 - parseObj.ctag.length;
      }

      const spacesCount1 = spacesCount({count_: space1StopPos, inc: -1, partialText_}).count;
      const space1StartPos = space1StopPos - spacesCount1;
      const space0StopPos = space1StartPos - parseObj.n.length;
      const spacesCount0 = spacesCount({count_: space0StopPos, inc: -1, partialText_}).count;
      const space0StartPos = space0StopPos - spacesCount0;

      let startPos;

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

      const partialTextArr = ['\u0002'.repeat(parseObj.otag.length)];
      //partialTextArr[0] = '֍'.repeat(parseObj.otag.length); // For debugging.

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

      partialTextArr.push('\u0003'.repeat(parseObj.ctag.length));
      //partialTextArr[partialTextArr.length - 1] = '֎'.repeat(parseObj.ctag.length); // For debugging.

      return {
        partialText: partialTextArr.join('')
      };
    };

    var closeTagParse = function (args) {
      const {
        parseObj,
        partialText_
      } = args;

      const startPos = parseObj.end;
      const space0StartPos = startPos + parseObj.otag.length + parseObj.tag.length;
      const spacesCount0 = spacesCount({count_: space0StartPos, inc: +1, partialText_}).count;
      const space0StopPos = space0StartPos + spacesCount0;
      const space1StartPos = space0StopPos + parseObj.n.length;
      const spacesCount1 = spacesCount({count_: space1StartPos, inc: +1, partialText_}).count;
      const space1StopPos = space1StartPos + spacesCount1;
      const stopPos = space1StopPos + parseObj.otag.length;

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

      const partialTextArr = ['\u0002'.repeat(parseObj.otag.length)];
      //partialTextArr[0] = '֍'.repeat(parseObj.otag.length); // For debugging.

      partialTextArr.push('/');
      partialTextArr.push(partialText_.slice(space0StartPos, space0StopPos));
      partialTextArr.push(parseObj.n);
      partialTextArr.push(partialText_.slice(space1StartPos, space1StopPos));
      partialTextArr.push('\u0003'.repeat(parseObj.ctag.length));
      //partialTextArr[partialTextArr.length - 1] = '֎'.repeat(parseObj.ctag.length); // For debugging.

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
      let partialText;

      switch (parseObj.tag) {
        case '#':
        case '$':
        case '&':
        case '<':
        case '^':
        case '_v':
        case '{':

          /* eslint-disable no-case-declarations */
          const openTagData = openTagParse({parseObj, partialText_});
          let closeTagData;

          switch (parseObj.tag) {
            case '#':
            case '$':
            case '&':
            case '<':
            case '^':
              closeTagData = closeTagParse({parseObj, partialText_});
          }

          if (!closeTagData) {
            partialText =
              partialText_.substring(0, openTagData.startPos) +
              startOfTextEncode({openTagData, parseObj, partialText_}).partialText +
              partialText_.slice(openTagData.stopPos);

            break;
          }

          partialText =
            partialText_.substring(0, openTagData.startPos) +
            startOfTextEncode({openTagData, parseObj, partialText_}).partialText +
            partialText_.substring(openTagData.stopPos, closeTagData.startPos) +
            endOfTextEncode({closeTagData, parseObj, partialText_}).partialText +
            partialText_.slice(closeTagData.stopPos);

          break;
      }

      return {
        otag,
        ctag,
        partialText: partialText || ''
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
      let parentObjAsStrNew;

      if (Array.isArray(dataObjNestedObj)) {
        parentObjAsStrNew = parentObjAsStr + (parentObjAsStr ? `.${dataKey}.${index}` : `${dataKey}.${index}`);
      }
      else {
        parentObjAsStrNew = parentObjAsStr + (parentObjAsStr ? `.${dataKey}` : dataKey);
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
      let delimiterOpen = '\u0002'.repeat(otag.length);
      //delimiterOpen = '֍'.repeat(otag.length); // For debugging.

      let delimiterClose = '\u0003'.repeat(ctag.length);
      //delimiterClose = '֎'.repeat(ctag.length); // For debugging.

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
    let paramsObj;
    let partialShort;

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
      paramsObj = {};
      partialShort = partialFull;

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
    let partialParseArr;
    let partialText;

    if (partialsComp[partialShort].parseArr) {
      partialParseArr = partialsComp[partialShort].parseArr;
    }
    else {
      partialParseArr = [];
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
    else {
      partialText = '';
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

    let contextKeys;

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
    else {
      contextKeys = [];
    }

    return contextKeys;
  };

  var preProcessPartialParams =
  function (text, compilation_, partials_, partialsComp_, contextKeys_, context, options_) {
    const options = options_ || this.options || {};
    const compilation = compilation_ || hogan.compile(text, options);
    const partialsKeys = Object.keys(compilation.partials);
    const contextKeysOrig = contextKeys_ || (this && this.contextKeys);
    let contextKeys;
    let _contextKeys;

    // First, check if we still need to preprocess contextKeys because .render() was called statically.
    if (typeof contextKeysOrig === 'undefined' && partialsKeys.length) {
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
    else {
      contextKeys = contextKeysOrig;
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
    const contextKeysOrig = contextKeys_ || (this && this.contextKeys);
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
          contextKeys: contextKeysOrig,
          _contextKeys,
          partials,
          partialsComp,
          options
        }
      ));
    }

    const contextKeys = _contextKeys || contextKeysOrig;
    let compilation = hogan.compile(text, options);

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
