import requests
import json

finnhub_key = "d87i1bhr01qmhakfsurgd87i1bhr01qmhakfsus0"
av_key = "0AMY3A4QYZPV6DAB"
massive_key1 = "Cz8CGc6zpSI2SeNWySlsi2LDIKC16xqI"
massive_key2 = "x3G6UeERq2Hx5Pg7pxBLuwC2HZ_hDlcB"

symbol = "NVDA"

# 1. Test Alpha Vantage INCOME_STATEMENT
print("--- Alpha Vantage INCOME_STATEMENT ---")
url = f"https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol={symbol}&apikey={av_key}"
try:
    res = requests.get(url).json()
    if "quarterlyReports" in res:
        reports = res["quarterlyReports"]
        print(f"AV INCOME_STATEMENT quarterly count: {len(reports)}")
        print(f"Range: {reports[-1]['fiscalDateEnding']} to {reports[0]['fiscalDateEnding']}")
        print(f"Sample keys: {list(reports[0].keys())[:10]}")
    else:
        print("Failed to get INCOME_STATEMENT:", str(res)[:300])
except Exception as e:
    print("Error:", e)

# 2. Test Alpha Vantage EARNINGS
print("\n--- Alpha Vantage EARNINGS ---")
url = f"https://www.alphavantage.co/query?function=EARNINGS&symbol={symbol}&apikey={av_key}"
try:
    res = requests.get(url).json()
    if "quarterlyEarnings" in res:
        earnings = res["quarterlyEarnings"]
        print(f"AV EARNINGS quarterly count: {len(earnings)}")
        print(f"Range: {earnings[-1]['fiscalDateEnding']} to {earnings[0]['fiscalDateEnding']}")
        print(f"Sample keys: {list(earnings[0].keys())}")
    else:
        print("Failed to get EARNINGS:", str(res)[:300])
except Exception as e:
    print("Error:", e)

# 3. Test Finnhub Financials-Reported
print("\n--- Finnhub Financials Reported ---")
url = f"https://finnhub.io/api/v1/stock/financials-reported?symbol={symbol}&token={finnhub_key}"
try:
    res = requests.get(url).json()
    if "data" in res:
        data = res["data"]
        print(f"Finnhub Financials count: {len(data)}")
        if len(data) > 0:
            print(f"Range: {data[-1]['year']}-Q{data[-1]['quarter']} to {data[0]['year']}-Q{data[0]['quarter']}")
            print(f"Sample keys: {list(data[0].keys())}")
    else:
        print("Failed to get Finnhub financials:", str(res)[:300])
except Exception as e:
    print("Error:", e)

# 4. Test Massive/Polygon.io key 1
print("\n--- Massive Key 1 ---")
url1 = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/prev?adjusted=true&apiKey={massive_key1}"
url2 = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/prev?adjusted=true&apiKey={massive_key2}"
try:
    res1 = requests.get(url1).json()
    print("Key 1 res:", str(res1)[:300])
except Exception as e:
    print("Key 1 error:", e)

try:
    res2 = requests.get(url2).json()
    print("Key 2 res:", str(res2)[:300])
except Exception as e:
    print("Key 2 error:", e)
