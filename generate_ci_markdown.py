import os
import sys
from openpyxl import load_workbook

def parse_report(file_path):
    """Parses a CivicBin test report spreadsheet and compiles test case category details."""
    if not os.path.exists(file_path):
        print(f"[-] Error: Report file {file_path} not found.")
        return None
    
    wb = load_workbook(file_path, data_only=True, read_only=True)
    sheet = wb.active
    
    total = 0
    passed = 0
    failed = 0
    category_counts = {}
    
    first_row = True
    for row in sheet.iter_rows(values_only=True):
        if first_row:
            first_row = False
            continue
        
        if len(row) < 6 or not row[0]:
            continue
            
        category = row[2]
        status = row[4]
        
        total += 1
        if status == "PASS":
            passed += 1
        else:
            failed += 1
            
        display_category = str(category)
        if "Specific Testing" in display_category:
            display_category = "Platform-Specific Testing"
            
        category_counts[display_category] = category_counts.get(display_category, 0) + 1
        
    return {
        "total": total,
        "passed": passed,
        "failed": failed,
        "categories": category_counts
    }

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
        
    selenium_report = "reports/CivicBin_Web_Selenium_Report.xlsx"
    appium_report = "reports/CivicBin_Mobile_Appium_Report.xlsx"
    load_report = "reports/CivicBin_API_Load_Report.xlsx"
    
    print("[+] Parsing E2E and Load reports...")
    sel_data = parse_report(selenium_report)
    app_data = parse_report(appium_report)
    load_data = parse_report(load_report)
    
    if not sel_data or not app_data or not load_data:
        print("[-] Error: Could not load report spreadsheets.")
        sys.exit(1)
        
    total_cases = sel_data["total"] + app_data["total"] + load_data["total"]
    total_passed = sel_data["passed"] + app_data["passed"] + load_data["passed"]
    total_failed = sel_data["failed"] + app_data["failed"] + load_data["failed"]
    pass_rate = (total_passed / total_cases * 100) if total_cases > 0 else 0
    
    # Collect and sort all unique category names
    all_categories_keys = list(sel_data["categories"].keys()) + list(app_data["categories"].keys()) + list(load_data["categories"].keys())
    categories = sorted(list(set(all_categories_keys)))
    
    # Security findings summary
    sec_critical = 6
    sec_high = 10
    sec_medium = 7
    sec_low = 2
    sec_total = sec_critical + sec_high + sec_medium + sec_low
    sec_score = 12
    
    # Construct Markdown text matching the user's requested layout
    md = []
    md.append("# CivicBin CI/CD Pipeline — Unified Test & Security Report\n")
    
    # Table 1: Summary Table
    md.append("### 📊 Test Suites Execution Summary\n")
    md.append("| Test Suite | Platform / Target | Tests | Passed | Failed / Vulns | Status |")
    md.append("| :--- | :--- | :---: | :---: | :---: | :---: |")
    
    sel_rate = (sel_data["passed"] / sel_data["total"] * 100) if sel_data["total"] > 0 else 0
    app_rate = (app_data["passed"] / app_data["total"] * 100) if app_data["total"] > 0 else 0
    load_rate = (load_data["passed"] / load_data["total"] * 100) if load_data["total"] > 0 else 0
    
    sel_status_icon = "✅" if sel_data["failed"] == 0 else "❌"
    app_status_icon = "✅" if app_data["failed"] == 0 else "❌"
    load_status_icon = "✅" if load_data["failed"] == 0 else "❌"
    
    md.append(f"| Selenium E2E Web + API Tests | Web (Chrome) | {sel_data['total']} | {sel_data['passed']} | {sel_data['failed']} | {sel_status_icon} {sel_rate:.0f}% Pass |")
    md.append(f"| Appium Mobile Tests Dry-Run | Android | {app_data['total']} | {app_data['passed']} | {app_data['failed']} | {app_status_icon} {app_rate:.0f}% Pass |")
    md.append(f"| API Load Testing Dry-Run | HTTP API | {load_data['total']} | {load_data['passed']} | {load_data['failed']} | {load_status_icon} {load_rate:.0f}% Pass |")
    md.append(f"| 🔐 Security & Vulnerability Scan | PHP Backend & DB | {sec_total} | 0 | **{sec_total} Vulns** | ❌ **FAIL (Gate Tripped)** |")
    md.append("\n")
    
    # Overall summary line
    md.append(f"## Overall Functional Tests: {total_passed} / {total_cases} passed ({pass_rate:.0f}%) | Security Score: {sec_score}/100 🔴 CRITICAL RISK\n")
    
    # Table 2: Security Assessment Summary
    md.append("### 🚨 Vulnerability Assessment Summary\n")
    md.append("| Severity | Count | Status | Top Impact Areas |")
    md.append("| :--- | :---: | :---: | :--- |")
    md.append(f"| 🔴 **CRITICAL** | **{sec_critical}** | ❌ BLOCKING | SQL Injection (Auth bypass), Account Takeover (No OTP), Session Impersonation |")
    md.append(f"| 🟠 **HIGH** | **{sec_high}** | ⚠️ ACTION REQ | IDOR (Delete/Edit any report), Wildcard CORS, Root MySQL Creds in Git, File Upload RCE |")
    md.append(f"| 🟡 **MEDIUM** | **{sec_medium}** | ⚠️ SPRINT FIX | Unauthenticated Private Chat, Weak Password Policy, Missing CSRF, Wildcard SQL Injection |")
    md.append(f"| 🔵 **LOW** | **{sec_low}** | ℹ️ HARDENING | User Account Enumeration via error strings, Missing HTTPS enforcement |")
    md.append(f"| **TOTAL** | **{sec_total}** | 🚨 **SCORE: {sec_score}/100** | **Remediation required before production deployment** |")
    md.append("\n")

    # Table 3: Top Critical Vulnerabilities
    md.append("### ⚠️ Top 6 Critical Vulnerabilities (Must Fix Immediately)\n")
    md.append("| ID | Vulnerability | Affected File / Endpoint | Exploitation Risk | Recommended Fix |")
    md.append("| :--- | :--- | :--- | :--- | :--- |")
    md.append("| **SEC-001** | SQL Injection | `user_login.php` (POST) | Login bypass with `' OR '1'='1` | Convert to PDO prepared statements |")
    md.append("| **SEC-002** | SQL Injection | `user_signup.php` (POST) | Second-order injection in INSERT query | Parameterize INSERT with prepared statements |")
    md.append("| **SEC-003** | UNION SQLi | `get_organizers.php` (GET) | Database dump & password hash exfiltration | Bound parameters for LIKE `%city%` clause |")
    md.append("| **SEC-004** | Account Takeover | `user_reset_password.php` (POST) | Reset any user password with only email (no OTP) | Require email OTP validation before reset |")
    md.append("| **SEC-005** | Account Takeover | `org_reset_password.php` (POST) | Reset any municipal org password with email | Require email OTP validation before reset |")
    md.append("| **SEC-006** | No Session Mgmt | `db.php` / All 21 Endpoints | Universal user/admin impersonation | Enforce server `$_SESSION` or JWT auth |")
    md.append("\n")

    # Table 4: Category Breakdown Table
    md.append("### 📋 Functional Test Categories\n")
    md.append("| Category | Selenium Tests | Appium Tests | API Load Tests |")
    md.append("| :--- | :---: | :---: | :---: |")
    
    for cat in categories:
        sel_count = sel_data["categories"].get(cat, 0)
        app_count = app_data["categories"].get(cat, 0)
        load_count = load_data["categories"].get(cat, 0)
        md.append(f"| {cat} | {sel_count} | {app_count} | {load_count} |")
        
    md.append(f"| **Total** | **{sel_data['total']}** | **{app_data['total']}** | **{load_data['total']}** |")
    md.append("\n")
    md.append("---")
    md.append("📄 **Artifacts Generated:** `CivicBin_Test_Reports`, `vulnerability-report`, `web-report`, `mobile-report`, `load-report`  ")
    md.append("📊 **Reports Include:** `findings.xlsx` (4 sheets: Findings, Endpoints, Dependencies, Risk Summary), `security-review.md`, `executive-summary.md`\n")
    
    markdown_content = "\n".join(md)
    print(markdown_content)
    
    github_summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if github_summary:
        with open(github_summary, "w", encoding="utf-8") as f:
            f.write(markdown_content)
        print("[+] Written summary to GITHUB_STEP_SUMMARY successfully.")
    else:
        print("[-] GITHUB_STEP_SUMMARY environment variable not set (local run).")

if __name__ == "__main__":
    main()
