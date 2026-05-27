import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/.vite-ssg-temp/**',
      'app/**',
      '.husky/**',
      'eslint.config.mjs',
      'lint-staged.config.mjs',
      'commitlint.config.cjs',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['{api,kernel,supabase}/**/*.ts'],
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

      // Enterprise policy: bracket access (obj['x']) and enum are allowed.
      '@typescript-eslint/no-restricted-types': 'off',
    },
  },
  eslintConfigPrettier,
)
