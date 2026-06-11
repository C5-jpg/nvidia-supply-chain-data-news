import requests
import json

av_key = "0AMY3A4QYZPV6DAB"
massive_key = "Cz8CGc6zpSI2SeNWySlsi2LDIKC16xqI"
symbol = "NVDA"

# 1. Test Alpha Vantage Daily Adjusted
print("--- Alpha Vantage TIME_SERIES_DAILY_ADJUSTED ---")
url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={symbol}&outputsize=full&apikey={av_key}"
try:
    res = requests.get(url).json()
    if "Time Series (Daily)" in res:
        ts = res["Time Series (Daily)"]
        dates = sorted(ts.keys())
        print(f"Success! Count: {len(dates)}")
        print(f"Range: {dates[0]} to {dates[-1]}")
        print(f"Sample bar ({dates[0]}): {ts[dates[0]]}")
    else:
        print("Failed:", str(res)[:500])
except Exception as e:
    print("Error:", e)

# 2. Test Polygon Financials Pagination & Date Range
print("\n--- Polygon Financials Pagination ---")
url = f"https://api.polygon.io/vX/reference/financials?ticker={symbol}&limit=100&apiKey={massive_key}"
try:
    res = requests.get(url).json()
    if "results" in res:
        results = res["results"]
        print(f"Success! Count: {len(results)}")
        # Let's see the oldest report in this batch
        oldest = results[-1]
        newest = results[0]
        print(f"Newest report: year={newest.get('fiscal_year')}, period={newest.get('fiscal_period')}, start={newest.get('start_date')}, end={newest.get('end_date')}")
        print(f"Oldest report: year={oldest.get('fiscal_year')}, period={oldest.get('fiscal_period')}, start={oldest.get('start_date')}, end={oldest.get('end_date')}")
        if "next_url" in res:
            print("Next URL for next page exists:", res["next_url"])
    else:
        print("Failed:", str(res)[:500])
except Exception as e:
    print("Error:", e)
