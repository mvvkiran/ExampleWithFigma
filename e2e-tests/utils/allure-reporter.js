const { AllureRuntime, InMemoryAllureWriter } = require('allure-js-commons');

class AllureReporter {
  constructor(globalConfig, options) {
    this.globalConfig = globalConfig;
    this.options = options;
    this.runtime = new AllureRuntime({
      resultsDir: options.outputDir || './e2e-tests/reports/allure-results'
    });
  }

  onRunStart() {
    console.log('Starting Allure reporter...');
  }

  onTestResult(test, testResult) {
    const suite = testResult.testResults[0];
    if (suite) {
      const { status, title, failureMessages } = suite;
      console.log(`Test ${title}: ${status}`);
      
      if (status === 'failed' && failureMessages.length > 0) {
        console.error('Failure:', failureMessages.join('\n'));
      }
    }
  }

  onRunComplete() {
    console.log('Allure reporter completed.');
  }
}

module.exports = AllureReporter;