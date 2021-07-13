'use strict';
const path = require('path');
const LineByLine = require('n-readlines');

const JsFileRegex = /\.js$/;
const HbsFileRegex = /\.hbs$/;
const featureEnabledRegexJSComment = /(?:\/\/\s*@remove-if-(enabled|disabled)\s+([\w"]+))|(?:\/\*\s*@remove-if-(enabled|disabled)\s+([\w"]+)\s*\*\/)/;
const featureEnabledRegexHBSComment = /(?:{{!--\s*@remove-if-(enabled|disabled)\s+([\w"]+)\s*?--}})|(?:<!--\s*@remove-if-(enabled|disabled)\s+([\w"]+)\s*-->)/;

function getFirstLine(fileName, directoryPath) {
  const liner = new LineByLine(path.resolve(path.join(directoryPath, fileName)));
  const firstLine = liner.next().toString();
  try {
    liner.close();
  } catch {
    // Noop
  }
  return firstLine;
}

module.exports = function createExcludeFilter(features, directoryPath) {
  return function exclude(fileName) {
    if (JsFileRegex.test(fileName)) {
      const match = getFirstLine(fileName, directoryPath).match(featureEnabledRegexJSComment);
      if (match) {
        const condition = match[1] || match[3];
        const featureName = match[2] || match[4];
        if (featureName[0] === '"') {
          throw new Error(`The name of the feature passed to @remove-if-${condition} must be unquoted`);
        }
        const featureValue = features[featureName];
        return condition === 'enabled' ? !!featureValue : !featureValue;
      } else {
        return false;
      }
    } else if (HbsFileRegex.test(fileName)) {
      const match = getFirstLine(fileName, directoryPath).match(featureEnabledRegexHBSComment);
      if (match) {
        const condition = match[1] || match[3];
        const featureName = match[2] || match[4];
        if (featureName[0] === '"') {
          throw new Error(`The name of the feature passed to @remove-if-${condition} must be unquoted`);
        }
        const featureValue = features[featureName];
        return condition === 'enabled' ? !!featureValue : !featureValue;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};
