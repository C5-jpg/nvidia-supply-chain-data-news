import requests
import json

av_key = "0AMY3A4QYZPV6DAB"
symbol = "NVDA"

# Test BALANCE_SHEET
print("--- Testing BALANCE_SHEET ---")
url = f"https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol={symbol}&apikey={av_key}"
try:
    response = requests.get(url)
    data = response.json()
    if "quarterlyReports" in data:
        reports = data["quarterlyReports"]
        print(f"Success! Count: {len(reports)}")
        print("Earliest:", reports[-1]["fiscalDateEnding"])
        print("Latest:", reports[0]["fiscalDateEnding"])
        print("Sample keys:", reports[0].keys())
    else:
        print("Failed:")
        print(json.dumps(data, indent=2)[:500])
except Exception as e:
    print("Error:", e)

# Test CASH_FLOW
print("\n--- Testing CASH_FLOW ---")
url = f"https://www.alphavantage.co/query?function=CASH_FLOW&symbol={symbol}&apikey={av_key}"
try:
    response = requests.get(url)
    data = response.json()
    if "quarterlyReports" in data:
        reports = data["quarterlyReports"]
        print(f"Success! Count: {len(reports)}")
        print("Earliest:", reports[-1]["fiscalDateEnding"])
        print("Latest:", reports[0]["fiscalDateEnding"])
        print("Sample keys:", reports[0].keys())
    else:
        print("Failed:")
        print(json.dumps(data, indent=2)[:500])
except Exception as e:
    print("Error:", e)
