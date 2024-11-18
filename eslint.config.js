import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import pluginReact from 'eslint-plugin-react';
import pluginReactCompiler from 'eslint-plugin-react-compiler';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginImport from 'eslint-plugin-import';
import pluginImportSort from 'eslint-plugin-simple-import-sort';

/**
 * Inspect how this eslint config is being applied by running `npx eslint --inspect-config`
 */

export default tseslint.config(
  {
    name: 'ezpz/ignores',
    ignores: ['supabase/**', 'build', 'dist', 'scripts'],
  },
  {
    name: 'ezpz/base',
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [eslint.configs.recommended],
  },
  {
    name: 'ezpz/react',
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        projectService: true,
        projectFolderIgnoreList: ['./supabase/functions/**'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: fixupPluginRules(pluginReact),
      'react-compiler': pluginReactCompiler,
      'react-hooks': fixupPluginRules(pluginReactHooks),
      'react-refresh': fixupPluginRules(pluginReactRefresh),
      import: pluginImport,
      'simple-import-sort': pluginImportSort,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      'react-compiler/react-compiler': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unsafe-call': 'off',

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^\\u0000'],
            ['^node:'],
            ['^react'],
            ['^'],
            ['^@?\\w'],
            ['^@/'],
            ['^\\.\\.'],
            ['^\\.'],
            ['^.+\\.s?css$', '^.+\\.svg$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
    },
  },
  {
    name: 'ezpz/js',
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  }
);
