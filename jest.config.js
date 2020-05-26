const sveltePreprocess = require('svelte-preprocess');
const svelteConfig = require('./svelte.config');

module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'svelte'],
  transform: {
    '^.+\\.svelte$': ['jest-transform-svelte', svelteConfig],
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
