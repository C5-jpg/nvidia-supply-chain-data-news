import requests
import pandas as pd
import numpy as np
import time
import os
import yfinance as yf

# API Keys
AV_KEY = "0AMY3A4QYZPV6DAB"
SYMBOL = "NVDA"
OUTPUT_CSV = "data/nvda_earnings_stock_history.csv"

def get_alpha_vantage_data(function, symbol, api_key):
    """
    Fetch data from Alpha Vantage with retry logic for rate limits.
    """
    url = f"https://www.alphavantage.co/query?function={function}&symbol={symbol}&apikey={api_key}"
    retries = 5
    for attempt in range(retries):
        print(f"Fetching {function} from Alpha Vantage (attempt {attempt + 1}/{retries})...")
        response = requests.get(url)
        data = response.json()
        
        # Check for rate limit message or information message
        if "Note" in data:
            print("Rate limit hit. Sleeping for 20 seconds...")
            time.sleep(20)
            continue
        elif "Information" in data and "premium" in data["Information"]:
            print(f"Error: Premium endpoint error or key limitation for {function}: {data['Information']}")
            return None
        elif "Error Message" in data:
            print(f"Error fetching {function}: {data['Error Message']}")
            return None
        else:
            return data
            
    print(f"Failed to fetch {function} after {retries} attempts due to rate limit.")
    return None

def to_float(val):
    """Safely convert Alpha Vantage string value to float."""
    if val is None or val == "None" or val == "" or val == "N/A":
        return np.nan
    try:
        return float(val)
    except ValueError:
        return np.nan

def main():
    print("Starting Nvidia data collection since IPO...")
    
    # 1. Fetch yfinance Stock Prices & Splits
    print("\n--- Step 1: Fetching Stock Price History from Yahoo Finance ---")
    ticker = yf.Ticker(SYMBOL)
    
    # IPO was on Jan 22, 1999. Fetch daily data since Jan 1, 1999
    # auto_adjust=False gives us Close (split-adjusted only) and Adj Close (split-and-dividend adjusted)
    df_prices = ticker.history(start="1999-01-01", end="2026-06-12", auto_adjust=False)
    print(f"Fetched {len(df_prices)} daily stock bars.")
    
    # Get split history
    splits = ticker.splits
    print(f"Fetched split history: {len(splits)} splits found.")
    for dt, ratio in splits.items():
        print(f"  Split on {dt.strftime('%Y-%m-%d')}: {ratio}-for-1")
        
    # Reset index and format Date column
    df_prices = df_prices.reset_index()
    # Remove timezone info for simpler matching
    df_prices['Date_str'] = df_prices['Date'].dt.tz_localize(None).dt.strftime('%Y-%m-%d')
    df_prices['Date_naive'] = df_prices['Date'].dt.tz_localize(None)
    
    # Compute cumulative split factors
    # For any date d, the split factor is the product of all split ratios occurring AFTER date d.
    def get_split_factor(date_naive):
        factor = 1.0
        for split_date, ratio in splits.items():
            split_dt_naive = split_date.tz_localize(None)
            if split_dt_naive > date_naive:
                factor *= ratio
        return factor
    
    df_prices['split_factor'] = df_prices['Date_naive'].apply(get_split_factor)
    
    # Calculate unadjusted prices
    df_prices['close_unadj'] = df_prices['Close'] * df_prices['split_factor']
    df_prices['open_unadj'] = df_prices['Open'] * df_prices['split_factor']
    df_prices['high_unadj'] = df_prices['High'] * df_prices['split_factor']
    df_prices['low_unadj'] = df_prices['Low'] * df_prices['split_factor']
    
    # Keep key columns
    price_cols = [
        'Date_str', 'Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume', 
        'open_unadj', 'high_unadj', 'low_unadj', 'close_unadj', 'split_factor'
    ]
    df_prices_clean = df_prices[price_cols].rename(columns={
        'Open': 'close_to_be_renamed_open_split_adj', # we will use close prices for the reaction window
        'Close': 'close_split_adj',
        'Adj Close': 'close_full_adj'
    })
    
    # Create helper dictionary for fast lookup
    price_dict = df_prices_clean.set_index('Date_str').to_dict(orient='index')
    trading_dates = sorted(df_prices_clean['Date_str'].tolist())
    
    # Helper to find nearest trading date (current or next)
    def get_nearest_trading_date_idx(date_str):
        if date_str in price_dict:
            return trading_dates.index(date_str)
        # Find the first trading date that is greater than or equal to date_str
        for idx, t_date in enumerate(trading_dates):
            if t_date >= date_str:
                return idx
        return len(trading_dates) - 1

    # 2. Fetch Alpha Vantage Earnings data
    print("\n--- Step 2: Fetching Earnings History from Alpha Vantage ---")
    earnings_data = get_alpha_vantage_data("EARNINGS", SYMBOL, AV_KEY)
    if not earnings_data or "quarterlyEarnings" not in earnings_data:
        print("Error: Could not retrieve earnings history. Exiting.")
        return
    
    q_earnings = earnings_data["quarterlyEarnings"]
    print(f"Success! Retrieved {len(q_earnings)} quarters of earnings data.")
    
    # 3. Fetch Alpha Vantage Financial Statements
    # Note: Alpha Vantage free tier has 5 calls/min limit. Sleep 20s between calls.
    print("\n--- Step 3: Fetching Financial Statements from Alpha Vantage ---")
    time.sleep(20)
    inc_data = get_alpha_vantage_data("INCOME_STATEMENT", SYMBOL, AV_KEY)
    
    time.sleep(20)
    bal_data = get_alpha_vantage_data("BALANCE_SHEET", SYMBOL, AV_KEY)
    
    time.sleep(20)
    cf_data = get_alpha_vantage_data("CASH_FLOW", SYMBOL, AV_KEY)
    
    # Process financial statements into dictionary keyed by fiscalDateEnding
    statements_dict = {}
    
    def process_statement(statement_data, fields, category_name):
        if not statement_data or "quarterlyReports" not in statement_data:
            print(f"Warning: No quarterly data found for {category_name}")
            return
        reports = statement_data["quarterlyReports"]
        print(f"Processed {len(reports)} quarters from {category_name}")
        for r in reports:
            fde = r.get("fiscalDateEnding")
            if not fde:
                continue
            if fde not in statements_dict:
                statements_dict[fde] = {}
            for field in fields:
                statements_dict[fde][field] = to_float(r.get(field))
    
    income_fields = [
        'totalRevenue', 'grossProfit', 'costOfRevenue', 'operatingIncome',
        'sellingGeneralAndAdministrative', 'researchAndDevelopment', 
        'operatingExpenses', 'netIncome'
    ]
    balance_fields = [
        'totalAssets', 'totalCurrentAssets', 'cashAndCashEquivalentsAtCarryingValue',
        'cashAndShortTermInvestments', 'totalLiabilities', 'totalCurrentLiabilities',
        'totalShareholderEquity', 'commonStockSharesOutstanding'
    ]
    cashflow_fields = [
        'operatingCashflow', 'capitalExpenditures', 'dividendPayout'
    ]
    
    process_statement(inc_data, income_fields, "INCOME_STATEMENT")
    process_statement(bal_data, balance_fields, "BALANCE_SHEET")
    process_statement(cf_data, cashflow_fields, "CASH_FLOW")
    
    # 4. Process and Align Data
    print("\n--- Step 4: Aligning Earnings, Financial Statements, and Stock Prices ---")
    rows = []
    for qe in q_earnings:
        fde = qe.get("fiscalDateEnding")
        rep_date_str = qe.get("reportedDate")
        reported_eps = to_float(qe.get("reportedEPS"))
        estimated_eps = to_float(qe.get("estimatedEPS"))
        surprise = to_float(qe.get("surprise"))
        surprise_pct = to_float(qe.get("surprisePercentage"))
        report_time = qe.get("reportTime", "N/A")
        
        # Calculate Fiscal Year and Quarter
        # fiscalDateEnding is like "1999-04-30"
        fde_dt = pd.to_datetime(fde)
        f_year = fde_dt.year
        f_month = fde_dt.month
        
        # NVDA fiscal year ending is typically late January
        # Let's map month to quarter
        # Nvidia Q1 ends in April, Q2 in July, Q3 in October, Q4 in January (next calendar year)
        # So Q1: April, Q2: July, Q3: October, Q4: January
        if f_month in [3, 4, 5]:
            f_quarter = "Q1"
        elif f_month in [6, 7, 8]:
            f_quarter = "Q2"
        elif f_month in [9, 10, 11]:
            f_quarter = "Q3"
        else:
            f_quarter = "Q4"
            # If Q4 is in Jan, the fiscal year is the calendar year it ends in.
            # e.g., fiscal date ending 2026-01-26 is NVDA FY2026 Q4.
            
        row = {
            "fiscalDateEnding": fde,
            "fiscalYear": f_year,
            "fiscalQuarter": f_quarter,
            "reportedDate": rep_date_str,
            "reportTime": report_time,
            "reportedEPS": reported_eps,
            "estimatedEPS": estimated_eps,
            "surprise": surprise,
            "surprisePercentage": surprise_pct
        }
        
        # Merge Financial Statements
        stmt = statements_dict.get(fde, {})
        for field in income_fields + balance_fields + cashflow_fields:
            row[field] = stmt.get(field, np.nan)
            
        # Calculate Free Cash Flow (Operating Cash Flow - Capital Expenditures)
        # In Alpha Vantage, cash outflows for Capex are stored as positive values.
        # Let's check: if both are available, FCF = OCF - Capex
        ocf = row.get("operatingCashflow")
        capex = row.get("capitalExpenditures")
        if not np.isnan(ocf) and not np.isnan(capex):
            row["freeCashFlow"] = ocf - capex
        else:
            row["freeCashFlow"] = np.nan
            
        # Match Stock Prices around reportedDate
        # Find trading index for release date
        release_idx = get_nearest_trading_date_idx(rep_date_str)
        before_idx = max(0, release_idx - 1)
        after_idx = min(len(trading_dates) - 1, release_idx + 1)
        
        date_before = trading_dates[before_idx]
        date_release = trading_dates[release_idx]
        date_after = trading_dates[after_idx]
        
        p_before = price_dict[date_before]
        p_release = price_dict[date_release]
        p_after = price_dict[date_after]
        
        # Populate stock price fields in row
        row["priceDate_before"] = date_before
        row["close_unadj_before"] = p_before["close_unadj"]
        row["close_split_adj_before"] = p_before["close_split_adj"]
        row["close_full_adj_before"] = p_before["close_full_adj"]
        
        row["priceDate_release"] = date_release
        row["close_unadj_release"] = p_release["close_unadj"]
        row["close_split_adj_release"] = p_release["close_split_adj"]
        row["close_full_adj_release"] = p_release["close_full_adj"]
        
        row["priceDate_after"] = date_after
        row["close_unadj_after"] = p_after["close_unadj"]
        row["close_split_adj_after"] = p_after["close_split_adj"]
        row["close_full_adj_after"] = p_after["close_full_adj"]
        
        # Calculate market reaction return (1-day Return)
        # If Before Market Open (BMO) on date D: reaction is (close_D - close_D-1) / close_D-1
        # If After Market Close (AMC) on date D: reaction is (close_D+1 - close_D) / close_D
        # Otherwise, or if unknown: close-to-close from D-1 to D+1 is (close_D+1 - close_D-1) / close_D-1
        
        # Check report_time string
        time_lower = str(report_time).lower()
        
        # BMO reaction
        bmo_ret = (p_release["close_full_adj"] - p_before["close_full_adj"]) / p_before["close_full_adj"]
        # AMC reaction
        amc_ret = (p_after["close_full_adj"] - p_release["close_full_adj"]) / p_release["close_full_adj"]
        # Standard close-to-close reaction (from before to after)
        before_to_after_ret = (p_after["close_full_adj"] - p_before["close_full_adj"]) / p_before["close_full_adj"]
        
        if "before" in time_lower or "bmo" in time_lower:
            reaction_return = bmo_ret
            reaction_type = "BMO (Release Day Close vs Prev Close)"
        elif "after" in time_lower or "amc" in time_lower:
            reaction_return = amc_ret
            reaction_type = "AMC (Next Day Close vs Release Day Close)"
        else:
            # If report time is unspecified/unclear, we default to AMC since Nvidia typically reports after-hours.
            # However, we will use the standard before-to-after return as a robust metric to avoid release-day volatility.
            # Let's provide before_to_after_ret as the reaction return but mark it.
            reaction_return = before_to_after_ret
            reaction_type = "Unspecified (Next Day Close vs Prev Close)"
            
        row["market_reaction_return_1d"] = reaction_return
        row["market_reaction_type"] = reaction_type
        row["return_close_before_to_after"] = before_to_after_ret
        
        rows.append(row)
        
    df_output = pd.DataFrame(rows)
    
    # Sort chronologically by fiscalDateEnding
    df_output = df_output.sort_values("fiscalDateEnding").reset_index(drop=True)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)
    
    # Write to CSV
    df_output.to_csv(OUTPUT_CSV, index=False)
    print(f"\nSuccess! Saved aligned dataset to {OUTPUT_CSV}")
    print(f"Total Rows: {len(df_output)}")
    print(f"Date Range: {df_output['fiscalDateEnding'].iloc[0]} to {df_output['fiscalDateEnding'].iloc[-1]}")
    
    # Let's check some statistics to print
    valid_financials = df_output[~df_output['totalRevenue'].isna()]
    print(f"Detailed financial statement rows (2006-present): {len(valid_financials)}")
    print(f"Basic EPS/price-only rows (1999-2006): {len(df_output) - len(valid_financials)}")
    
if __name__ == "__main__":
    main()
