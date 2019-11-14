module.exports = {
  testEnvironment: 'jsdom',
  notify: true,
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts'],
  setupFiles: ['<rootDir>/jest.stubs.js'],
};
