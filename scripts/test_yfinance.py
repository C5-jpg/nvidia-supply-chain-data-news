import yfinance as yf

ticker = yf.Ticker("NVDA")
hist = ticker.history(start="1999-01-01", end="2026-06-12")
print("yfinance results count:", len(hist))
print("First row:")
print(hist.iloc[0])
print("Last row:")
print(hist.iloc[-1])
