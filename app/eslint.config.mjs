import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'dist/**',
      'coverage/**',
      'drizzle/**',
      '.vite-ssg-temp/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  eslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Enterprise policy: bracket access (obj['x']) and enum are allowed.
      '@typescript-eslint/no-restricted-types': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': 'off',
      'vue/multi-word-component-names': 'off',

      // Enterprise policy: bracket access (obj['x']) and enum are allowed.
      '@typescript-eslint/no-restricted-types': 'off',
    },
  },
  eslintConfigPrettier,
)
