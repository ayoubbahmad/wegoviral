import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
// import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'storybook-static/**',
  ]),
  {
    // Creator Space prototype screens still run on loosely typed sample data;
    // tighten this back to an error as each screen moves to a real, typed API
    files: [
      'src/containers/{Home,Videos,VideoAnalysis,Scripts,Projects,ProjectDetails,Performance,Followers,Automations,competitors,Library}/**',
      'src/views/{Library,VideoAnalysis,Videos,Scripts,Projects,Home,Automations,CompetitorDetail,ScriptCreation}/**',
      'src/app/(dashboard)/creator/**',
    ],
    rules: { '@typescript-eslint/no-explicit-any': 'warn' },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    // plugins: {
    //   next: eslintNextPlugin,
    // },
    settings: {
      next: {
        rootDir: './src',
      },
    },
  },
]);

export default eslintConfig;
