const { RuleTester } = require("eslint");
const rule = require("../../../lib/rules/map");

const ruleTester = new RuleTester();

ruleTester.run("map", rule, {
  valid: [
    {
      code: "function A() { return _.map(collection, fn); }",
    }
  ],
  invalid: [
    {
      code: "function A() { return _.map(collection, fn); }",
      errors: [
        { message: "Avoid using variables named \'foo\'" }
      ]
    }
  ]
});
