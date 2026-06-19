const fs = require('fs');
const path = require('path');

// 1. Update selenium.test.js
const seleniumTestPath = path.join(__dirname, '../selenium-tests/tests/selenium.test.js');
let seleniumContent = fs.readFileSync(seleniumTestPath, 'utf8');

const generatedSeleniumContent = fs.readFileSync(path.join(__dirname, 'generated_selenium.js'), 'utf8');

const selStartIdx = seleniumContent.indexOf('const seleniumCases = [');
if (selStartIdx === -1) {
  console.error("Could not find start of seleniumCases in selenium.test.js");
  process.exit(1);
}

// Find the matching closing bracket ];
// We can find the first ]; after the start index, which ends the array.
const selEndIdx = seleniumContent.indexOf('];', selStartIdx);
if (selEndIdx === -1) {
  console.error("Could not find end of seleniumCases in selenium.test.js");
  process.exit(1);
}

const newSeleniumContent = seleniumContent.substring(0, selStartIdx) + 
                           generatedSeleniumContent + 
                           seleniumContent.substring(selEndIdx + 2);

fs.writeFileSync(seleniumTestPath, newSeleniumContent, 'utf8');
console.log("[+] Successfully updated selenium-tests/tests/selenium.test.js with 310 test cases!");

// 2. Update cases_metadata.py
const casesMetadataPath = path.join(__dirname, '../appium-tests/tests/cases_metadata.py');
let appiumContent = fs.readFileSync(casesMetadataPath, 'utf8');

const generatedAppiumContent = fs.readFileSync(path.join(__dirname, 'generated_appium.py'), 'utf8');

const appStartIdx = appiumContent.indexOf('appium_cases = [');
if (appStartIdx === -1) {
  console.error("Could not find start of appium_cases in cases_metadata.py");
  process.exit(1);
}

const appEndIdx = appiumContent.indexOf(']', appStartIdx);
if (appEndIdx === -1) {
  console.error("Could not find end of appium_cases in cases_metadata.py");
  process.exit(1);
}

// Note: cases_metadata.py ends with the array, but there might be extra characters/newlines after.
// In cases_metadata.py, it ends with a single closing bracket.
const newAppiumContent = appiumContent.substring(0, appStartIdx) + 
                         generatedAppiumContent + 
                         appiumContent.substring(appEndIdx + 1);

fs.writeFileSync(casesMetadataPath, newAppiumContent, 'utf8');
console.log("[+] Successfully updated appium-tests/tests/cases_metadata.py with 310 test cases!");
