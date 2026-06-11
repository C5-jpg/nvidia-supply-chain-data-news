import requests
import json
import time

av_key = "0AMY3A4QYZPV6DAB"
finnhub_key = "d87i1bhr01qmhakfsurgd87i1bhr01qmhakfsus0"
massive_key = "Cz8CGc6zpSI2SeNWySlsi2LDIKC16xqI"
symbol = "NVDA"

# 1. Test Alpha Vantage TIME_SERIES_DAILY
print("--- Alpha Vantage TIME_SERIES_DAILY ---")
url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&outputsize=full&apikey={av_key}"
try:
    res = requests.get(url).json()
    if "Time Series (Daily)" in res:
        ts = res["Time Series (Daily)"]
        dates = sorted(ts.keys())
        print(f"Success! Count: {len(dates)}")
        print(f"Range: {dates[0]} to {dates[-1]}")
    else:
        print("Failed:", str(res)[:500])
except Exception as e:
    print("Error:", e)

# 2. Test Alpha Vantage TIME_SERIES_WEEKLY
print("\n--- Alpha Vantage TIME_SERIES_WEEKLY ---")
url = f"https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol={symbol}&apikey={av_key}"
try:
    res = requests.get(url).json()
    if "Weekly Time Series" in res:
        ts = res["Weekly Time Series"]
        dates = sorted(ts.keys())
        print(f"Success! Count: {len(dates)}")
        print(f"Range: {dates[0]} to {dates[-1]}")
    else:
        print("Failed:", str(res)[:500])
except Exception as e:
    print("Error:", e)

# 3. Test Finnhub candles since 1999
print("\n--- Finnhub Stock Candles since 1999 ---")
# 1999-01-01 is 915148800
# 2026-06-12 is 1781222400
from_timestamp = 915148800
to_timestamp = 1781222400
url = f"https://finnhub.io/api/v1/stock/candle?symbol={symbol}&resolution=D&from={from_timestamp}&to={to_timestamp}&token={finnhub_key}"
try:
    res = requests.get(url).json()
    if res.get("s") == "ok":
        print(f"Success! Count of prices: {len(res['c'])}")
        # Let's print the first and last date
        first_t = res['t'][0]
        last_t = res['t'][-1]
        print(f"First timestamp: {first_t} -> {time.strftime('%Y-%m-%d', time.gmtime(first_t))}")
        print(f"Last timestamp: {last_t} -> {time.strftime('%Y-%m-%d', time.gmtime(last_t))}")
        print(f"First close: {res['c'][0]}, Last close: {res['c'][-1]}")
    else:
        print("Failed:", str(res)[:500])
except Exception as e:
    print("Error:", e)

# 4. Test Polygon aggs for recent dates (e.g. 2024-01-01 to 2026-01-01)
print("\n--- Polygon aggs (2024-01-01 to 2026-01-01) ---")
url = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/2024-01-01/2026-01-01?adjusted=true&limit=1000&apiKey={massive_key}"
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
