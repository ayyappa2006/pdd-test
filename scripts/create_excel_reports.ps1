# PowerShell script to create valid openxml Excel file (.xlsx)
param(
    [string]$OutFile = "Vulnerability Test Results\findings.xlsx"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

$tempDir = Join-Path $env:TEMP ("xlsx_" + [System.Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tempDir | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "_rels") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "xl") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "xl\_rels") | Out-Null
New-Item -ItemType Directory -Path (Join-Path $tempDir "xl\worksheets") | Out-Null

# 1. [Content_Types].xml
$contentTypes = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet4.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>
'@
Set-Content -Path (Join-Path $tempDir "[Content_Types].xml") -Value $contentTypes -Encoding UTF8

# 2. _rels/.rels
$rels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>
'@
Set-Content -Path (Join-Path $tempDir "_rels\.rels") -Value $rels -Encoding UTF8

# 3. xl/_rels/workbook.xml.rels
$wbRels = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet4.xml"/>
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
  <Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>
'@
Set-Content -Path (Join-Path $tempDir "xl\_rels\workbook.xml.rels") -Value $wbRels -Encoding UTF8

# 4. xl/workbook.xml
$workbook = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Security Findings" sheetId="1" r:id="rId1"/>
    <sheet name="Endpoint Inventory" sheetId="2" r:id="rId2"/>
    <sheet name="Dependency Vulnerabilities" sheetId="3" r:id="rId3"/>
    <sheet name="Risk Summary" sheetId="4" r:id="rId4"/>
  </sheets>
</workbook>
'@
Set-Content -Path (Join-Path $tempDir "xl\workbook.xml") -Value $workbook -Encoding UTF8

# 5. xl/styles.xml
$styles = @'
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="4">
    <font><sz val="10"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="14"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
  </fonts>
  <fills count="9">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1A2332"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF2C3E50"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFC0392B"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE67E22"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF1C40F"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF3498DB"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF27AE60"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/></border>
    <border>
      <left style="thin"><color rgb="FFBDC3C7"/></left>
      <right style="thin"><color rgb="FFBDC3C7"/></right>
      <top style="thin"><color rgb="FFBDC3C7"/></top>
      <bottom style="thin"><color rgb="FFBDC3C7"/></bottom>
    </border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="9">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"/>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" alignment="center"/>
    <xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" alignment="center"/>
    <xf numFmtId="0" fontId="3" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" alignment="center"/>
    <xf numFmtId="0" fontId="3" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" alignment="center"/>
    <xf numFmtId="0" fontId="3" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" alignment="center"/>
    <xf numFmtId="0" fontId="3" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1" alignment="center"/>
    <xf numFmtId="0" fontId="3" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" alignment="center"/>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>
  </cellXfs>
</styleSheet>
'@
Set-Content -Path (Join-Path $tempDir "xl\styles.xml") -Value $styles -Encoding UTF8

# Shared strings table
$sharedStrings = [System.Collections.Generic.List[string]]::new()
$stringLookup = @{}

function Add-String([string]$str) {
    if ($stringLookup.ContainsKey($str)) {
        return $stringLookup[$str]
    }
    $idx = $sharedStrings.Count
    $sharedStrings.Add($str)
    $stringLookup[$str] = $idx
    return $idx
}

function Build-SheetXml([array]$rows, [array]$colWidths) {
    $sb = [System.Text.StringBuilder]::new()
    [void]$sb.AppendLine('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')
    [void]$sb.AppendLine('<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">')
    
    if ($colWidths.Count -gt 0) {
        [void]$sb.AppendLine('  <cols>')
        for ($i = 0; $i -lt $colWidths.Count; $i++) {
            $colNum = $i + 1
            $w = $colWidths[$i]
            [void]$sb.AppendLine("    <col min=`"$colNum`" max=`"$colNum`" width=`"$w`" customWidth=`"1`"/>")
        }
        [void]$sb.AppendLine('  </cols>')
    }
    
    [void]$sb.AppendLine('  <sheetData>')
    for ($r = 0; $r -lt $rows.Count; $r++) {
        $rowNum = $r + 1
        $cells = $rows[$r]
        [void]$sb.AppendLine("    <row r=`"$rowNum`">")
        for ($c = 0; $c -lt $cells.Count; $c++) {
            $colLetter = [char](65 + $c)
            $cellRef = "$colLetter$rowNum"
            $cellObj = $cells[$c]
            $val = $cellObj.val
            $style = if ($cellObj.style) { $cellObj.style } else { 0 }
            
            $strIdx = Add-String "$val"
            [void]$sb.AppendLine("      <c r=`"$cellRef`" s=`"$style`" t=`"s`"><v>$strIdx</v></c>")
        }
        [void]$sb.AppendLine('    </row>')
    }
    [void]$sb.AppendLine('  </sheetData>')
    [void]$sb.AppendLine('</worksheet>')
    return $sb.ToString()
}

# ─────────────────────────────────────────────────────────────
# Sheet 1: Security Findings
# ─────────────────────────────────────────────────────────────
$findingsData = @(
    @("ID","Severity","Vulnerability Type","File Path","Endpoint","Line","Description","Impact","Recommended Fix"),
    @("SEC-001","CRITICAL","SQL Injection","backend/user_login.php","POST /backend/user_login.php","14","WHERE email='$email' query concatenation allows auth bypass","Authentication bypass; full DB read access","Use PDO prepared statements"),
    @("SEC-002","CRITICAL","SQL Injection","backend/user_signup.php","POST /backend/user_signup.php","18","INSERT query built via string interpolation","Data tampering; privilege escalation","Use PDO prepared statements"),
    @("SEC-003","CRITICAL","SQL Injection (UNION-based)","backend/get_organizers.php","GET /backend/get_organizers.php","7","LIKE '%$city%' concatenation allows UNION password extraction","Full database dump; password hash theft","Use prepared statement with bound parameters"),
    @("SEC-004","CRITICAL","Unauthenticated Password Reset","backend/user_reset_password.php","POST /backend/user_reset_password.php","28","Password reset requires no OTP or token - email only","Complete account takeover for any user","Generate and verify time-limited OTP via email"),
    @("SEC-005","CRITICAL","Unauthenticated Password Reset","backend/org_reset_password.php","POST /backend/org_reset_password.php","28","Organization password reset requires no OTP or token","Complete account takeover for any organization","Generate and verify time-limited OTP via email"),
    @("SEC-006","CRITICAL","No Session Management","backend/db.php","ALL Endpoints","1","Trusts client-supplied user_id with no session or JWT verification","Universal impersonation across all endpoints","Implement PHP sessions or JWT authorization"),
    @("SEC-007","HIGH","IDOR - Delete Any Report","backend/delete_report.php","POST /backend/delete_report.php","14","No ownership check on report deletion","Any caller can delete any citizen's report","Verify report ownership against authenticated session"),
    @("SEC-008","HIGH","IDOR - Edit Any Report","backend/update_report.php","POST /backend/update_report.php","16","No ownership check on report update","Tampering with civic issue reports","Verify report ownership against authenticated session"),
    @("SEC-009","HIGH","IDOR - Change Report Status","backend/update_report_status.php","POST /backend/update_report_status.php","18","org_id accepted from body with no validation","Unauthorized resolution credits and status changes","Extract org_id from server session only"),
    @("SEC-010","HIGH","Wildcard CORS Policy","backend/db.php","ALL Endpoints","8","Access-Control-Allow-Origin: * allows any web origin to query API","Cross-site data exfiltration from authenticated users","Restrict to trusted front-end origin whitelist"),
    @("SEC-011","HIGH","Hardcoded Database Credentials","backend/db.php","N/A","20","MySQL root credentials hardcoded in source repository","Direct database compromise if port is reachable","Move to environment variables (.env)"),
    @("SEC-012","HIGH","No Rate Limiting / Brute-Force","backend/user_login.php","POST /backend/user_login.php","1","No throttling or lockout on login endpoints","Credential stuffing and password brute-forcing","Implement IP/account-based rate limiting"),
    @("SEC-013","HIGH","Unsafe File Upload (RCE Risk)","backend/upload_image.php","POST /backend/upload_image.php","28","File extension parsed without strict whitelist; stored in webroot","Remote Code Execution via uploaded web shell","Whitelist extensions, hash filenames, disable execution"),
    @("SEC-014","HIGH","Database Error Disclosure","backend/submit_report.php","Multiple Endpoints","Various","mysqli_error echoed in JSON responses","Schema mapping and SQL injection reconnaissance","Log errors internally; return generic error messages"),
    @("SEC-015","HIGH","IDOR - PII Harvesting","backend/get_user_details.php","GET /backend/get_user_details.php","14","Returns name and email for any user_id query","Harvesting PII of all registered citizens","Require session and restrict to requesting user"),
    @("SEC-016","HIGH","Missing Security Headers","backend/db.php","ALL Endpoints","7","No X-Frame-Options, CSP, HSTS, or nosniff headers","Clickjacking and MIME sniffing vulnerabilities","Add security headers in central db.php"),
    @("SEC-017","MEDIUM","No Password Strength Policy","backend/user_signup.php","POST /backend/user_signup.php","12","Any password accepted including single character","Trivial passwords vulnerable to offline dictionary attack","Enforce min 8 characters, numbers, and symbols"),
    @("SEC-018","MEDIUM","No Email Format Validation","backend/user_signup.php","POST /backend/user_signup.php","11","No filter_var validation on signup email","Corrupted database records and unreachability","Validate using filter_var(FILTER_VALIDATE_EMAIL)"),
    @("SEC-019","MEDIUM","Missing CSRF Protection","backend/db.php","ALL POST Endpoints","1","No CSRF token validation on state-changing actions","Cross-Site Request Forgery via malicious websites","Implement anti-CSRF tokens or SameSite cookies"),
    @("SEC-020","MEDIUM","LIKE Wildcard Injection","backend/get_organizers.php","GET /backend/get_organizers.php","7","% wildcard not escaped in SQL query","Information leakage of full organizer database","Escape % and _ characters before LIKE queries"),
    @("SEC-021","MEDIUM","Git Secrets Exposure","backend/db.php","N/A","20","Database connection settings committed to Git history","Credential leakage across repository clones","Purge from Git history and rotate passwords"),
    @("SEC-022","MEDIUM","Unauthenticated Chat Access","backend/get_messages.php","GET /backend/get_messages.php","1","Private citizen-organization messages queryable without auth","Eavesdropping on private citizen complaints","Require authentication and party validation"),
    @("SEC-023","MEDIUM","Fraudulent Status Attribution","backend/update_report_status.php","POST /backend/update_report_status.php","14","Arbitrary org_id credited for cleanup","Falsification of municipal cleanliness statistics","Derive org_id from authenticated session"),
    @("SEC-024","LOW","User Account Enumeration","backend/user_login.php","POST /backend/user_login.php","22","Different error messages for user not found vs wrong password","Enumerating valid registered email addresses","Return uniform 'Invalid email or password' message"),
    @("SEC-025","LOW","Insecure HTTP Scheme Assembly","backend/upload_image.php","POST /backend/upload_image.php","40","Upload URL constructed without enforcing HTTPS","Man-in-the-middle tampering of image URLs","Enforce HTTPS URLs for uploaded assets")
)

$s1Rows = @()
for ($i = 0; $i -lt $findingsData.Count; $i++) {
    $row = $findingsData[$i]
    $rowCells = @()
    for ($j = 0; $j -lt $row.Count; $j++) {
        $val = $row[$j]
        $style = 8
        if ($i -eq 0) {
            $style = 2
        } elseif ($j -eq 1) {
            if ($val -eq "CRITICAL") { $style = 3 }
            elseif ($val -eq "HIGH") { $style = 4 }
            elseif ($val -eq "MEDIUM") { $style = 5 }
            elseif ($val -eq "LOW") { $style = 6 }
        }
        $rowCells += [PSCustomObject]@{ val = $val; style = $style }
    }
    $s1Rows += ,$rowCells
}

$s1Xml = Build-SheetXml $s1Rows @(12, 14, 28, 32, 35, 8, 55, 45, 55)
Set-Content -Path (Join-Path $tempDir "xl\worksheets\sheet1.xml") -Value $s1Xml -Encoding UTF8

# ─────────────────────────────────────────────────────────────
# Sheet 2: Endpoint Inventory
# ─────────────────────────────────────────────────────────────
$epData = @(
    @("#","Endpoint","Method","Auth Required","Expected Roles","Controller / File Path","Risk Level"),
    @("1","/backend/user_login.php","POST","No","Public","backend/user_login.php","HIGH"),
    @("2","/backend/user_signup.php","POST","No","Public","backend/user_signup.php","HIGH"),
    @("3","/backend/org_login.php","POST","No","Public","backend/org_login.php","HIGH"),
    @("4","/backend/org_signup.php","POST","No","Public","backend/org_signup.php","MEDIUM"),
    @("5","/backend/get_reports.php","GET","No","Org (unenforced)","backend/get_reports.php","HIGH"),
    @("6","/backend/get_user_reports.php","GET","No","User (unenforced)","backend/get_user_reports.php","HIGH"),
    @("7","/backend/get_user_details.php","GET","No","User (unenforced)","backend/get_user_details.php","HIGH"),
    @("8","/backend/get_org_details.php","GET","No","Org (unenforced)","backend/get_org_details.php","MEDIUM"),
    @("9","/backend/get_organizers.php","GET","No","Public","backend/get_organizers.php","CRITICAL"),
    @("10","/backend/get_cleanliness_score.php","GET","No","Public","backend/get_cleanliness_score.php","LOW"),
    @("11","/backend/get_messages.php","GET","No","User/Org (unenforced)","backend/get_messages.php","HIGH"),
    @("12","/backend/get_chat_list.php","GET","No","Org (unenforced)","backend/get_chat_list.php","HIGH"),
    @("13","/backend/send_message.php","POST","No","User/Org (unenforced)","backend/send_message.php","HIGH"),
    @("14","/backend/submit_report.php","POST","No","User (unenforced)","backend/submit_report.php","HIGH"),
    @("15","/backend/upload_image.php","POST","No","User (unenforced)","backend/upload_image.php","CRITICAL"),
    @("16","/backend/delete_report.php","POST","No","User (unenforced)","backend/delete_report.php","CRITICAL"),
    @("17","/backend/update_report.php","POST","No","User (unenforced)","backend/update_report.php","HIGH"),
    @("18","/backend/update_report_status.php","POST","No","Org (unenforced)","backend/update_report_status.php","CRITICAL"),
    @("19","/backend/user_reset_password.php","POST","No","Public","backend/user_reset_password.php","CRITICAL"),
    @("20","/backend/org_reset_password.php","POST","No","Public","backend/org_reset_password.php","CRITICAL"),
    @("21","/backend/options.php","GET","No","Public","backend/options.php","LOW")
)

$s2Rows = @()
for ($i = 0; $i -lt $epData.Count; $i++) {
    $row = $epData[$i]
    $rowCells = @()
    for ($j = 0; $j -lt $row.Count; $j++) {
        $val = $row[$j]
        $style = 8
        if ($i -eq 0) {
            $style = 2
        } elseif ($j -eq 3 -and $val -eq "No") {
            $style = 3
        } elseif ($j -eq 6) {
            if ($val -eq "CRITICAL") { $style = 3 }
            elseif ($val -eq "HIGH") { $style = 4 }
            elseif ($val -eq "MEDIUM") { $style = 5 }
            elseif ($val -eq "LOW") { $style = 6 }
        }
        $rowCells += [PSCustomObject]@{ val = $val; style = $style }
    }
    $s2Rows += ,$rowCells
}
$s2Xml = Build-SheetXml $s2Rows @(6, 40, 10, 16, 26, 40, 14)
Set-Content -Path (Join-Path $tempDir "xl\worksheets\sheet2.xml") -Value $s2Xml -Encoding UTF8

# ─────────────────────────────────────────────────────────────
# Sheet 3: Dependency Vulnerabilities
# ─────────────────────────────────────────────────────────────
$depData = @(
    @("Package / Component","Detected Version","Severity","CVE / Advisory","Description","Recommended Upgrade"),
    @("PHP Runtime (XAMPP)","8.x","HIGH","CVE-2024-2756","Cookie bypass & libxml parser XXE","Upgrade to PHP 8.2.18+ or 8.3.6+"),
    @("MySQL Database (XAMPP)","8.0.x","MEDIUM","CVE-2024-21096","Oracle MySQL Server vulnerability","Upgrade to MySQL 8.0.37+"),
    @("Apache HTTP Server (XAMPP)","2.4.x","HIGH","CVE-2023-45802","mod_http2 memory pressure DoS","Upgrade to Apache 2.4.58+"),
    @("OpenSSL Library","Bundled","HIGH","CVE-2023-0464","Policy check certificate chain verification DoS","Update OpenSSL to 3.0.9+"),
    @("PHP Dependency Manager","Missing","MEDIUM","N/A","No composer.json lockfile; unable to pin dependencies","Introduce Composer and composer.lock"),
    @("k6 Load Testing","0.49.0","LOW","N/A","Non-production load testing runner","Keep updated to latest stable"),
    @("Selenium WebDriver","4.10.0","LOW","N/A","Non-production E2E test harness","Keep updated to latest stable")
)

$s3Rows = @()
for ($i = 0; $i -lt $depData.Count; $i++) {
    $row = $depData[$i]
    $rowCells = @()
    for ($j = 0; $j -lt $row.Count; $j++) {
        $val = $row[$j]
        $style = 8
        if ($i -eq 0) {
            $style = 2
        } elseif ($j -eq 2) {
            if ($val -eq "CRITICAL") { $style = 3 }
            elseif ($val -eq "HIGH") { $style = 4 }
            elseif ($val -eq "MEDIUM") { $style = 5 }
            elseif ($val -eq "LOW") { $style = 6 }
        }
        $rowCells += [PSCustomObject]@{ val = $val; style = $style }
    }
    $s3Rows += ,$rowCells
}
$s3Xml = Build-SheetXml $s3Rows @(30, 20, 14, 24, 55, 35)
Set-Content -Path (Join-Path $tempDir "xl\worksheets\sheet3.xml") -Value $s3Xml -Encoding UTF8

# ─────────────────────────────────────────────────────────────
# Sheet 4: Risk Summary
# ─────────────────────────────────────────────────────────────
$summaryData = @(
    @("Metric / Category","Value / Level","Status","Action Required"),
    @("Total Security Findings","25","Assessed","Full remediation needed"),
    @("CRITICAL Severity","6","FAIL","Immediate blocking fix required"),
    @("HIGH Severity","10","WARN","Fix prior to public deployment"),
    @("MEDIUM Severity","7","WARN","Address in sprint remediation"),
    @("LOW Severity","2","INFO","Harden in regular cycle"),
    @("Overall Security Score","12 / 100","CRITICAL RISK","Application cannot be deployed safely"),
    @("Authentication Mechanism","None (Client localStorage)","BROKEN","Implement server-side sessions / JWT"),
    @("SQL Injection Surface","3 Endpoints Exposed","EXPLOITABLE","Migrate all queries to PDO prepared statements"),
    @("Account Takeover Vulnerability","Password Reset (No OTP)","EXPLOITABLE","Implement email OTP verification"),
    @("Access Control (IDOR)","Delete, Update, Status exposed","EXPLOITABLE","Enforce session-based ownership checks"),
    @("Security Gate Verdict","REJECTED","FAIL","CI/CD security gate tripped by Critical findings")
)

$s4Rows = @()
for ($i = 0; $i -lt $summaryData.Count; $i++) {
    $row = $summaryData[$i]
    $rowCells = @()
    for ($j = 0; $j -lt $row.Count; $j++) {
        $val = $row[$j]
        $style = 8
        if ($i -eq 0) {
            $style = 2
        } elseif ($j -eq 2) {
            if ($val -eq "FAIL" -or $val -eq "CRITICAL RISK" -or $val -eq "BROKEN" -or $val -eq "EXPLOITABLE" -or $val -eq "REJECTED") { $style = 3 }
            elseif ($val -eq "WARN") { $style = 4 }
            elseif ($val -eq "INFO" -or $val -eq "Assessed") { $style = 7 }
        }
        $rowCells += [PSCustomObject]@{ val = $val; style = $style }
    }
    $s4Rows += ,$rowCells
}
$s4Xml = Build-SheetXml $s4Rows @(32, 28, 20, 45)
Set-Content -Path (Join-Path $tempDir "xl\worksheets\sheet4.xml") -Value $s4Xml -Encoding UTF8

# ─────────────────────────────────────────────────────────────
# xl/sharedStrings.xml
# ─────────────────────────────────────────────────────────────
$ssSb = [System.Text.StringBuilder]::new()
[void]$ssSb.AppendLine('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')
[void]$ssSb.AppendLine("<sst xmlns=`"http://schemas.openxmlformats.org/spreadsheetml/2006/main`" count=`"$($sharedStrings.Count)`" uniqueCount=`"$($sharedStrings.Count)`">")
foreach ($s in $sharedStrings) {
    $escaped = [System.Security.SecurityElement]::Escape($s)
    [void]$ssSb.AppendLine("  <si><t>$escaped</t></si>")
}
[void]$ssSb.AppendLine('</sst>')
Set-Content -Path (Join-Path $tempDir "xl\sharedStrings.xml") -Value $ssSb.ToString() -Encoding UTF8

# Zip into .xlsx
$outResolved = [System.IO.Path]::GetFullPath($OutFile)
$outParent = [System.IO.Path]::GetDirectoryName($outResolved)
if (-not (Test-Path $outParent)) {
    New-Item -ItemType Directory -Path $outParent | Out-Null
}
if (Test-Path $outResolved) {
    Remove-Item -Path $outResolved -Force
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $outResolved)
Remove-Item -Path $tempDir -Recurse -Force
Write-Host "[+] Successfully created: $outResolved"
