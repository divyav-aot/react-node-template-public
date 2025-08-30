import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import neostandard from 'neostandard';

export default tseslint.config(
  ...neostandard(),
  eslint.configs.recommended,
  tseslint.configs.recommended
);
