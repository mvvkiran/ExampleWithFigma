# 🧪 Functional Test Cases - Product Management System

## Application Overview
This Angular application is a **Product Management System** with two main components:
- **Home Page**: Landing page with feature overview and navigation
- **Product Dashboard**: Main dashboard for managing Apple products with analytics

---

## 🏠 HOME PAGE TEST CASES

### **TC-H001: Page Loading and Basic Elements**

#### **Test Scenario**: Verify home page loads successfully with all required elements
- **Pre-condition**: User navigates to application URL
- **Test Steps**:
  1. Navigate to `http://localhost:4200`
  2. Verify page loads within 3 seconds
  3. Check that page title contains "Example"
  4. Verify main heading displays "Welcome to Product Management System"
  5. Verify subtitle displays "Manage your products and view analytics from your dashboard"

**Expected Result**: ✅ Page loads successfully with all elements visible
**Priority**: High | **Type**: Smoke Test

---

### **TC-H002: Feature Cards Display**

#### **Test Scenario**: Verify all feature cards are displayed with correct content
- **Test Steps**:
  1. Navigate to home page
  2. Verify 4 feature cards are displayed
  3. Check each card has:
     - Icon (📊, 📈, 🛍️, ⚙️)
     - Title (Product Dashboard, Analytics, Orders, Settings)
     - Description text
     - Action button

**Expected Result**: ✅ All 4 feature cards display with correct content and icons
**Priority**: Medium | **Type**: Functional

---

### **TC-H003: Dashboard Navigation**

#### **Test Scenario**: Verify navigation to Product Dashboard works correctly
- **Test Steps**:
  1. Navigate to home page
  2. Locate "Product Dashboard" feature card
  3. Click "Go to Dashboard" button
  4. Verify navigation to `/dashboard` route
  5. Verify dashboard page loads successfully

**Expected Result**: ✅ Successfully navigates to dashboard page
**Priority**: High | **Type**: Integration

---

### **TC-H004: Coming Soon Buttons**

#### **Test Scenario**: Verify "Coming Soon" functionality for future features
- **Test Steps**:
  1. Navigate to home page
  2. Click "Coming Soon" buttons on Analytics, Orders, and Settings cards
  3. Verify buttons are disabled or show appropriate message
  4. Verify no navigation occurs

**Expected Result**: ✅ Coming Soon buttons behave appropriately without navigation
**Priority**: Low | **Type**: Functional

---

### **TC-H005: Responsive Design**

#### **Test Scenario**: Verify home page is responsive across different screen sizes
- **Test Steps**:
  1. Open home page on desktop (1920x1080)
  2. Verify layout is properly arranged
  3. Resize to tablet (768x1024)
  4. Verify cards stack appropriately
  5. Resize to mobile (375x667)
  6. Verify mobile-friendly layout

**Expected Result**: ✅ Page maintains usability across all screen sizes
**Priority**: Medium | **Type**: UI/UX

---

## 📊 PRODUCT DASHBOARD TEST CASES

### **TC-D001: Dashboard Page Loading**

#### **Test Scenario**: Verify dashboard loads with all main sections
- **Pre-condition**: User navigates directly to `/dashboard`
- **Test Steps**:
  1. Navigate to `/dashboard`
  2. Verify page loads within 5 seconds
  3. Check sidebar is visible with user profile
  4. Verify main content area loads
  5. Verify dashboard header shows "Dashboard" title

**Expected Result**: ✅ Dashboard loads completely with all sections visible
**Priority**: High | **Type**: Smoke Test

---

### **TC-D002: User Profile Display**

#### **Test Scenario**: Verify user profile information in sidebar
- **Test Steps**:
  1. Navigate to dashboard
  2. Locate user profile section in sidebar
  3. Verify user name displays "Wildan"
  4. Verify role displays "Creative Director"
  5. Check avatar placeholder is present

**Expected Result**: ✅ User profile displays correct information
**Priority**: Medium | **Type**: Data Display

---

### **TC-D003: Navigation Menu**

#### **Test Scenario**: Verify sidebar navigation menu structure
- **Test Steps**:
  1. Navigate to dashboard
  2. Verify "Dashboard" item is marked as active
  3. Check "Analytics" menu item exists
  4. Verify "ACCOUNT" section contains:
     - Account, My Publishing, Products, Orders, More
  5. Verify "OTHER MENU" section contains:
     - Setting, Help, Subscriptions

**Expected Result**: ✅ All navigation items are present and properly organized
**Priority**: Medium | **Type**: Navigation

---

### **TC-D004: Search Functionality**

#### **Test Scenario**: Verify search bar in sidebar
- **Test Steps**:
  1. Navigate to dashboard
  2. Locate search input in sidebar
  3. Verify placeholder text shows "Search"
  4. Type test query in search field
  5. Verify input accepts text

**Expected Result**: ✅ Search bar accepts input (Note: Backend functionality not implemented)
**Priority**: Low | **Type**: Input Validation

---

### **TC-D005: December Income Statistics**

#### **Test Scenario**: Verify December income card displays correct data
- **Test Steps**:
  1. Navigate to dashboard
  2. Locate "December income" stat card
  3. Verify value displays "$287,000"
  4. Check tags show "# Macbook m2" and "# iPhone 15"
  5. Verify positive change indicator shows "↑ 18,24%"

**Expected Result**: ✅ Income statistics display correctly with proper formatting
**Priority**: High | **Type**: Data Display

---

### **TC-D006: December Sales Statistics**

#### **Test Scenario**: Verify December sales card displays correct data
- **Test Steps**:
  1. Navigate to dashboard
  2. Locate "December sales" stat card  
  3. Verify value displays "4.5k"
  4. Check details show "1,272 iPhone 15" and "675 Macbook"
  5. Verify negative change indicator shows "↓ 9,18%"

**Expected Result**: ✅ Sales statistics display correctly with proper calculations
**Priority**: High | **Type**: Data Display

---

### **TC-D007: December Report Section**

#### **Test Scenario**: Verify report section functionality
- **Test Steps**:
  1. Navigate to dashboard
  2. Locate December Report section
  3. Verify title "December Report" is displayed
  4. Check description text is present
  5. Verify "Analyze This" button exists
  6. Verify "Download" button exists
  7. Click each button to test interaction

**Expected Result**: ✅ Report section displays with interactive buttons
**Priority**: Medium | **Type**: Interactive Elements

---

### **TC-D008: Products Table Display**

#### **Test Scenario**: Verify products table shows correct data
- **Test Steps**:
  1. Navigate to dashboard
  2. Scroll to products table section
  3. Verify table headers are correct:
     - Checkbox, PRODUCT NAME, FIRST STOCK, SOLD, DATE ADDED, PRICING, RATING, ACTION
  4. Verify 7 products are displayed
  5. Check first product is "MacBook Pro with M2 Chip"

**Expected Result**: ✅ Products table displays all 7 Apple products with correct headers
**Priority**: High | **Type**: Data Display

---

### **TC-D009: Product Data Validation**

#### **Test Scenario**: Verify individual product data accuracy
- **Test Steps**:
  1. Navigate to dashboard
  2. Locate first product row (MacBook Pro with M2 Chip)
  3. Verify data:
     - First Stock: 4,159
     - Sold: 878
     - Date Added: Jul 14, 2023
     - Pricing: $1,200
     - Rating: 4.8 ⭐
  4. Repeat for iPhone 15 (second row):
     - Pricing: $1,600
     - Rating: 5.0 ⭐

**Expected Result**: ✅ Product data displays accurately with proper formatting
**Priority**: High | **Type**: Data Integrity

---

### **TC-D010: Product Selection Checkboxes**

#### **Test Scenario**: Verify product selection functionality
- **Test Steps**:
  1. Navigate to dashboard
  2. Verify header checkbox exists for "Select All"
  3. Check iPhone 15 is pre-selected (checked: true)
  4. Check Apple Watch Ultra 2 is pre-selected (checked: true)
  5. Click on unselected product checkboxes
  6. Verify selection state changes

**Expected Result**: ✅ Checkboxes function correctly and maintain state
**Priority**: Medium | **Type**: Interactive Elements

---

### **TC-D011: Product Actions**

#### **Test Scenario**: Verify product action buttons functionality
- **Test Steps**:
  1. Navigate to dashboard
  2. Locate action buttons for first product
  3. Click Edit button (✏️)
  4. Verify console log shows "Edit product: [object]"
  5. Click Delete button (🗑️)  
  6. Verify console log shows "Delete product: [object]"
  7. Click More button (⋯)

**Expected Result**: ✅ Action buttons trigger appropriate console logs
**Priority**: Medium | **Type**: Interactive Elements

---

### **TC-D012: Published/Draft Tabs**

#### **Test Scenario**: Verify tab functionality in products section
- **Test Steps**:
  1. Navigate to dashboard
  2. Locate tabs above products table
  3. Verify "Published" tab is active by default
  4. Verify "Draft" tab is clickable
  5. Click "Draft" tab (Note: functionality not implemented)

**Expected Result**: ✅ Tabs display correctly with active state indication
**Priority**: Low | **Type**: UI Elements

---

### **TC-D013: Export Functionality**

#### **Test Scenario**: Verify export button presence and interaction
- **Test Steps**:
  1. Navigate to dashboard
  2. Locate "Export Now" button
  3. Click the button
  4. Verify button is interactive (Note: functionality not implemented)

**Expected Result**: ✅ Export button is present and clickable
**Priority**: Low | **Type**: Interactive Elements

---

### **TC-D014: Pagination**

#### **Test Scenario**: Verify pagination controls
- **Test Steps**:
  1. Navigate to dashboard
  2. Scroll to bottom of products table
  3. Verify "Prev" and "Next" buttons exist
  4. Check page numbers: 1 (active), 2, ..., 8, 9
  5. Verify pagination info shows "Showing 7 of 120 entries"
  6. Click pagination buttons (Note: functionality not implemented)

**Expected Result**: ✅ Pagination controls display correctly with proper count
**Priority**: Medium | **Type**: Navigation

---

## 🔄 CROSS-PAGE INTEGRATION TEST CASES

### **TC-I001: Home to Dashboard Navigation Flow**

#### **Test Scenario**: Complete user journey from home to dashboard
- **Test Steps**:
  1. Start at home page (`/`)
  2. Verify automatic redirect to `/home`
  3. Click "Go to Dashboard" button
  4. Verify successful navigation to `/dashboard`
  5. Verify dashboard loads with user data
  6. Verify browser back button returns to home

**Expected Result**: ✅ Smooth navigation flow between pages
**Priority**: High | **Type**: End-to-End

---

### **TC-I002: Direct URL Access**

#### **Test Scenario**: Verify direct URL access works correctly
- **Test Steps**:
  1. Navigate directly to `/dashboard`
  2. Verify page loads without errors
  3. Navigate directly to `/home` 
  4. Verify page loads correctly
  5. Navigate to non-existent route like `/invalid`
  6. Verify redirect to home page

**Expected Result**: ✅ All routes work correctly with proper fallback
**Priority**: Medium | **Type**: Routing

---

### **TC-I003: Browser Navigation**

#### **Test Scenario**: Verify browser back/forward navigation
- **Test Steps**:
  1. Navigate to home page
  2. Go to dashboard
  3. Use browser back button
  4. Verify return to home page
  5. Use browser forward button
  6. Verify return to dashboard

**Expected Result**: ✅ Browser navigation maintains correct page state
**Priority**: Medium | **Type**: Browser Compatibility

---

## 🚨 ERROR HANDLING TEST CASES

### **TC-E001: Network Connectivity**

#### **Test Scenario**: Verify application behavior with network issues
- **Test Steps**:
  1. Load application normally
  2. Simulate network disconnection
  3. Attempt navigation between pages
  4. Verify graceful error handling
  5. Restore connection
  6. Verify application recovers

**Expected Result**: ✅ Application handles network issues gracefully
**Priority**: Medium | **Type**: Error Handling

---

### **TC-E002: JavaScript Console Errors**

#### **Test Scenario**: Verify no console errors during normal usage
- **Test Steps**:
  1. Open browser developer tools
  2. Navigate through entire application
  3. Interact with all buttons and elements
  4. Monitor console for errors
  5. Verify no critical errors appear

**Expected Result**: ✅ No console errors during normal operation
**Priority**: High | **Type**: Quality Assurance

---

## 📱 MOBILE/RESPONSIVE TEST CASES

### **TC-M001: Mobile Home Page**

#### **Test Scenario**: Verify home page on mobile devices
- **Test Steps**:
  1. Set viewport to mobile size (375x667)
  2. Navigate to home page
  3. Verify all content is visible
  4. Check feature cards stack vertically
  5. Verify buttons are touch-friendly
  6. Test navigation to dashboard

**Expected Result**: ✅ Home page is fully functional on mobile
**Priority**: High | **Type**: Mobile Testing

---

### **TC-M002: Mobile Dashboard**

#### **Test Scenario**: Verify dashboard responsiveness on mobile
- **Test Steps**:
  1. Set viewport to mobile size
  2. Navigate to dashboard
  3. Verify sidebar behavior (responsive menu)
  4. Check table scrolls horizontally if needed
  5. Verify all data remains accessible
  6. Test product action buttons on touch

**Expected Result**: ✅ Dashboard maintains functionality on mobile
**Priority**: High | **Type**: Mobile Testing

---

## 🎯 PERFORMANCE TEST CASES

### **TC-P001: Page Load Performance**

#### **Test Scenario**: Verify application loads within acceptable time
- **Test Steps**:
  1. Clear browser cache
  2. Navigate to home page
  3. Measure load time using dev tools
  4. Navigate to dashboard
  5. Measure load time
  6. Verify both pages load under 3 seconds

**Expected Result**: ✅ Pages load within performance targets
**Priority**: Medium | **Type**: Performance

---

### **TC-P002: Memory Usage**

#### **Test Scenario**: Verify application doesn't cause memory leaks
- **Test Steps**:
  1. Monitor memory usage in dev tools
  2. Navigate between pages multiple times
  3. Interact with dashboard elements
  4. Verify memory usage remains stable
  5. Check for memory leak patterns

**Expected Result**: ✅ Stable memory usage without leaks
**Priority**: Medium | **Type**: Performance

---

## 🔒 ACCESSIBILITY TEST CASES

### **TC-A001: Keyboard Navigation**

#### **Test Scenario**: Verify application is keyboard accessible
- **Test Steps**:
  1. Navigate using only Tab key
  2. Verify all interactive elements are reachable
  3. Test Enter key on buttons and links
  4. Verify focus indicators are visible
  5. Test Escape key functionality

**Expected Result**: ✅ Full keyboard accessibility
**Priority**: Medium | **Type**: Accessibility

---

### **TC-A002: Screen Reader Compatibility**

#### **Test Scenario**: Verify compatibility with screen readers
- **Test Steps**:
  1. Enable screen reader (VoiceOver on Mac)
  2. Navigate through application
  3. Verify all content is read aloud
  4. Check aria labels and roles
  5. Verify table headers are announced

**Expected Result**: ✅ Screen reader can access all content
**Priority**: Medium | **Type**: Accessibility

---

## 📊 TEST EXECUTION SUMMARY

### **Priority Breakdown**:
- **High Priority**: 12 test cases (Critical functionality)
- **Medium Priority**: 15 test cases (Important features)
- **Low Priority**: 4 test cases (Nice-to-have features)

### **Test Types**:
- **Functional**: 18 test cases
- **UI/UX**: 6 test cases  
- **Integration**: 4 test cases
- **Performance**: 2 test cases
- **Accessibility**: 2 test cases

### **Estimated Execution Time**:
- **Smoke Tests**: 30 minutes
- **Full Regression**: 3-4 hours
- **Performance Tests**: 1 hour
- **Accessibility Tests**: 1 hour

---

## 🚀 Automation Coverage

The following test cases are **already automated** in the E2E test suite:
- ✅ TC-H001, TC-H002, TC-H003, TC-H005 (Home page tests)
- ✅ TC-D001, TC-D005, TC-D006, TC-D008, TC-D009, TC-D010 (Dashboard tests)
- ✅ TC-I001, TC-I002, TC-I003 (Integration tests)
- ✅ TC-P001 (Performance baseline)

**Manual testing recommended for**:
- Accessibility test cases (TC-A001, TC-A002)
- Detailed UI/UX validation
- Cross-browser compatibility
- Real device testing

---

*This test plan covers comprehensive functional testing for the Product Management System. Execute automated tests with `npm run e2e` and perform manual testing for accessibility and detailed UX validation.*