/**
 * @fileoverview Rule to transform lodash map function call to native Array.map call
 * @author Nikolai Karastelev
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Transform lodash map function call to native Array.map call",
      category: "Best Practices",
      recommended: false,
      url: "https://github.com/bini1988/eslint-plugin-lodash-to-native/blob/master/docs/rules/map.md"
    },
    fixable: "code",
    schema: [],
  },
  create: function(context) {
    return {};
  }
};
