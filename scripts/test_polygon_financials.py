import requests
import json

massive_key = "Cz8CGc6zpSI2SeNWySlsi2LDIKC16xqI"
symbol = "NVDA"

# 1. Test daily stock prices from 1999 to 2000
print("--- Polygon aggs (1999-01-01 to 2000-01-01) ---")
url = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/1999-01-01/2000-01-01?adjusted=true&limit=1000&apiKey={massive_key}"
try:
    res = requests.get(url).json()
    if "results" in res:
        results = res["results"]
        print(f"Success! Count: {len(results)}")
        print("First bar:", results[0])
        print("Last bar:", results[-1])
    else:
        print("Failed:", str(res)[:500])
except Exception as e:
    print("Error:", e)

# 2. Test financials endpoint
print("\n--- Polygon Financials ---")
url = f"https://api.polygon.io/vX/reference/financials?ticker={symbol}&limit=10&apiKey={massive_key}"
try:
    res = requests.get(url).json()
    if "results" in res:
        results = res["results"]
        print(f"Success! Count: {len(results)}")
        print("First financial report period_of_report_date:", results[0].get("period_of_report_date"))
        print("First report keys:", list(results[0].keys()))
        print("First report financial statement keys:", list(results[0].get("financials", {}).keys()))
    else:
        print("Failed:", str(res)[:500])
except Exception as e:
    print("Error:", e)
