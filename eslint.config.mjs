import config from '@ofk/eslint-config-recommend';

export default config({
  extends: [
    {
      files: ['**/*.test.*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'import/no-nodejs-modules': 'off',
      },
    },
  ],
  ignores: ['coverage', 'dist', 'examples', 'lib/build', 'src/__snapshots__', 'src/libarchive.js'],
});
