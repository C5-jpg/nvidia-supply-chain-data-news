import yfinance as yf

ticker = yf.Ticker("NVDA")
print(ticker.splits)
