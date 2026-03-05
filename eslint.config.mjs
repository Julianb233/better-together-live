import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/', '.vercel/', '*.config.*']
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      // Too many intentional `as any` casts from Phase 3 database migration decisions
      '@typescript-eslint/no-explicit-any': 'off',
      // Flag unused variables as errors (prefix with _ to ignore)
      // TODO: Change to 'error' once unused vars are cleaned up (51 violations as of Phase 8)
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Flag console.* as warnings to track migration to pino (warn, not error, so CI passes)
      'no-console': 'warn',
    }
  }
)
