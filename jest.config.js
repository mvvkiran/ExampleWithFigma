module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/e2e-tests/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'node',
        target: 'ES2022',
        module: 'commonjs'
      }
    }]
  },
  testTimeout: 60000,
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './e2e-tests/reports/html-report',
      filename: 'report.html',
      expand: true
    }]
  ]
};