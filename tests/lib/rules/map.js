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
      // Верно поскольку символ _ переопределен
      const _ = {};
      const m2 = _.map([], fn);
    `,
    `
      // Верно поскольку символ _ переопределен
      function test(_ = {}) {
        const m2 = _.map([], fn);
      }
    `,
    `
      // Верно поскольку символ _ переопределен
      const _ = {};

      function test(a1) {
        const m2 = _.map([], fn);
      }
    `,
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
      // Верно поскольку map вызыватся для переменной содержащей объект
      const m1 = {a: 1, b: 2};
      const m2 = _.map(m1, fn);
    `,
  ],
  invalid: [
    {
      code: "function A() { return _.map(collection, fn); }",
      errors: [
        { message: "Avoid using variables named \'foo\'" }
      ]
    }
  ]
}
const ruleTester = new ESLintRuleTester();

ruleTester.run("map", MapESLintRule, tests);
