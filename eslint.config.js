import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import pluginReact from 'eslint-plugin-react';

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
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
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
