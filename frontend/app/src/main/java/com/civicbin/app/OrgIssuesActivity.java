package com.civicbin.app;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import org.json.JSONArray;
import org.json.JSONObject;

public class OrgIssuesActivity extends AppCompatActivity {

    private LinearLayout issuesContainer;
    private EditText etCityFilter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_org_issues);

        TextView navDashboard = findViewById(R.id.navDashboard);
        TextView navSettings = findViewById(R.id.navSettings);
        TextView navCompleted = findViewById(R.id.navCompleted);
        issuesContainer = findViewById(R.id.issuesContainer);
        etCityFilter = findViewById(R.id.etCityFilter);

        navDashboard.setOnClickListener(v -> {
            startActivity(new Intent(this, OrgDashboardActivity.class));
            overridePendingTransition(0, 0);
            finish();
        });

        navSettings.setOnClickListener(v -> {
            startActivity(new Intent(this, OrgSettingsActivity.class));
            overridePendingTransition(0, 0);
            finish();
        });
        
        navCompleted.setOnClickListener(v -> {
            startActivity(new Intent(this, OrgCompletedActivity.class));
            overridePendingTransition(0, 0);
            finish();
        });

        etCityFilter.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                loadIssues();
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadIssues();
    }

    private void loadIssues() {
        issuesContainer.removeAllViews();
        String filterCity = etCityFilter.getText().toString().trim().toLowerCase();

        android.content.SharedPreferences prefs = getSharedPreferences("CivicBinPrefs", android.content.Context.MODE_PRIVATE);
        int orgId = prefs.getInt("org_id", 0);
        ApiClient.get("get_reports.php?org_id=" + orgId, new ApiClient.ApiCallback() {
            @Override
            public void onSuccess(JSONObject response) {
                try {
                    if ("success".equals(response.optString("status"))) {
                        JSONArray array = response.optJSONArray("data");
                        boolean found = false;

                        if (array != null) {
                            for (int i = 0; i < array.length(); i++) {
                                JSONObject report = array.getJSONObject(i);
                                String city = report.optString("city_name", "");
                                String statusStr = report.optString("status", "Pending");

                                if (!filterCity.isEmpty() && !city.toLowerCase().contains(filterCity)) {
                                    continue; // Skip if it doesn't match filter
                                }
                                
                                if (!"Pending".equals(statusStr)) {
                                    continue; // Skip if it is not pending
                                }

                                found = true;
                                final long reportId = report.optLong("id", 0);
                                final String finalStatusStr = statusStr;
                                final String addressStr = report.optString("address", "");
                                final String photoUri = report.optString("photo_uri", "");
                                final String contactStr = report.optString("contact_number", "");

                                // Card Container
                                LinearLayout card = new LinearLayout(OrgIssuesActivity.this);
                                card.setOrientation(LinearLayout.HORIZONTAL);
                                card.setBackgroundResource(R.drawable.bg_rounded_white);
                                card.setPadding(32, 32, 32, 32);
                                card.setElevation(4f);
                                LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                                cardParams.setMargins(0, 0, 0, 32);
                                card.setLayoutParams(cardParams);
                                
                                // Clicking card opens details
                                card.setOnClickListener(v -> openDetails(reportId, city, addressStr, contactStr, photoUri, finalStatusStr));

                                // Image
                                ImageView imageView = new ImageView(OrgIssuesActivity.this);
                                imageView.setLayoutParams(new LinearLayout.LayoutParams(200, 200));
                                imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
                                imageView.setBackgroundResource(R.drawable.bg_rounded_white);
                            imageView.setClipToOutline(true);
                                if (!photoUri.isEmpty()) {
                                    try {
                                        java.io.InputStream is = getContentResolver().openInputStream(Uri.parse(photoUri));
                                        if (is != null) {
                                            imageView.setImageBitmap(android.graphics.BitmapFactory.decodeStream(is));
                                            is.close();
                                        }
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    }
                                }
                                card.addView(imageView);

                                // Details Container
                                LinearLayout details = new LinearLayout(OrgIssuesActivity.this);
                                details.setOrientation(LinearLayout.VERTICAL);
                                details.setPadding(32, 0, 0, 0);
                                details.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));

                                TextView title = new TextView(OrgIssuesActivity.this);
                                title.setText(city + " Issue");
                                title.setTextColor(Color.parseColor("#0f172a"));
                                title.setTextSize(16f);
                                title.setTypeface(null, android.graphics.Typeface.BOLD);
                                details.addView(title);

                                TextView statusBadge = new TextView(OrgIssuesActivity.this);
                                statusBadge.setText(finalStatusStr);
                                statusBadge.setTextSize(10f);
                                statusBadge.setTypeface(null, android.graphics.Typeface.BOLD);
                                statusBadge.setPadding(16, 4, 16, 4);
                                if ("Pending".equals(finalStatusStr)) {
                                    statusBadge.setTextColor(Color.parseColor("#ea580c"));
                                    statusBadge.setBackgroundColor(Color.parseColor("#ffedd5"));
                                } else {
                                    statusBadge.setTextColor(Color.parseColor("#0ba360"));
                                    statusBadge.setBackgroundColor(Color.parseColor("#dcfce7"));
                                }
                                LinearLayout.LayoutParams badgeParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                                badgeParams.setMargins(0, 8, 0, 8);
                                statusBadge.setLayoutParams(badgeParams);
                                details.addView(statusBadge);

                                TextView address = new TextView(OrgIssuesActivity.this);
                                address.setText(addressStr);
                                address.setTextColor(Color.parseColor("#64748b"));
                                address.setTextSize(12f);
                                details.addView(address);

                                Button btnResolve = new Button(OrgIssuesActivity.this);
                                btnResolve.setText("Details");
                                btnResolve.setAllCaps(false);
                                btnResolve.setBackgroundColor(Color.parseColor("#0f172a"));
                                btnResolve.setTextColor(Color.WHITE);
                                btnResolve.setTextSize(12f);
                                LinearLayout.LayoutParams btnParams = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                                btnParams.setMargins(0, 16, 0, 0);
                                btnResolve.setLayoutParams(btnParams);
                                
                                // Clicking resolve also opens details
                                btnResolve.setOnClickListener(v -> openDetails(reportId, city, addressStr, contactStr, photoUri, finalStatusStr));
                                
                                details.addView(btnResolve);

                                card.addView(details);
                                issuesContainer.addView(card);
                            }
                        }

                        if (!found) {
                            TextView empty = new TextView(OrgIssuesActivity.this);
                            empty.setText("No issues found.");
                            empty.setGravity(Gravity.CENTER);
                            empty.setPadding(0, 50, 0, 0);
                            issuesContainer.addView(empty);
                        }
                    } else {
                        Toast.makeText(OrgIssuesActivity.this, response.optString("message"), Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onError(String error) {
                Toast.makeText(OrgIssuesActivity.this, error, Toast.LENGTH_SHORT).show();
            }
        });
    }
    
    private void openDetails(long id, String city, String address, String contact, String photo, String status) {
        Intent intent = new Intent(this, OrgIssueDetailsActivity.class);
        intent.putExtra("report_id", id);
        intent.putExtra("city_name", city);
        intent.putExtra("address", address);
        intent.putExtra("contact_number", contact);
        intent.putExtra("photo_uri", photo);
        intent.putExtra("status", status);
        startActivity(intent);
    }
}
