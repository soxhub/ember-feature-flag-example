'use strict';
const funnel = require('broccoli-funnel');
const createExcludeFilter = require('./create-exclude-filter');

module.exports = function cleanFeatureFlags(env, features, tree = 'app') {
  if (env !== 'production') {
    return tree;
  }
  const directoryPath = typeof tree === 'string' ? tree : tree._directoryPath;
  return funnel(tree, {
    exclude: [createExcludeFilter(features, directoryPath || 'app')],
  });
};
