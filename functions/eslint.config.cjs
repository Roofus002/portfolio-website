const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "node_modules/**",
    ],
  },

  js.configs.recommended,

  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",

      globals: {
        ...globals.node,
      },
    },

    rules: {
      "no-restricted-globals": [
        "error",
        "name",
        "length",
      ],

      "prefer-arrow-callback": "error",

      "quotes": [
        "error",
        "double",
        {
          allowTemplateLiterals: true,
        },
      ],
    },
  },

  {
    files: ["**/*.spec.*"],

    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
];