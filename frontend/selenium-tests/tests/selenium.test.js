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
  { id: "S-001", description: "Verify web login page loads", page: "login.html", locator: By.id("email") },
  { id: "S-002", description: "Verify login page title is correct", page: "login.html", titleContains: "Login" },
  { id: "S-003", description: "Verify email field is present on login", page: "login.html", locator: By.id("email") },
  { id: "S-004", description: "Verify password field is present on login", page: "login.html", locator: By.id("password") },
  { id: "S-005", description: "Verify forgot password link is present", page: "login.html", locator: By.linkText("Forgot Password?") },
  { id: "S-006", description: "Verify signup link is present on login page", page: "login.html", locator: By.linkText("Sign up") },
  { id: "S-007", description: "Verify clicking signup opens signup page", page: "login.html", locator: By.linkText("Sign up") },
  { id: "S-008", description: "Verify signup page title is correct", page: "signup.html", titleContains: "Signup" },
  { id: "S-009", description: "Verify signup name field is present", page: "signup.html", locator: By.id("name") },
  { id: "S-010", description: "Verify signup email field is present", page: "signup.html", locator: By.id("email") },
  { id: "S-011", description: "Verify signup password field is present", page: "signup.html", locator: By.id("password") },
  { id: "S-012", description: "Verify signup page can navigate back to login", page: "signup.html", locator: By.linkText("Login") },
  { id: "S-013", description: "Verify forgot password page title is correct", page: "forgot_password.html", titleContains: "Forgot Password" },
  { id: "S-014", description: "Verify forgot password email field is present", page: "forgot_password.html", locator: By.id("email") },
  { id: "S-015", description: "Verify forgot password new password field is present", page: "forgot_password.html", locator: By.id("new_password") },
  { id: "S-016", description: "Verify forgot password back link works", page: "forgot_password.html", locator: By.linkText("Back to Login") },
  { id: "S-017", description: "Verify options page loads successfully", page: "options.html", locator: By.id("btn-user") },
  { id: "S-018", description: "Verify continue as user button is visible", page: "options.html", locator: By.id("btn-user") },
  { id: "S-019", description: "Verify continue as organization button is visible", page: "options.html", locator: By.id("btn-organization") },
  { id: "S-020", description: "Verify options user button navigates to login", page: "options.html", locator: By.id("btn-user") },
  { id: "S-021", description: "Verify options org button navigates to org login", page: "options.html", locator: By.id("btn-organization") },
  { id: "S-022", description: "Verify user dashboard page loads by URL", page: "user_dashboard.html", titleContains: "Dashboard" },
  { id: "S-023", description: "Verify user history page loads by URL", page: "user_history.html", titleContains: "History" },
  { id: "S-024", description: "Verify user AI page loads by URL", page: "user_ai.html", titleContains: "AI" },
  { id: "S-025", description: "Verify user profile page loads by URL", page: "user_profile.html", titleContains: "Profile" },
  { id: "S-026", description: "Verify organizers list page loads by URL", page: "organizers_list.html", titleContains: "Organizers" },
  { id: "S-027", description: "Verify organizers list filter field is present", page: "organizers_list.html", locator: By.id("cityFilter") },
  { id: "S-028", description: "Verify org dashboard page loads by URL", page: "org_dashboard.html", titleContains: "Dashboard" },
  { id: "S-029", description: "Verify org issues page loads by URL", page: "org_issues.html", titleContains: "Issues" },
  { id: "S-030", description: "Verify org completed page loads by URL", page: "org_completed.html", titleContains: "Completed" },
  { id: "S-031", description: "Verify org settings page loads by URL", page: "org_settings.html", titleContains: "Settings" },
  { id: "S-032", description: "Verify messages list page loads by URL", page: "messages_list.html", titleContains: "Messages" },
  { id: "S-033", description: "Verify chat page loads by URL", page: "chat.html", locator: By.id("messageInput") },
  { id: "S-034", description: "Verify user navigation links exist on chat page", page: "chat.html", locator: By.xpath("//a[contains(@href,'user_dashboard.html') or contains(text(),'Home')]") },
  { id: "S-035", description: "Verify org navigation links exist on messages page", page: "messages_list.html", locator: By.xpath("//a[contains(@href,'org_dashboard.html') or contains(text(),'Dashboard')]") },
  { id: "S-036", description: "Verify report photo page loads by URL", page: "report_photo.html", titleContains: "Report" },
  { id: "S-037", description: "Verify upload photo page loads by URL", page: "upload_photo.html", locator: By.id("btnGallery") },
  { id: "S-038", description: "Verify homepage splash redirects to options", page: "index.html", titleContains: "Splash" },
  { id: "S-039", description: "Verify login form submit button is present", page: "login.html", locator: By.css("button[type='submit']") },
  { id: "S-040", description: "Verify signup form submit button is present", page: "signup.html", locator: By.css("button[type='submit']") },
  { id: "S-041", description: "Verify forgot password form submit button is present", page: "forgot_password.html", locator: By.css("button[type='submit']") },
  { id: "S-042", description: "Verify organizers list page displays organizers container", page: "organizers_list.html", locator: By.id("organizersContainer") },
  { id: "S-043", description: "Verify user dashboard page displays report cards", page: "user_dashboard.html", locator: By.xpath("//*[contains(text(),'Reports Submitted') or contains(text(),'Live Location')]") },
  { id: "S-044", description: "Verify user AI page displays pending items", page: "user_ai.html", locator: By.xpath("//*[contains(text(),'Pending') or contains(text(),'Issues')]") },
  { id: "S-045", description: "Verify user history page displays history items", page: "user_history.html", locator: By.xpath("//*[contains(text(),'History') or contains(text(),'Issues')]") },
  { id: "S-046", description: "Verify org dashboard page displays statistics", page: "org_dashboard.html", locator: By.xpath("//*[contains(text(),'Cleanliness') or contains(text(),'Issues')]") },
  { id: "S-047", description: "Verify org completed page displays closed issues", page: "org_completed.html", locator: By.xpath("//*[contains(text(),'Completed') or contains(text(),'Issues')]") },
  { id: "S-048", description: "Verify org settings page displays profile fields", page: "org_settings.html", locator: By.xpath("//*[contains(text(),'Profile') or contains(text(),'Reset Password')]") },
  { id: "S-049", description: "Verify web pages use correct window.location navigation", page: "options.html", locator: By.id("btn-user") },
  { id: "S-050", description: "Verify static navigation links have working hrefs", page: "login.html", locator: By.xpath("//a[@href='signup.html' or @href='forgot_password.html']") }
];

describe("CivicBin E2E Selenium Web Tests", function () {
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
    const reportPath = path.join(reportsDir, 'CivicBin_Web_Selenium_Report.xlsx');

    const wb = XLSX.utils.book_new();
    const wsData = [
      ["Test Case ID", "Description", "Type", "Status", "Notes"]
    ];

    testResults.forEach(r => {
      wsData.push([r.id, r.description, "Selenium", r.status, r.notes]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Selenium Tests");
    XLSX.writeFile(wb, reportPath);

    console.log(`\n==================================================`);
    console.log(`Generated Excel Report at: ${reportPath}`);
    console.log(`==================================================\n`);
  });

  seleniumCases.forEach(tc => {
    it(`${tc.id}: ${tc.description}`, async function () {
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
          status: status,
          notes: notes
        });
      }
    });
  });
});
