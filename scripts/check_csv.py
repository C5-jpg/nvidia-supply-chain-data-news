import pandas as pd

df = pd.read_csv("data/nvda_earnings_stock_history.csv")
print("CSV Columns:")
print(df.columns.tolist())
print(f"\nShape: {df.shape}")

print("\nEarliest 3 rows:")
print(df[["fiscalDateEnding", "reportedDate", "reportedEPS", "close_unadj_release", "close_split_adj_release", "close_full_adj_release", "market_reaction_return_1d"]].head(3))

print("\nLatest 3 rows:")
print(df[["fiscalDateEnding", "reportedDate", "reportedEPS", "close_unadj_release", "close_split_adj_release", "close_full_adj_release", "market_reaction_return_1d"]].tail(3))

print("\nFinancial statement sample (2006, 2025):")
print(df[df["fiscalDateEnding"].isin(["2006-04-30", "2025-04-27"])][["fiscalDateEnding", "totalRevenue", "grossProfit", "netIncome", "operatingCashflow", "freeCashFlow"]])

print("\nChecking for any nulls in earnings fields:")
print(df[["fiscalDateEnding", "reportedDate", "reportedEPS", "close_unadj_release"]].isnull().sum())
