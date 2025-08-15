#!/bin/bash

# E2E Test Runner Script
# This script runs Selenium WebDriver tests for the Angular application

echo "================================================"
echo "Starting E2E Regression Test Suite"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
export BASE_URL=${BASE_URL:-"http://localhost:4200"}
export BROWSER=${BROWSER:-"chrome"}
export HEADLESS=${HEADLESS:-"false"}

# Check if Angular app is running
check_app_running() {
    echo -e "${YELLOW}Checking if Angular app is running at $BASE_URL...${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL)
    if [[ "$HTTP_CODE" =~ ^(200|302|304)$ ]]; then
        echo -e "${GREEN}✓ Angular app is running (HTTP $HTTP_CODE)${NC}"
        return 0
    else
        echo -e "${RED}✗ Angular app is not running (HTTP $HTTP_CODE)${NC}"
        return 1
    fi
}

# Start Angular app if not running
start_angular_app() {
    echo -e "${YELLOW}Starting Angular development server...${NC}"
    npm start &
    APP_PID=$!
    
    # Wait for app to be ready
    for i in {1..30}; do
        if check_app_running; then
            echo -e "${GREEN}✓ Angular app started successfully${NC}"
            return 0
        fi
        echo "Waiting for app to start... ($i/30)"
        sleep 2
    done
    
    echo -e "${RED}✗ Failed to start Angular app${NC}"
    return 1
}

# Clean up function
cleanup() {
    if [ ! -z "$APP_PID" ]; then
        echo -e "${YELLOW}Stopping Angular development server...${NC}"
        kill $APP_PID 2>/dev/null
    fi
}

# Set up trap for cleanup
trap cleanup EXIT

# Main execution
main() {
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --headless)
                export HEADLESS="true"
                echo "Running tests in headless mode"
                shift
                ;;
            --browser)
                export BROWSER="$2"
                echo "Using browser: $BROWSER"
                shift 2
                ;;
            --url)
                export BASE_URL="$2"
                echo "Using base URL: $BASE_URL"
                shift 2
                ;;
            --test)
                TEST_FILE="$2"
                shift 2
                ;;
            --help)
                echo "Usage: ./run-e2e-tests.sh [options]"
                echo "Options:"
                echo "  --headless        Run tests in headless mode"
                echo "  --browser <name>  Browser to use (chrome, firefox, edge)"
                echo "  --url <url>       Base URL of the application"
                echo "  --test <file>     Specific test file to run"
                echo "  --help           Show this help message"
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                exit 1
                ;;
        esac
    done

    # Check if app is running, start if not
    if ! check_app_running; then
        start_angular_app || exit 1
    fi

    # Create reports directory if it doesn't exist
    mkdir -p e2e-tests/reports/screenshots
    mkdir -p e2e-tests/reports/allure-results

    echo ""
    echo "================================================"
    echo "Test Configuration:"
    echo "  Base URL: $BASE_URL"
    echo "  Browser: $BROWSER"
    echo "  Headless: $HEADLESS"
    echo "================================================"
    echo ""

    # Run tests
    if [ ! -z "$TEST_FILE" ]; then
        echo -e "${YELLOW}Running specific test: $TEST_FILE${NC}"
        npx jest "$TEST_FILE" --verbose
    else
        echo -e "${YELLOW}Running all E2E tests...${NC}"
        npx jest --verbose
    fi

    TEST_EXIT_CODE=$?

    # Generate Allure report if tests completed
    if [ -d "e2e-tests/reports/allure-results" ]; then
        echo ""
        echo -e "${YELLOW}Generating Allure report...${NC}"
        npx allure generate e2e-tests/reports/allure-results -o e2e-tests/reports/allure-report --clean
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Allure report generated at: e2e-tests/reports/allure-report${NC}"
            echo "  To view the report, run: npx allure open e2e-tests/reports/allure-report"
        fi
    fi

    # Summary
    echo ""
    echo "================================================"
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}✓ All tests passed successfully!${NC}"
    else
        echo -e "${RED}✗ Some tests failed. Check the report for details.${NC}"
    fi
    echo "================================================"

    exit $TEST_EXIT_CODE
}

# Run main function
main "$@"