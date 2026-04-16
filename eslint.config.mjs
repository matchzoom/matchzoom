import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import boundaries from 'eslint-plugin-boundaries';
import globals from 'globals';

export default [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/global.d.ts',
      'node_modules/**',
      'dist/**',
      '*.config.js',
      '*.config.ts',
      'commitlint.config.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: importPlugin,
      prettier,
      react,
      'react-hooks': reactHooks,
      boundaries,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: { version: 'detect' },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'widgets', pattern: 'src/widgets/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'shared', pattern: 'src/shared/**' },
      ],
      'boundaries/ignore': ['**/*.test.*', '**/*.spec.*'],
    },
    rules: {
      'no-unused-vars': 'off',
      'prettier/prettier': 'error',
      ...prettierConfig.rules,
      'react/react-in-jsx-scope': 'off',
      'no-undef': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // FSD 단방향 의존성 규칙
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'app', allow: ['widgets', 'features', 'shared'] },
            { from: 'widgets', allow: ['features', 'shared'] },
            { from: 'features', allow: ['shared'] },
            { from: 'shared', allow: [] },
          ],
        },
      ],
    },
  },
];
