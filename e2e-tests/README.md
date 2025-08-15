# E2E Regression Test Suite

This directory contains a comprehensive Selenium WebDriver-based regression test suite for the Angular application.

## 📋 Features

- **Page Object Model (POM)** design pattern for maintainable tests
- **Cross-browser testing** support (Chrome, Firefox, Edge)
- **Headless mode** for CI/CD pipelines
- **Visual regression testing** with screenshots
- **Allure reporting** for detailed test results
- **Parallel test execution** capability
- **Retry mechanism** for flaky tests
- **Responsive testing** across different viewports

## 🏗️ Architecture

```
e2e-tests/
├── config/           # Test configuration and test data
├── pages/            # Page Object Model classes
├── tests/            # Test suites
├── utils/            # Helper utilities and driver factory
└── reports/          # Test reports and screenshots
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Chrome browser installed (or Firefox/Edge for alternative browsers)
- Angular application running or available

### Installation
Dependencies are already installed via npm. If needed, reinstall:
```bash
npm install
```

### Running Tests

#### Run all tests
```bash
npm run e2e
```

#### Run tests in headless mode
```bash
npm run e2e:headless
```

#### Run specific test suites
```bash
npm run e2e:home        # Home page tests only
npm run e2e:dashboard   # Dashboard tests only
npm run e2e:full        # Full regression suite
```

#### Custom configurations
```bash
# Use different browser
./run-e2e-tests.sh --browser firefox

# Use different URL
./run-e2e-tests.sh --url https://staging.example.com

# Combine options
./run-e2e-tests.sh --headless --browser edge --url https://prod.example.com
```

## 📊 Test Reports

### Allure Reports
After tests complete, view the detailed Allure report:
```bash
npm run e2e:report
```

### Screenshots
Screenshots are automatically captured:
- On test failures
- For visual regression tests
- Located in: `e2e-tests/reports/screenshots/`

## 🧪 Test Coverage

### Home Page Tests
- Page load and basic elements
- Navigation functionality
- Interactive elements (buttons, links)
- Content display
- Responsive design
- Performance metrics
- Error handling

### Dashboard Tests
- Product display and grid
- Search functionality
- Filter and sort operations
- Product interactions
- Pagination
- Data integrity
- Performance benchmarks

### Full Regression Suite
- Cross-page navigation
- End-to-end user journeys
- Application stability
- Browser navigation (back/forward)
- Performance baselines
- Accessibility checks
- Visual regression

## ⚙️ Configuration

### Test Configuration (`config/test.config.ts`)
```typescript
{
  baseUrl: 'http://localhost:4200',
  browser: 'chrome',
  headless: false,
  timeout: {
    implicit: 10000,
    pageLoad: 30000,
    script: 30000
  },
  viewport: {
    width: 1920,
    height: 1080
  }
}
```

### Environment Variables
- `BASE_URL` - Application URL (default: http://localhost:4200)
- `BROWSER` - Browser to use (default: chrome)
- `HEADLESS` - Run in headless mode (default: false)

## 🔧 Extending Tests

### Adding New Page Objects
1. Create new page class in `pages/` extending `BasePage`
2. Define locators and actions
3. Import and use in tests

Example:
```typescript
export class NewPage extends BasePage {
  private get element(): By {
    return By.css('.selector');
  }
  
  async performAction(): Promise<void> {
    await this.helpers.click(this.element);
  }
}
```

### Adding New Tests
1. Create test file in `tests/` directory
2. Import required page objects
3. Write test cases using Jest syntax

Example:
```typescript
describe('New Feature Tests', () => {
  test('should perform expected behavior', async () => {
    // Test implementation
  });
});
```

## 🐛 Debugging

### Enable Debug Mode
Set `headless: false` in config to watch tests execute

### Take Screenshots During Tests
```typescript
await page.takeScreenshot('debug-screenshot');
```

### Increase Timeouts for Debugging
```typescript
TestConfig.timeout.implicit = 30000; // 30 seconds
```

## 📝 Best Practices

1. **Use Page Object Model** - Keep selectors and actions in page classes
2. **Avoid hard-coded waits** - Use explicit waits instead
3. **Make tests independent** - Each test should run in isolation
4. **Use descriptive test names** - Clearly describe what is being tested
5. **Handle test data properly** - Use config file for test data
6. **Clean up after tests** - Reset state when necessary
7. **Add retry logic** - For handling transient failures
8. **Take screenshots** - For debugging failures

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run E2E Tests
  run: |
    npm ci
    npm run e2e:headless
  
- name: Upload Test Results
  if: always()
  uses: actions/upload-artifact@v2
  with:
    name: test-results
    path: e2e-tests/reports/
```

### Jenkins Pipeline Example
```groovy
stage('E2E Tests') {
  steps {
    sh 'npm ci'
    sh 'npm run e2e:headless'
  }
  post {
    always {
      archiveArtifacts 'e2e-tests/reports/**/*'
    }
  }
}
```

## 🆘 Troubleshooting

### Common Issues

#### Chrome driver version mismatch
```bash
npm install chromedriver@latest
```

#### Port 4200 already in use
```bash
lsof -i :4200  # Find process
kill -9 <PID>  # Kill process
```

#### Tests timing out
- Increase timeout values in config
- Check if application is running
- Verify network connectivity

#### Screenshots not being captured
- Check directory permissions
- Ensure `screenshots.path` directory exists

## 📚 Resources

- [Selenium WebDriver Documentation](https://www.selenium.dev/documentation/webdriver/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Allure Report Documentation](https://docs.qameta.io/allure/)
- [Page Object Model Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)

## 📄 License

This test suite is part of the main application and follows the same license.