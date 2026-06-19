const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../selenium-tests/tests/selenium.test.js'), 'utf8');

// Use regex or eval to get the array
// Since we want to be robust, let's extract the array using a simple regex and eval, or parser.
// seleniumCases starts after "const seleniumCases = [" and ends before "];"
const startIdx = content.indexOf('const seleniumCases = [');
if (startIdx === -1) {
  console.error("Could not find seleniumCases array");
  process.exit(1);
}

const endIdx = content.indexOf('];', startIdx);
const arrayStr = content.substring(startIdx + 'const seleniumCases = '.length, endIdx + 2);

// Mock By.id and other methods so eval works
const By = {
  id: (val) => ({ type: 'id', value: val }),
  linkText: (val) => ({ type: 'linkText', value: val }),
  css: (val) => ({ type: 'css', value: val })
};

const seleniumCases = eval(arrayStr);

console.log(`Total selenium test cases: ${seleniumCases.length}`);

// Count cases per screen/page
const pageCounts = {};
const categoryCounts = {};

seleniumCases.forEach(tc => {
  // Normalize page name (strip query params if any)
  const basePage = tc.page.split('?')[0];
  pageCounts[basePage] = (pageCounts[basePage] || 0) + 1;
  categoryCounts[tc.category] = (categoryCounts[tc.category] || 0) + 1;
});

console.log("\n--- TEST CASES PER SCREEN ---");
Object.entries(pageCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([page, count]) => {
    console.log(`${page}: ${count}`);
  });

console.log("\n--- TEST CASES PER CATEGORY ---");
Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([cat, count]) => {
    console.log(`${cat}: ${count}`);
  });

// Check which files in web directory are missing test cases
const webDir = path.join(__dirname, '../web');
const files = fs.readdirSync(webDir);
const htmlFiles = files.filter(f => f.endsWith('.html'));

console.log("\n--- ALL SCREENS IN WEB/ AND THEIR STATUS ---");
let totalScreens = 0;
let screensWithCases = 0;
let screensWithAtLeast10 = 0;

htmlFiles.forEach(file => {
  totalScreens++;
  const count = pageCounts[file] || 0;
  if (count > 0) screensWithCases++;
  if (count >= 10) screensWithAtLeast10++;
  
  let status = "❌ NO TEST CASES";
  if (count > 0 && count < 10) {
    status = `⚠️ LESS THAN 10 CASES (${count})`;
  } else if (count >= 10) {
    status = `✅ SUFFICIENT (${count})`;
  }
  console.log(`- ${file}: ${status}`);
});

console.log(`\nSummary:`);
console.log(`- Total screens: ${totalScreens}`);
console.log(`- Screens with at least 1 test case: ${screensWithCases}`);
console.log(`- Screens with at least 10 test cases: ${screensWithAtLeast10}`);
console.log(`- Screens completely missing test cases: ${totalScreens - screensWithCases}`);
