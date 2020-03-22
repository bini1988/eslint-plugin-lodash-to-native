'use strict';

const ESLintRuleTester = require('eslint').RuleTester;
const MapESLintRule  = require("../../../lib/rules/map");

ESLintRuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

const tests = {
  valid: [
    `
      // Верно для вызова функций отличных от _.map
      const m2 = _.filter([], fn);
    `,
    `
      // Верно для вызова функций Array.map
      const m2 = [].map(fn);
    `,
    `
      // Верно поскольку map вызыватся для объекта
      const m2 = _.map({a: 1, b: 2}, fn);
    `,
    `
      // Верно поскольку символ _ переопределен
      const _ = {};

      function test(a1) {
        const m2 = _.map(collection, fn);
      }
    `,
  ],
  invalid: [
    {
      code: `function A() {
        return _.map(collection, fn);
      }`,
      output: `function A() {
        return Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn);
      }`,
      errors: [
        { message: "Can be replace by Array.map call" }
      ]
    }, {
      code: `
      import _ from "lodash";

      function A() {
        return _.map(collection, fn);
      }`,
      output: `
      import _ from "lodash";

      function A() {
        return Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn);
      }`,
      errors: [
        { message: "Can be replace by Array.map call" }
      ]
    }, {
      code: `function A(user, controller) {
        return _.map(user.accounts, controller.apply.test);
      }`,
      output: `function A(user, controller) {
        return Array.isArray(user.accounts) ? user.accounts.map(controller.apply.test) : _.map(user.accounts, controller.apply.test);
      }`,
      errors: [
        { message: "Can be replace by Array.map call" }
      ]
    }, {
      code: `function A() {
        return _.map([1, 2, 3], fn);
      }`,
      output: `function A() {
        return [1, 2, 3].map(fn);
      }`,
      errors: [
        { message: "Can be replace by Array.map call" }
      ]
    }
  ]
}
const ruleTester = new ESLintRuleTester();

ruleTester.run("map", MapESLintRule, tests);
