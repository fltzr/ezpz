import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import pluginReact from 'eslint-plugin-react';
import pluginReactCompiler from 'eslint-plugin-react-compiler';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react: fixupPluginRules(pluginReact),
      'react-compiler': pluginReactCompiler,
      'react-hooks': fixupPluginRules(pluginReactHooks),
      'react-refresh': fixupPluginRules(pluginReactRefresh),
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      'react-compiler/react-compiler': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  }
);
