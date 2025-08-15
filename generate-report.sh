#!/bin/bash

# E2E Test Report Generator Script

echo "================================================"
echo "E2E Test Report Generator"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create reports directory structure
mkdir -p e2e-tests/reports/html-report
mkdir -p e2e-tests/reports/allure-results
mkdir -p e2e-tests/reports/screenshots

# Check if HTML report exists
if [ -f "e2e-tests/reports/html-report/report.html" ]; then
    echo -e "${GREEN}✓ HTML Report found!${NC}"
    echo -e "${BLUE}Opening HTML report in browser...${NC}"
    
    # Try multiple methods to open the file
    if command -v open >/dev/null 2>&1; then
        open "file://$(pwd)/e2e-tests/reports/html-report/report.html" 2>/dev/null || \
        open -a "Google Chrome" "$(pwd)/e2e-tests/reports/html-report/report.html" 2>/dev/null || \
        open -a "Safari" "$(pwd)/e2e-tests/reports/html-report/report.html" 2>/dev/null || \
        echo -e "${YELLOW}Could not auto-open browser. Please manually open:${NC}"
    fi
    
    FULL_PATH="$(pwd)/e2e-tests/reports/html-report/report.html"
    echo -e "${GREEN}Report location: file://${FULL_PATH}${NC}"
    echo -e "${BLUE}Copy and paste the above URL into your browser${NC}"
    exit 0
fi

# Check if we have test results to generate Allure report
if [ -d "e2e-tests/reports/allure-results" ] && [ "$(ls -A e2e-tests/reports/allure-results 2>/dev/null)" ]; then
    echo -e "${YELLOW}Generating Allure report from existing results...${NC}"
    npx allure generate e2e-tests/reports/allure-results -o e2e-tests/reports/allure-report --clean
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Allure report generated successfully!${NC}"
        echo -e "${BLUE}Opening Allure report in browser...${NC}"
        npx allure open e2e-tests/reports/allure-report
        exit 0
    fi
fi

# No reports found - offer to run tests
echo -e "${YELLOW}No test reports found!${NC}"
echo ""
echo "To generate a test report, you need to run the E2E tests first:"
echo -e "${BLUE}  npm run e2e${NC}         - Run all tests"
echo -e "${BLUE}  npm run e2e:home${NC}    - Run home page tests only"
echo -e "${BLUE}  npm run e2e:dashboard${NC} - Run dashboard tests only"
echo ""
echo -e "${YELLOW}Would you like to run a quick test now? [y/N]${NC}"
read -r response

if [[ "$response" == "y" || "$response" == "Y" ]]; then
    echo -e "${YELLOW}Starting Angular development server and running home page tests...${NC}"
    echo ""
    npm run e2e:home
    
    # After tests complete, try to open the HTML report
    if [ -f "e2e-tests/reports/html-report/report.html" ]; then
        echo -e "${GREEN}✓ Opening test report...${NC}"
        FULL_PATH="$(pwd)/e2e-tests/reports/html-report/report.html"
        echo -e "${GREEN}Report location: file://${FULL_PATH}${NC}"
        open "file://${FULL_PATH}" 2>/dev/null || echo -e "${BLUE}Please open the file URL above in your browser${NC}"
    else
        echo -e "${YELLOW}Report will be available after tests complete.${NC}"
    fi
else
    echo -e "${BLUE}Run tests first, then use 'npm run e2e:report' to view the report.${NC}"
    exit 0
fi