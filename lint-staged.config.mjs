export default {
  'app/**/*.{js,ts,tsx,vue,mjs,cjs}': [
    'eslint --config app/eslint.config.mjs --fix --max-warnings=0',
    'prettier --write',
  ],
  '{api,kernel,supabase}/**/*.ts': [
    'eslint --config eslint.config.mjs --fix --max-warnings=0',
    'prettier --write',
  ],
  '*.{json,md,yml,yaml,css,scss,html}': ['prettier --write'],
  '*.{js,mjs,cjs}': ['prettier --write'],
}
