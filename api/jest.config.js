module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: [
    'src'
  ],
  testEnvironment: 'node',
  testTimeout: 30000,
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage'
}
