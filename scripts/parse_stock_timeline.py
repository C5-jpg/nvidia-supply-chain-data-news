import pandas as pd
import numpy as np
import json
import os

CSV_PATH = "data/raw/nvda_earnings_stock_history.csv"
JSON_PATH = "public/data/nvda_stock_timeline.json"

def main():
    if not os.path.exists(CSV_PATH):
        print(f"Error: {CSV_PATH} does not exist.")
        return

    df = pd.read_csv(CSV_PATH)
    print(f"Auditing stock CSV. Rows: {len(df)}")
    
    # Sort chronologically
    df = df.sort_values("fiscalDateEnding").reset_index(drop=True)
    
    # Replace NaN with None (which translates to null in JSON)
    df_clean = df.replace({np.nan: None})
    
    timeline_data = []
    for _, row in df_clean.iterrows():
        entry = {
            "fiscalDateEnding": row["fiscalDateEnding"],
            "fiscalYear": int(row["fiscalYear"]) if row["fiscalYear"] is not None else None,
            "fiscalQuarter": row["fiscalQuarter"],
            "reportedDate": row["reportedDate"],
            "reportTime": row["reportTime"],
            "reportedEPS": row["reportedEPS"],
            "estimatedEPS": row["estimatedEPS"],
            "surprisePercentage": row["surprisePercentage"],
            "totalRevenue": row["totalRevenue"],
            "operatingCashflow": row["operatingCashflow"],
            "freeCashFlow": row["freeCashFlow"],
            # Prices on release
            "close_unadj": row["close_unadj_release"],
            "close_split_adj": row["close_split_adj_release"],
            "close_full_adj": row["close_full_adj_release"],
            # Market reactions
            "market_reaction_return_1d": row["market_reaction_return_1d"],
            "market_reaction_type": row["market_reaction_type"],
            "return_close_before_to_after": row["return_close_before_to_after"]
        }
        timeline_data.append(entry)
        
    os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(timeline_data, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully generated {JSON_PATH} with {len(timeline_data)} entries.")

if __name__ == "__main__":
    main()
