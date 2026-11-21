import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import oxcParser from "eslint-parser-oxc";

export default [
    {
        "ignores": [
            "**/node_modules/*",
            "**/dist",
            "**/build",
            "**/json",
            "**/@types",
            "**/.github",
            "**/*.test.ts"
        ]
    },
    {
        "files": ["**/*.ts"],
        "plugins": {
            "unused-imports": unusedImports
        },
        "languageOptions": {
            "globals": {
                ...globals.browser
            },

            "parser": oxcParser,
            "ecmaVersion": "latest",
            "sourceType": "module"
        },

        "rules": {
            "no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",

            // 引数の未使用チェックは tsc の noUnusedParameters に任せる
            // (ESLint 本体の no-unused-vars は interface や関数型の引数を誤検知するため)
            "unused-imports/no-unused-vars": ["warn", {
                "vars": "all",
                "varsIgnorePattern": "^_",
                "args": "none"
            }],

            "no-var": "error",
            "prefer-const": "error",
            "prefer-rest-params": "error",
            "prefer-spread": "error",

            "semi": ["error", "always", {
                "omitLastInOneLineBlock": true
            }],

            "block-spacing": "error",

            "indent": ["error", 4, {
                "SwitchCase": 1
            }],

            "no-mixed-spaces-and-tabs": "error",

            "no-multiple-empty-lines": ["error", {
                "max": 1
            }],

            "no-trailing-spaces": "error",
            "space-infix-ops": "error",
            "dot-notation": "error",
            "eqeqeq": "error",
            "quotes": ["error", "double"],
            "no-else-return": "error",
            "no-loop-func": "error",
            "arrow-parens": "error",
            "arrow-spacing": "error",
            "no-undef": "off",
            "comma-dangle": "warn",
            "no-use-before-define": "off",
            "no-const-assign": "error",
            "space-before-blocks": "error",
            "no-unexpected-multiline": "error",
            "object-curly-spacing": ["error", "always"],
            "quote-props": ["error", "always"],

            "max-len": ["error", {
                "code": 200,
                "ignoreStrings": true,
                "ignoreComments": true,
                "ignoreTemplateLiterals": true
            }],

            "no-debugger": "error",
            "no-dupe-keys": "error",
            "no-duplicate-case": "error",
            "no-empty": "error",
            "no-extra-parens": "error",
            "no-func-assign": "error",
            "no-irregular-whitespace": "error",
            "no-sparse-arrays": "error",
            "no-unreachable": "error",
            "no-unsafe-negation": "error",
            "use-isnan": "error",
            "block-scoped-var": "error",
            "no-caller": "error",
            "curly": "error",
            "no-case-declarations": "error",
            "no-floating-decimal": "error",
            "no-eq-null": "error",
            "no-empty-function": "error",
            "no-empty-pattern": "error",
            "no-extend-native": "error",
            "dot-location": ["error", "property"],
            "no-global-assign": "error",
            "no-implicit-globals": "error",
            "no-invalid-this": "error",
            "no-lone-blocks": "error",
            "no-iterator": "error",
            "no-new": "error",
            "no-proto": "error",
            "no-return-assign": "error",
            "no-self-assign": "error",
            "no-self-compare": "error",
            "no-useless-concat": "error",
            "no-useless-call": "error",
            "no-useless-return": "error",
            "no-unused-expressions": "error",
            "no-class-assign": "error",
            "no-sequences": "error",
            "no-dupe-args": "error",
            "no-extra-boolean-cast": "error",
            "no-obj-calls": "error",
            "no-console": "off",
            "no-extra-semi": "warn"
        }
    }
];