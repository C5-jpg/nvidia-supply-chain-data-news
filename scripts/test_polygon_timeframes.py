import requests

massive_key = "Cz8CGc6zpSI2SeNWySlsi2LDIKC16xqI"
symbol = "NVDA"

years = [2025, 2024, 2023, 2021, 2016, 2011, 2006, 2001]

for yr in years:
    start_date = f"{yr}-01-01"
    end_date = f"{yr}-01-10"
    url = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/{start_date}/{end_date}?adjusted=true&limit=10&apiKey={massive_key}"
    try:
        res = requests.get(url).json()
        if "results" in res:
            print(f"Year {yr}: SUCCESS (found {len(res['results'])} bars)")
        else:
            print(f"Year {yr}: FAILED - {res.get('status')} - {res.get('message', '')[:100]}")
    except Exception as e:
        print(f"Year {yr}: ERROR - {e}")
