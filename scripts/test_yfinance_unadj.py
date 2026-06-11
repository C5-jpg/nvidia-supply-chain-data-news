import yfinance as yf

# NVDA had a 4-for-1 split on 2021-07-20
# Let's check prices in June 2021
ticker = yf.Ticker("NVDA")
df = ticker.history(start="2021-06-01", end="2021-06-10", auto_adjust=False)
print("Columns in df:", df.columns)
print(df[["Open", "Close", "Adj Close"]])
