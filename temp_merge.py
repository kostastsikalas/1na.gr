import pandas as pd
import json
import unicodedata
import re

def normalize_text(text):
    if not isinstance(text, str):
        return ""
    # Strip accents
    text = ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    text = text.upper().strip()
    # Remove extra spaces
    text = re.sub(r'\s+', ' ', text)
    return text

FIELD_MAP = {
    '1': 'Ανθρωπιστικών Σπουδών',
    '2': 'Θετικών Σπουδών',
    '3': 'Σπουδών Υγείας',
    '4': 'Σπουδών Οικονομίας & Πληροφορικής'
}

# 1. Read Ministry GEL
gel = pd.read_excel('public/gel-2025.xls', header=None)
gel_gen = gel.iloc[3:][gel.iloc[3:][3] == 'ΓΕΛ ΓΕΝΙΚΗ ΣΕΙΡΑ ΗΜ.']

min_schools = []
for _, row in gel_gen.iterrows():
    inst = str(row[1]).strip() if pd.notna(row[1]) else ''
    name = str(row[2]).strip() if pd.notna(row[2]) else ''
    fields_str = str(row[4]).strip() if pd.notna(row[4]) else ''
    base = row[12]
    
    if not name: continue
    try: base_val = float(base) if pd.notna(base) else 0
    except: base_val = 0
    
    fields = [f.strip() for f in fields_str.split('/') if f.strip() in FIELD_MAP]
    for f in fields:
        min_schools.append({
            'name': name,
            'institution': inst,
            'field': FIELD_MAP[f],
            'base2025': base_val,
            'norm_name': normalize_text(name),
            'norm_inst': normalize_text(inst)
        })

# 2. Read Coefs GEL
coef_xls = pd.ExcelFile('public/Σχολές_ΑΕΙ_Συντελεστές_2026.xlsx')
coef_df = pd.read_excel(coef_xls, sheet_name='ΓΕΛ – Σχολές & Συντελεστές')
headers = [str(h).replace('\n', ' ').strip() for h in coef_df.iloc[1].tolist()]
data_coef = coef_df.iloc[2:].copy()
data_coef.columns = headers

def get_pct(row, col_name):
    val = row.get(col_name)
    if pd.isna(val) or val == '-' or val == '': return None
    try: return float(val) / 100
    except: return None

coef_map = {}
for _, row in data_coef.iterrows():
    inst = row.get('Ίδρυμα')
    dept = row.get('Τμήμα / Σχολή')
    field_raw = row.get('Πεδίο')
    if pd.isna(inst) and pd.isna(dept): continue
    
    inst = str(inst).strip() if pd.notna(inst) else ""
    dept = str(dept).strip() if pd.notna(dept) else ""
    
    # Extract coeffs exactly like in extract_excel_v2.py
    # ... logic simplified to just see if we can match
    norm_name = normalize_text(dept)
    norm_inst = normalize_text(inst)
    
    # Store by normalized name/inst
    key = f"{norm_name}-{norm_inst}"
    coef_map[key] = row.to_dict()

# Merge
matched = 0
not_matched = []
for s in min_schools:
    key = f"{s['norm_name']}-{s['norm_inst']}"
    if key in coef_map:
        matched += 1
    else:
        # Try matching just the name
        found = False
        for k in coef_map:
            if s['norm_name'] in k or k.split('-')[0] in s['norm_name']:
                found = True
                matched += 1
                break
        if not found:
            not_matched.append(f"{s['institution']} - {s['name']}")

print(f"Total Ministry entries: {len(min_schools)}")
print(f"Matched with Coefs: {matched}")
print(f"Not matched: {len(not_matched)}")
print("Some not matched:", not_matched[:10])

