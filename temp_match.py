import pandas as pd
import unicodedata
import re
from difflib import SequenceMatcher

def normalize_text(text):
    if not isinstance(text, str):
        return ""
    text = ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    text = text.upper().strip()
    # Remove common words that might differ
    text = re.sub(r'\(.*?\)', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# 1. Ministry GEL
gel = pd.read_excel('public/gel-2025.xls', header=None)
gel_gen = gel.iloc[3:][gel.iloc[3:][3] == 'ΓΕΛ ΓΕΝΙΚΗ ΣΕΙΡΑ ΗΜ.']
min_names = list(set(gel_gen[2].dropna().tolist()))
min_norm = {normalize_text(n): n for n in min_names}

# 2. Coefs GEL
coef_xls = pd.ExcelFile('public/Σχολές_ΑΕΙ_Συντελεστές_2026.xlsx')
coef_df = pd.read_excel(coef_xls, sheet_name='ΓΕΛ – Σχολές & Συντελεστές')
coef_names = list(set(coef_df.iloc[2:]['Unnamed: 2'].dropna().tolist()))
coef_norm = {normalize_text(n): n for n in coef_names}

matched = 0
for cn, orig_c in coef_norm.items():
    if cn in min_norm:
        matched += 1
    else:
        # try fuzzy match
        best_ratio = 0
        best_match = None
        for mn in min_norm:
            ratio = SequenceMatcher(None, cn, mn).ratio()
            if ratio > best_ratio:
                best_ratio = ratio
                best_match = mn
        if best_ratio > 0.85:
            matched += 1
        # else:
        #     print(f"No match for: {orig_c} (norm: {cn}) -> Best: {best_match} ({best_ratio:.2f})")

print(f"Coefs schools: {len(coef_names)}")
print(f"Matched: {matched}")

