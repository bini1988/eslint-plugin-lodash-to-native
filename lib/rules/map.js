/**
 * @fileoverview Rule to transform lodash map function call to native Array.map call
 * @author Nikolai Karastelev
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------


function isIdentifierWithName(node, name) {
  return (
    (node.type === "Identifier") &&
    (node.name === name)
  );
}

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
    const sourceCode = context.getSourceCode();

    return {
      CallExpression(node) {
        if (node.callee.type !== "MemberExpression") { return; }

        if (
          isIdentifierWithName(node.callee.object, "_") &&
          isIdentifierWithName(node.callee.property, "map")
        ) {
          const [collection, predicate] = node.arguments;

          context.report({
            node,
            message: 'Can be replace by Array.map call',
            fix(fixer) {
              const collectionCode = sourceCode.text.slice(...collection.range);
              const predicateCode = sourceCode.text.slice(...predicate.range);

              const condCode = `Array.isArray(${collectionCode})`;
              const leftCode = `${collectionCode}.map(${predicateCode})`;
              const rightCode = sourceCode.text.slice(...node.range);

              return [
                fixer.replaceText(node, `${condCode} ? ${leftCode} : ${rightCode}`)
              ];
            },
          });
        }
      },
    };
  }
};
