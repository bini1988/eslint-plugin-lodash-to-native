/**
 * @fileoverview Rule to transform lodash map function call to native Array.map call
 * @author Nikolai Karastelev
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function hasVariableInScope(scope, name) {
  const variable = scope.variables
  	.find(it => it.name === name);

  if (!!variable) {
    const identifier = variable.identifiers.find(it => it.name === name);

    return (identifier.parent.type !== "ImportDefaultSpecifier");
  } else if (scope.upper && scope.upper.variables.length) {
  	return hasVariableInScope(scope.upper, name)
  }
  return false;
}


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
    return {
      CallExpression(node) {
        if (node.callee.type !== "MemberExpression") { return; }

        if (
          isIdentifierWithName(node.callee.object, "_") &&
          isIdentifierWithName(node.callee.property, "map")
        ) {
          const [collection, predicate] = node.arguments;
          const collectionCode = context.getSource(collection);
          const predicateCode = context.getSource(predicate);
		      const condCode = `Array.isArray(${collectionCode})`;

          // Если проверка на Array.isArray уже есть
          if (
            (node.parent.type === "ConditionalExpression") &&
            (context.getSource(node.parent.test) === condCode)
          ) {
            return;
          }
          // Если аргумент collection является литералом объекта
          if (collection.type === "ObjectExpression") {
            return;
          }
          // Если _ переопределен
          if (hasVariableInScope(context.getScope(node), "_")) {
            return;
          }

          context.report({
            node,
            message: 'Can be replace by Array.map call',
            fix(fixer) {
              const mapCode = `${collectionCode}.map(${predicateCode})`;
              const nodeCode = context.getSource(node);

              if (collection.type === "ArrayExpression") {
              	return [ fixer.replaceText(node, mapCode) ];
              }
              return [
                fixer.replaceText(node, `${condCode} ? ${mapCode} : ${nodeCode}`)
              ];
            },
          });
        }
      },
    };
  }
};
