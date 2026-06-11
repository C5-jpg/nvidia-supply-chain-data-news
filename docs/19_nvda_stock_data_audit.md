# NVIDIA Stock Data Audit Report

This document reports on the audit of the canonical stock price and earnings history dataset.

---

## 1. File Metadata

* **Source File**: `data/raw/nvda_earnings_stock_history.csv`
* **Cleaned JSON Output**: `public/data/nvda_stock_timeline.json`
* **Number of Records**: 109 rows (quarters)
* **Date Range**: 1999-04-30 to 2026-04-30
* **Fields Audited**: 44 fields per row

---

## 2. Key Fields and Data Quality

### Date Fields
* `fiscalDateEnding`: The ending date of the fiscal quarter. Values are complete (no nulls), e.g. `1999-04-30`, `2026-04-30`.
* `reportedDate`: The date of the earnings release. Values are complete, e.g. `1999-05-18`, `2026-05-20`.
* `reportTime`: The time of day the report was released. Values are complete but carry generic or specific values (e.g. `Before Market Open`, `After Market Close`, `N/A`). We use these values to dynamically select the trading price baseline.

### Earnings Fields
* `reportedEPS` and `estimatedEPS`: Complete records since IPO (no nulls).
* `surprise` and `surprisePercentage`: Complete records since IPO. Surprise percentage represents the relative percentage deviation from the analyst consensus.

### Detailed Financials (Income, Balance, Cash Flow)
* Key fields: `totalRevenue`, `grossProfit`, `netIncome`, `operatingCashflow`, `capitalExpenditures`, `freeCashFlow`.
* **Data Coverage Limit**: Detailed metrics are available starting from **2006-04-30** (81 quarters of data).
* **Early Nulls**: For the first 28 quarters (1999-04-30 to 2006-01-31), these columns contain `NaN` (represented as `null` in the JSON). This is expected due to API historical depth limits, and is handled gracefully in the frontend by displaying them as `N/A` or hiding them in detail charts.

### Stock Price and Split-Adjustment Fields
* Prices are captured at three points around each report date: `before` (prev trading day), `release` (day of release, or next day if holiday/weekend), and `after` (next trading day).
* For each point, three price types are available:
  * `close_unadj`: Completely unadjusted price at the time of trading.
  * `close_split_adj`: Split-adjusted closing price.
  * `close_full_adj`: Split and dividend-adjusted closing price.
* **Price Range**:
  * Unadjusted release price ranges from **$19.75** (1999-05-18) to **$949.50** (2024-05-22), and then resets to **$125.61** (2024-08-28) after the 10-for-1 split, rising to **$223.47** (2026-05-20).
  * Split-adjusted price ranges from **$0.0411** (1999-05-18) to **$223.47** (2026-05-20), representing a 5,000x+ rise.
  * Log scale rendering will be necessary to display this price curve without flattening the first 20 years.

---

## 3. Data Integration Strategy for the Frontend

* **Contextual Timeline**: The stock timeline will be displayed as a D3 line chart below the scrollytelling. It will display the split-adjusted closing price (`close_split_adj`) to show the continuous economic trajectory of Nvidia, while the tooltips on the interactive nodes will display the raw unadjusted price (`close_unadj`) to reflect the actual price traded on that historic day.
* **Earnings Surprise vs Market Reaction**: The timeline will allow toggling or viewing the 1-day market reaction (`market_reaction_return_1d`) on each point, showcasing whether the stock jumped or fell on the release day.
* **Caveat and Terminology Notes**:
  * **No Causal Proof**: In the UI and the methodology, we explicitly state: *"Stock prices and financial metrics are provided for economic context, not as causal proof of specific supply chain relationships."*
  * **Amount Disclaimer**: Criticality is a risk index, and share percentage represents local sample shares, neither represents monetary amounts.
