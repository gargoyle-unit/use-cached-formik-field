module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'no-shadow': ['warn', { builtinGlobals: false, hoist: 'functions', allow: [] }],
        'react/prop-types': 'off',
        'react-hooks/exhaustive-deps': 'off',
        'no-inferrable-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
};
