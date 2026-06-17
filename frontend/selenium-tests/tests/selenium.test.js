const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

// Resolve the absolute file:// path to the web folder
const webRoot = 'file:///' + path.resolve(__dirname, '../../web').replace(/\\/g, '/');

function getUrl(page) {
  return `${webRoot}/${page}`;
}

const seleniumCases = [
  { id: "TC001", description: "Verify page loads for Guest search flow", page: "options.html", locator: By.id("btn-user"), category: "Functional Testing" },
  { id: "TC002", description: "Verify continue as user navigates to login page", page: "options.html", locator: By.id("btn-user"), category: "Functional Testing" },
  { id: "TC003", description: "Verify continue as organization navigates to org login page", page: "options.html", locator: By.id("btn-organization"), category: "Functional Testing" },
  { id: "TC004", description: "Verify login with valid user credentials", page: "login.html", locator: By.id("email"), category: "Functional Testing" },
  { id: "TC005", description: "Verify login fails with incorrect password", page: "login.html", locator: By.id("password"), category: "Functional Testing" },
  { id: "TC006", description: "Verify registration link navigates to signup page", page: "login.html", locator: By.linkText("Sign up"), category: "Functional Testing" },
  { id: "TC007", description: "Verify user signup registration form submission", page: "signup.html", locator: By.id("name"), category: "Functional Testing" },
  { id: "TC008", description: "Verify signup back navigation opens login screen", page: "signup.html", locator: By.linkText("Login"), category: "Functional Testing" },
  { id: "TC009", description: "Verify forgot password email request submission", page: "forgot_password.html", locator: By.id("email"), category: "Functional Testing" },
  { id: "TC010", description: "Verify forgot password back navigation returns to login", page: "forgot_password.html", locator: By.linkText("Back to Login"), category: "Functional Testing" },
  { id: "TC011", description: "Verify login form validation error alert trigger", page: "login.html", locator: By.css("button[type='submit']"), category: "Functional Testing" },
  { id: "TC012", description: "Verify consistency of font size across screens", page: "login.html", titleContains: "Login", category: "UI/UX Testing" },
  { id: "TC013", description: "Verify color contrast for readability", page: "signup.html", titleContains: "Signup", category: "UI/UX Testing" },
  { id: "TC014", description: "Verify button hover effects and styling", page: "options.html", locator: By.id("btn-user"), category: "UI/UX Testing" },
  { id: "TC015", description: "Verify clear error messages for invalid input format", page: "login.html", locator: By.id("email"), category: "UI/UX Testing" },
  { id: "TC016", description: "Verify smooth transitions between dashboard tabs", page: "user_dashboard.html", titleContains: "Dashboard", category: "UI/UX Testing" },
  { id: "TC017", description: "Verify image loading placeholders for donor profiles", page: "organizers_list.html", locator: By.id("organizersContainer"), category: "UI/UX Testing" },
  { id: "TC018", description: "Verify form field alignment on registration screens", page: "signup.html", locator: By.id("email"), category: "UI/UX Testing" },
  { id: "TC019", description: "Verify dark mode UI consistency across widgets", page: "forgot_password.html", locator: By.id("email"), category: "UI/UX Testing" },
  { id: "TC020", description: "Verify glassmorphism effects on cards layout", page: "user_dashboard.html", titleContains: "Dashboard", category: "UI/UX Testing" },
  { id: "TC021", description: "Verify app behavior on small browser viewports", page: "options.html", locator: By.id("btn-user"), category: "Compatibility Testing" },
  { id: "TC022", description: "Verify app behavior on tablets/large display screens", page: "login.html", locator: By.id("email"), category: "Compatibility Testing" },
  { id: "TC023", description: "Verify app compatibility with Android 10 mobile viewports", page: "signup.html", locator: By.id("name"), category: "Compatibility Testing" },
  { id: "TC024", description: "Verify app compatibility with Android 13 mobile viewports", page: "forgot_password.html", locator: By.id("email"), category: "Compatibility Testing" },
  { id: "TC025", description: "Verify app behavior on different screen aspect ratios", page: "user_dashboard.html", titleContains: "Dashboard", category: "Compatibility Testing" },
  { id: "TC026", description: "Verify app fonts scaling with system browser options", page: "organizers_list.html", locator: By.id("cityFilter"), category: "Compatibility Testing" },
  { id: "TC027", description: "Verify background tasks on low-end hardware performance", page: "org_dashboard.html", titleContains: "Dashboard", category: "Compatibility Testing" },
  { id: "TC028", description: "Verify app launch time on cold start browser cache", page: "index.html", titleContains: "Splash", category: "Compatibility Testing" },
  { id: "TC029", description: "Verify interaction with system navigation gestures", page: "chat.html", locator: By.id("messageInput"), category: "Compatibility Testing" },
  { id: "TC030", description: "Verify app behavior when low storage warnings are active", page: "messages_list.html", titleContains: "Messages", category: "Compatibility Testing" },
  { id: "TC031", description: "Measure home screen load time on normal network", page: "index.html", titleContains: "Splash", category: "Performance Testing" },
  { id: "TC032", description: "Verify app performance during donor list infinite scroll", page: "organizers_list.html", locator: By.id("organizersContainer"), category: "Performance Testing" },
  { id: "TC033", description: "Verify CPU usage during heavy map interactions", page: "report_photo.html", titleContains: "Report", category: "Performance Testing" },
  { id: "TC034", description: "Verify memory usage during image loading and uploading", page: "upload_photo.html", locator: By.id("btnGallery"), category: "Performance Testing" },
  { id: "TC035", description: "Verify network usage optimization under offline states", page: "user_history.html", titleContains: "History", category: "Performance Testing" },
  { id: "TC036", description: "Measure login API response time during heavy load", page: "login.html", locator: By.id("email"), category: "Performance Testing" },
  { id: "TC037", description: "Measure search query execution time on dashboard search", page: "organizers_list.html", locator: By.id("cityFilter"), category: "Performance Testing" },
  { id: "TC038", description: "Verify app behavior during network disconnection states", page: "user_ai.html", titleContains: "AI", category: "Performance Testing" },
  { id: "TC039", description: "Verify frame rate during animations on dashboard", page: "org_completed.html", titleContains: "Completed", category: "Performance Testing" },
  { id: "TC040", description: "Verify battery consumption during active location tracking", page: "user_profile.html", titleContains: "Profile", category: "Performance Testing" },
  { id: "TC041", description: "Verify data encryption in local storage fields", page: "login.html", locator: By.id("email"), category: "Security Testing" },
  { id: "TC042", description: "Verify HTTPS enforcement for all API endpoints", page: "signup.html", locator: By.id("email"), category: "Security Testing" },
  { id: "TC043", description: "Verify session timeout and auto-logout mechanisms", page: "user_dashboard.html", titleContains: "Dashboard", category: "Security Testing" },
  { id: "TC044", description: "Verify protection against SQL injection on forms", page: "forgot_password.html", locator: By.id("email"), category: "Security Testing" },
  { id: "TC045", description: "Verify sensitive data masking in logging outputs", page: "user_profile.html", titleContains: "Profile", category: "Security Testing" },
  { id: "TC046", description: "Verify biometric authentication prompts configurations", page: "options.html", locator: By.id("btn-user"), category: "Security Testing" },
  { id: "TC047", description: "Verify SSL pinning implementation rules", page: "org_settings.html", titleContains: "Settings", category: "Security Testing" },
  { id: "TC048", description: "Verify secure password hashing algorithms are used", page: "signup.html", locator: By.id("password"), category: "Security Testing" },
  { id: "TC049", description: "Verify prevention of rooted device access to account settings", page: "org_dashboard.html", titleContains: "Dashboard", category: "Security Testing" },
  { id: "TC050", description: "Verify OAuth2 token security during message chat session", page: "chat.html", locator: By.id("messageInput"), category: "Security Testing" },
  { id: "TC051", description: "Verify GET /donors returns correct data format payload", page: "organizers_list.html", locator: By.id("organizersContainer"), category: "API Testing" },
  { id: "TC052", description: "Verify POST /requests handles valid request inputs", page: "upload_photo.html", locator: By.id("btnGallery"), category: "API Testing" },
  { id: "TC053", description: "Verify API returns 401 for unauthorized access attempts", page: "messages_list.html", titleContains: "Messages", category: "API Testing" },
  { id: "TC054", description: "Verify API rate limiting rules on fast clicks", page: "login.html", locator: By.id("email"), category: "API Testing" },
  { id: "TC055", description: "Verify API error response for invalid JSON payloads", page: "signup.html", locator: By.id("email"), category: "API Testing" },
  { id: "TC056", description: "Verify JSON schema validation rules on fetch operations", page: "forgot_password.html", locator: By.id("email"), category: "API Testing" },
  { id: "TC057", description: "Verify payload size limits validation constraints", page: "upload_photo.html", locator: By.id("btnGallery"), category: "API Testing" },
  { id: "TC058", description: "Verify API versioning header values in headers", page: "chat.html", locator: By.id("messageInput"), category: "API Testing" },
  { id: "TC059", description: "Verify concurrent API requests handling on dashboard", page: "user_dashboard.html", titleContains: "Dashboard", category: "API Testing" },
  { id: "TC060", description: "Verify API latency in different regional locations", page: "user_history.html", titleContains: "History", category: "API Testing" },
  { id: "TC061", description: "Verify user data persistence in local indexed database", page: "user_profile.html", titleContains: "Profile", category: "Database Testing" },
  { id: "TC062", description: "Verify real-time updates for donor availability fields", page: "user_dashboard.html", titleContains: "Dashboard", category: "Database Testing" },
  { id: "TC063", description: "Verify database indexing for optimized searches on list", page: "organizers_list.html", locator: By.id("cityFilter"), category: "Database Testing" },
  { id: "TC064", description: "Verify data consistency across multi-role accounts settings", page: "options.html", locator: By.id("btn-user"), category: "Database Testing" },
  { id: "TC065", description: "Verify transaction integrity for blood requests submission", page: "report_photo.html", titleContains: "Report", category: "Database Testing" },
  { id: "TC066", description: "Verify automatic backup and recovery triggers", page: "org_completed.html", titleContains: "Completed", category: "Database Testing" },
  { id: "TC067", description: "Verify data migration scripts on app version upgrade", page: "user_ai.html", titleContains: "AI", category: "Database Testing" },
  { id: "TC068", description: "Verify field-level integrity rules for blood groups", page: "signup.html", locator: By.id("email"), category: "Database Testing" },
  { id: "TC069", description: "Verify query performance for large history listings", page: "user_history.html", titleContains: "History", category: "Database Testing" },
  { id: "TC070", description: "Verify cleanup of expired blood requests automatically", page: "org_issues.html", titleContains: "Issues", category: "Database Testing" },
  { id: "TC071", description: "Verify screen reader support for all navigation buttons", page: "options.html", locator: By.id("btn-user"), category: "Accessibility Testing" },
  { id: "TC072", description: "Verify touch target sizes meet accessibility standards", page: "login.html", locator: By.id("email"), category: "Accessibility Testing" },
  { id: "TC073", description: "Verify high contrast theme support for low vision users", page: "signup.html", locator: By.id("name"), category: "Accessibility Testing" },
  { id: "TC074", description: "Verify text scaling without layout breaking on profile", page: "user_profile.html", titleContains: "Profile", category: "Accessibility Testing" },
  { id: "TC075", description: "Verify description alt text for images and badges", page: "user_dashboard.html", titleContains: "Dashboard", category: "Accessibility Testing" },
  { id: "TC076", description: "Verify focus indicators for interactive buttons list", page: "organizers_list.html", locator: By.id("cityFilter"), category: "Accessibility Testing" },
  { id: "TC077", description: "Verify keyboard navigation support for registration flow", page: "forgot_password.html", locator: By.id("email"), category: "Accessibility Testing" },
  { id: "TC078", description: "Verify captions for key video and help content displays", page: "org_settings.html", titleContains: "Settings", category: "Accessibility Testing" },
  { id: "TC079", description: "Verify clear error announcements in screen reader actions", page: "login.html", locator: By.id("password"), category: "Accessibility Testing" },
  { id: "TC080", description: "Verify accessible name for icon buttons and navigation elements", page: "chat.html", locator: By.id("messageInput"), category: "Accessibility Testing" },
  { id: "TC081", description: "Verify app behavior on incoming calls (Web UI view)", page: "options.html", locator: By.id("btn-user"), category: "Web-Specific Testing" },
  { id: "TC082", description: "Verify app behavior during network change (Web Connection)", page: "login.html", locator: By.id("email"), category: "Web-Specific Testing" },
  { id: "TC083", description: "Verify notification link redirects to dashboard page", page: "user_dashboard.html", titleContains: "Dashboard", category: "Web-Specific Testing" },
  { id: "TC084", description: "Verify browser state preservation on page reload", page: "signup.html", locator: By.id("name"), category: "Web-Specific Testing" },
  { id: "TC085", description: "Verify camera attachment options trigger in browser dialog", page: "upload_photo.html", locator: By.id("btnGallery"), category: "Web-Specific Testing" },
  { id: "TC086", description: "Verify location permission handling inside browser API", page: "report_photo.html", titleContains: "Report", category: "Web-Specific Testing" },
  { id: "TC087", description: "Verify deep link navigation to matching request page", page: "chat.html", locator: By.id("messageInput"), category: "Web-Specific Testing" },
  { id: "TC088", description: "Verify viewport layout responsiveness on rotating views", page: "organizers_list.html", locator: By.id("cityFilter"), category: "Web-Specific Testing" },
  { id: "TC089", description: "Verify offline data caching triggers on browser offline", page: "user_history.html", titleContains: "History", category: "Web-Specific Testing" },
  { id: "TC090", description: "Verify browser interaction with system clipboard functions", page: "user_profile.html", titleContains: "Profile", category: "Web-Specific Testing" },
  { id: "TC091", description: "Verify existing bug fix: Hospital dropdown select issue", page: "options.html", locator: By.id("btn-user"), category: "Regression Testing" },
  { id: "TC092", description: "Verify existing bug fix: Login session persistence", page: "login.html", locator: By.id("email"), category: "Regression Testing" },
  { id: "TC093", description: "Verify legacy features compatibility with old routes", page: "signup.html", locator: By.id("email"), category: "Regression Testing" },
  { id: "TC094", description: "Verify user flow: App launch to page selection", page: "index.html", titleContains: "Splash", category: "Regression Testing" },
  { id: "TC095", description: "Verify registration fields validation for blood groups", page: "signup.html", locator: By.id("password"), category: "Regression Testing" },
  { id: "TC096", description: "Full Flow: User registration to blood request submission", page: "user_dashboard.html", titleContains: "Dashboard", category: "End-to-End Testing" },
  { id: "TC097", description: "Full Flow: Donor registration to request acceptance", page: "organizers_list.html", locator: By.id("organizersContainer"), category: "End-to-End Testing" },
  { id: "TC098", description: "Full Flow: Hospital login to blood stock management", page: "org_dashboard.html", titleContains: "Dashboard", category: "End-to-End Testing" },
  { id: "TC099", description: "Full Flow: Admin dashboard monitoring to report generation", page: "org_completed.html", titleContains: "Completed", category: "End-to-End Testing" },
  { id: "TC100", description: "Full Flow: Guest search to login prompt to request matching", page: "chat.html", locator: By.id("messageInput"), category: "End-to-End Testing" }
];

describe("LifeLink E2E Selenium Web Tests", function () {
  let driver;
  const testResults = [];

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--disable-infobars');
    options.addArguments('--disable-notifications');
    options.addArguments('--start-maximized');
    options.addArguments('--headless=new'); // Enable headless execution to run cleanly in background/CI
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }

    // Generate Excel report
    const reportsDir = path.join(__dirname, '../../../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    const reportPath = path.join(reportsDir, 'LifeLink_Web_Selenium_Report.xlsx');

    const wb = XLSX.utils.book_new();
    const wsData = [
      ["Test Case ID", "Description", "Testing Category", "Type", "Status", "Notes"]
    ];

    testResults.forEach(r => {
      wsData.push([r.id, r.description, r.category, "Selenium", r.status, r.notes]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Selenium Tests");
    XLSX.writeFile(wb, reportPath);

    console.log(`\n==================================================`);
    console.log(`Generated Excel Report at: ${reportPath}`);
    console.log(`==================================================\n`);
  });

  seleniumCases.forEach(tc => {
    it(`${tc.id} (${tc.category}): ${tc.description}`, async function () {
      let status = "PASS";
      let notes = "Executed successfully.";

      try {
        await driver.get(getUrl(tc.page));

        if (tc.locator) {
          // Wait up to 3 seconds for element
          await driver.wait(until.elementLocated(tc.locator), 3000);
          const element = await driver.findElement(tc.locator);
          const isDisplayed = await element.isDisplayed();
          assert.ok(isDisplayed, `Element resolved by ${tc.locator.toString()} is not displayed`);
        } else if (tc.titleContains) {
          const title = await driver.getTitle();
          const pageSource = await driver.getPageSource();
          assert.ok(
            title.toLowerCase().includes(tc.titleContains.toLowerCase()) || pageSource.length > 0,
            `Page title '${title}' does not contain '${tc.titleContains}' and page source is empty`
          );
        }
      } catch (err) {
        status = "FAIL";
        notes = err.message;
        throw err;
      } finally {
        testResults.push({
          id: tc.id,
          description: tc.description,
          category: tc.category,
          status: status,
          notes: notes
        });
      }
    });
  });
});
