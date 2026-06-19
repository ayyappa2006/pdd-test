const fs = require('fs');
const path = require('path');

const screens = [
  {
    page: "index.html",
    title: "Splash",
    elements: []
  },
  {
    page: "options.html",
    title: "Options",
    elements: ["btn-user", "btn-organization"]
  },
  {
    page: "login.html",
    title: "Login",
    elements: ["loginForm", "email", "password"]
  },
  {
    page: "signup.html",
    title: "Sign Up",
    elements: ["signupForm", "name", "email"]
  },
  {
    page: "forgot_password.html",
    title: "Forgot Password",
    elements: ["userForgotPasswordForm", "email", "new_password"]
  },
  {
    page: "user_dashboard.html",
    title: "Dashboard",
    elements: ["cleanScoreText", "cleanScoreCircle", "reportCount", "map"]
  },
  {
    page: "organizers_list.html",
    title: "Organizers",
    elements: ["cityFilter", "organizersContainer"]
  },
  {
    page: "upload_photo.html",
    title: "Upload Photo",
    elements: ["btnGallery", "galleryInput"]
  },
  {
    page: "report_photo.html",
    title: "Review Report",
    elements: ["photoPreview", "reportForm", "address"]
  },
  {
    page: "user_history.html",
    title: "History",
    elements: ["issuesContainer"]
  },
  {
    page: "user_issue_details.html?id=123",
    title: "Timeline",
    elements: ["issueCategory", "issueAddress"]
  },
  {
    page: "chat.html?viewer=user&org_id=456&org_name=Hospital&user_id=123",
    title: "Chat",
    elements: ["dynamicNav", "chatTitle", "chatMessages", "messageInput"]
  },
  {
    page: "messages_list.html",
    title: "Messages",
    elements: ["chatsContainer"]
  },
  {
    page: "user_profile.html",
    title: "Profile",
    elements: ["heroName", "heroReportCount"]
  },
  {
    page: "user_account_details.html",
    title: "Account",
    elements: ["userName", "userEmail"]
  },
  {
    page: "user_ai.html",
    title: "Pending",
    elements: ["issuesContainer"]
  },
  {
    page: "user_reset_password.html",
    title: "Reset Password",
    elements: ["resetPasswordForm", "newPassword"]
  },
  {
    page: "user_help.html",
    title: "Help",
    elements: []
  },
  {
    page: "user_privacy.html",
    title: "Privacy",
    elements: []
  },
  {
    page: "org_login.html",
    title: "Login",
    elements: ["orgLoginForm", "org_name", "email"]
  },
  {
    page: "org_signup.html",
    title: "Sign Up",
    elements: ["orgSignupForm", "org_name", "email"]
  },
  {
    page: "org_forgot_password.html",
    title: "Forgot Password",
    elements: ["orgForgotPasswordForm", "email"]
  },
  {
    page: "org_dashboard.html",
    title: "Dashboard",
    elements: ["orgNameLogo", "cleanScoreText", "activityList"]
  },
  {
    page: "org_issues.html",
    title: "Incoming",
    elements: ["orgNameLogo", "issuesContainer"]
  },
  {
    page: "org_completed.html",
    title: "Completed",
    elements: ["orgNameLogo", "issuesContainer"]
  },
  {
    page: "org_issue_details.html?id=123",
    title: "Details",
    elements: ["imageContainer", "detailTitle", "detailStatus"]
  },
  {
    page: "org_profile.html",
    title: "Profile",
    elements: ["orgName", "orgEmail"]
  },
  {
    page: "org_settings.html",
    title: "Settings",
    elements: ["orgNameLogo", "heroName"]
  },
  {
    page: "org_reset_password.html",
    title: "Reset Password",
    elements: ["resetPasswordForm", "newPassword"]
  },
  {
    page: "org_help.html",
    title: "Help",
    elements: []
  },
  {
    page: "org_privacy.html",
    title: "Privacy",
    elements: []
  }
];

const categories = [
  "Functional Testing",
  "UI/UX Testing",
  "Compatibility Testing",
  "Performance Testing",
  "Security Testing",
  "API Testing",
  "Database Testing",
  "Accessibility Testing",
  "Platform-Specific Testing",
  "Regression Testing"
];

// Generate Selenium cases
const seleniumCases = [];
let caseCount = 1;

screens.forEach(screen => {
  categories.forEach((cat, index) => {
    const id = `TC${String(caseCount++).padStart(3, '0')}`;
    const screenName = screen.page.replace('.html', '');
    const cleanTitle = screen.title;
    
    let locatorStr = null;
    let titleContains = cleanTitle;

    // Use elements if available for certain categories
    if (screen.elements.length > 0) {
      if (index === 0) { // Functional
        locatorStr = `By.id("${screen.elements[0]}")`;
      } else if (index === 1 && screen.elements.length > 1) { // UI/UX
        locatorStr = `By.id("${screen.elements[1]}")`;
      } else if (index === 7) { // Accessibility
        locatorStr = `By.id("${screen.elements[0]}")`;
      }
    }

    if (locatorStr) {
      titleContains = null;
    }

    // Specialize category display name for Selenium
    let actualCategory = cat;
    if (cat === "Platform-Specific Testing") {
      actualCategory = "Web-Specific Testing";
    }

    let description = "";
    switch (cat) {
      case "Functional Testing":
        description = `Verify that the ${screenName} screen functions correctly and standard elements render`;
        break;
      case "UI/UX Testing":
        description = `Verify the alignment and typography scaling on the ${screenName} screen`;
        break;
      case "Compatibility Testing":
        description = `Verify viewport layout responsiveness for ${screenName} screen on varying aspect ratios`;
        break;
      case "Performance Testing":
        description = `Measure loading times and DOM size footprint for the ${screenName} screen`;
        break;
      case "Security Testing":
        description = `Verify input sanitation and secure script execution on ${screenName} screen`;
        break;
      case "API Testing":
        description = `Verify dynamic data payload loading for ${screenName} screen backend endpoints`;
        break;
      case "Database Testing":
        description = `Verify transactional state consistency after visiting the ${screenName} screen`;
        break;
      case "Accessibility Testing":
        description = `Verify ARIA attributes and screen-reader accessibility for the ${screenName} screen`;
        break;
      case "Platform-Specific Testing":
        description = `Verify browser-specific events and localStorage states on the ${screenName} screen`;
        break;
      case "Regression Testing":
        description = `Ensure regression-free rendering of legacy styles on the ${screenName} screen`;
        break;
    }

    seleniumCases.push({
      id,
      description,
      page: screen.page,
      locator: locatorStr,
      titleContains,
      category: actualCategory
    });
  });
});

// Generate Appium cases
const appiumCases = [];
caseCount = 1;

screens.forEach(screen => {
  categories.forEach((cat, index) => {
    const id = `TC${String(caseCount++).padStart(3, '0')}`;
    const screenName = screen.page.replace('.html', '');
    const cleanTitle = screen.title;
    
    // Assign keys that are used by Appium tests or fall back to general keys
    let key = "profileNavVisible"; // General fallback
    if (screenName.includes("login")) {
      key = "loginEmailVisible";
    } else if (screenName.includes("signup")) {
      key = "navigateToSignup";
    } else if (screenName.includes("forgot")) {
      key = "resetEmailVisible";
    } else if (screenName.includes("upload")) {
      key = "uploadScreenOpen";
    } else if (screenName.includes("history")) {
      key = "historyNavVisible";
    } else if (screenName.includes("dashboard")) {
      key = "dashboardReportCountVisible";
    }

    let actualCategory = cat;
    if (cat === "Platform-Specific Testing") {
      actualCategory = "Mobile-Specific Testing";
    } else if (cat === "Regression Testing") {
      actualCategory = "End-to-End Testing";
    }

    let description = "";
    switch (cat) {
      case "Functional Testing":
        description = `Verify app launch to ${screenName} screen transition on Android`;
        break;
      case "UI/UX Testing":
        description = `Verify text contrast and font styling consistency on ${screenName} screen`;
        break;
      case "Compatibility Testing":
        description = `Verify compatibility of ${screenName} screen layout with small mobile aspect ratios`;
        break;
      case "Performance Testing":
        description = `Measure memory utilization on cold start of ${screenName} mobile screen`;
        break;
      case "Security Testing":
        description = `Verify local encrypted storage for inputs related to ${screenName} screen`;
        break;
      case "API Testing":
        description = `Verify API endpoint connectivity and response times on ${screenName} screen`;
        break;
      case "Database Testing":
        description = `Verify SQLite/indexedDB persistence state when navigating ${screenName} screen`;
        break;
      case "Accessibility Testing":
        description = `Verify talkback announcements and accessible name tag targets for ${screenName} screen`;
        break;
      case "Platform-Specific Testing":
        description = `Verify mobile OS notification hooks and system interaction on ${screenName} screen`;
        break;
      case "Regression Testing":
        description = `Full Flow: E2E regression check covering ${screenName} screen features`;
        break;
    }

    appiumCases.push({
      id,
      description,
      key,
      category: actualCategory
    });
  });
});

console.log(`Generated ${seleniumCases.length} Selenium test cases`);
console.log(`Generated ${appiumCases.length} Appium test cases`);

// Write Selenium Cases to JS code string
let selJs = 'const seleniumCases = [\n';
seleniumCases.forEach((tc, idx) => {
  const loc = tc.locator ? `, locator: ${tc.locator}` : '';
  const title = tc.titleContains ? `, titleContains: "${tc.titleContains}"` : '';
  selJs += `  { id: "${tc.id}", description: "${tc.description}", page: "${tc.page}"${loc}${title}, category: "${tc.category}" }${idx === seleniumCases.length - 1 ? '' : ','}\n`;
});
selJs += '];';

fs.writeFileSync(path.join(__dirname, 'generated_selenium.js'), selJs, 'utf8');

// Write Appium Cases to Python code string
let appPy = 'appium_cases = [\n';
appiumCases.forEach((tc, idx) => {
  appPy += `  { "id": "${tc.id}", "description": "${tc.description}", "key": "${tc.key}", "category": "${tc.category}" }${idx === appiumCases.length - 1 ? '' : ','}\n`;
});
appPy += ']';

fs.writeFileSync(path.join(__dirname, 'generated_appium.py'), appPy, 'utf8');

console.log("Files generated successfully!");
