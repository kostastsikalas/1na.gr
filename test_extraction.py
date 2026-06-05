import pandas as pd
import json
import unicodedata
import re
from difflib import SequenceMatcher

def normalize_for_match(text):
    if not isinstance(text, str): return ""
    # Remove accents
    text = ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    text = text.lower()
    # Remove all non-alphanumeric characters (spaces, punctuation)
    text = re.sub(r'[^a-z0-9α-ω]', '', text)
    return text

def to_title_case(text):
    if not isinstance(text, str): return ""
    # Basic title case, handle Greek
    words = text.split()
    return ' '.join(w.capitalize() for w in words)

# 1. Load Coefficients from Σχολές_ΑΕΙ_Συντελεστές_2026.xlsx
coef_xls = pd.ExcelFile('public/Σχολές_ΑΕΙ_Συντελεστές_2026.xlsx')
coef_gel = pd.read_excel(coef_xls, sheet_name='ΓΕΛ – Σχολές & Συντελεστές')
headers_gel = [str(h).replace('\n', ' ').strip() for h in coef_gel.iloc[1].tolist()]
coef_gel = coef_gel.iloc[2:].copy()
coef_gel.columns = headers_gel

coef_map = {}
for _, row in coef_gel.iterrows():
    inst = str(row.get('Ίδρυμα', '')).strip()
    dept = str(row.get('Τμήμα / Σχολή', '')).strip()
    if not inst and not dept: continue
    
    # Extract coefficients
    def get_pct(col):
        v = row.get(col)
        try: return float(v)/100 if pd.notna(v) and v != '-' and v != '' else None
        except: return None
        
    lang = get_pct('Ν.Γλώσσα & Λογοτ. %')
    arch = get_pct('Αρχαία Ελλην. %')
    hist = get_pct('Ιστορία %')
    lat  = get_pct('Λατιν. %')
    math = get_pct('Μαθημ. %')
    phys = get_pct('Φυσική %')
    chem = get_pct('Χημεία %')
    bio  = get_pct('Βιολογία %')
    spec = get_pct('Ειδικό Μάθημα %')
    
    key = normalize_for_match(dept) + normalize_for_match(inst)
    coef_map[key] = {
        'lang': lang, 'arch': arch, 'hist': hist, 'lat': lat,
        'math': math, 'phys': phys, 'chem': chem, 'bio': bio,
        'spec': spec
    }

# Load EPAL coefs
coef_epal = pd.read_excel(coef_xls, sheet_name='ΕΠΑΛ – Σχολές & Συντελεστές')
headers_epal = [str(h).replace('\n', ' ').strip() for h in coef_epal.iloc[1].tolist()]
coef_epal = coef_epal.iloc[2:].copy()
coef_epal.columns = headers_epal
coef_epal['Τομέας ΕΠΑΛ'] = coef_epal['Τομέας ΕΠΑΛ'].ffill()

epal_coef_map = {}
for _, row in coef_epal.iterrows():
    inst = str(row.get('Ίδρυμα', '')).strip()
    dept = str(row.get('Τμήμα / Σχολή', '')).strip()
    if not inst and not dept: continue
    
    lang = row.get('Νεοελλην. Γλώσσα %')
    math = row.get('Μαθ/κά %')
    spec = row.get('Μάθημα Ειδικότητας %')
    
    try: lang = float(lang)/100 if pd.notna(lang) else 0.2
    except: lang = 0.2
    try: math = float(math)/100 if pd.notna(math) else 0.2
    except: math = 0.2
    try: spec = float(spec)/100 if pd.notna(spec) else 0.6
    except: spec = 0.6
    
    key = normalize_for_match(dept) + normalize_for_match(inst)
    epal_coef_map[key] = [lang, math, spec/2, spec/2]

print(f"Loaded {len(coef_map)} GEL coefs and {len(epal_coef_map)} EPAL coefs.")

# 2. Extract from Ministry Files
FIELD_MAP = {
    '1': 'Ανθρωπιστικών Σπουδών',
    '2': 'Θετικών Σπουδών',
    '3': 'Σπουδών Υγείας',
    '4': 'Σπουδών Οικονομίας & Πληροφορικής'
}

all_data = []

# GEL
gel_df = pd.read_excel('public/gel-2025.xls', header=None)
gel_gen = gel_df.iloc[3:][gel_df.iloc[3:][3] == 'ΓΕΛ ΓΕΝΙΚΗ ΣΕΙΡΑ ΗΜ.']

gel_matched = 0
for _, row in gel_gen.iterrows():
    name = str(row[2]).strip() if pd.notna(row[2]) else ''
    inst = str(row[1]).strip() if pd.notna(row[1]) else ''
    fields_str = str(row[4]).strip() if pd.notna(row[4]) else ''
    base = row[12]
    
    if not name: continue
    try: base_val = float(base) if pd.notna(base) else 0
    except: base_val = 0
    
    fields = [f.strip() for f in fields_str.split('/') if f.strip() in FIELD_MAP]
    if not fields: continue
    
    key = normalize_for_match(name) + normalize_for_match(inst)
    
    # Fuzzy match if exact fails
    best_coef = None
    if key in coef_map:
        best_coef = coef_map[key]
        gel_matched += 1
    else:
        # Try finding highest ratio
        best_ratio = 0
        best_k = None
        for k, v in coef_map.items():
            ratio = SequenceMatcher(None, key, k).ratio()
            if ratio > 0.85 and ratio > best_ratio:
                best_ratio = ratio
                best_k = k
        if best_k:
            best_coef = coef_map[best_k]
            gel_matched += 1
            
    # Assign coefficients based on field
    for f in fields:
        field_name = FIELD_MAP[f]
        if not best_coef:
            coeffs = [0.25, 0.25, 0.25, 0.25]
            spec_pct = None
        else:
            lang = best_coef['lang']
            arch = best_coef['arch']
            hist = best_coef['hist']
            lat  = best_coef['lat']
            math = best_coef['math']
            phys = best_coef['phys']
            chem = best_coef['chem']
            bio  = best_coef['bio']
            spec = best_coef['spec']
            
            if f == '1':
                coeffs = [lang or 0.25, arch or 0.25, hist or 0.25, lat or 0.25]
            elif f == '2':
                gl = lang if lang is not None else (bio if bio is not None else 0.25)
                coeffs = [gl, math or 0.25, phys or 0.25, chem or 0.25]
            elif f == '3':
                gl = lang if lang is not None else (math if math is not None else 0.25)
                coeffs = [gl, phys or 0.25, chem or 0.25, bio or 0.25]
            elif f == '4':
                gl = lang if lang is not None else (bio if bio is not None else 0.25)
                coeffs = [gl, math or 0.25, phys or 0.25, chem or 0.25]
            
            spec_pct = round(spec * 100) if spec else None
            
        entry = {
            'name': to_title_case(name),
            'institution': inst,
            'city': "",
            'field': field_name,
            'coefficients': [round(c, 4) for c in coeffs],
            'base2025': base_val,
        }
        if best_coef and spec_pct:
            entry['specialSubjectPct'] = spec_pct
        all_data.append(entry)

print(f"GEL Matched: {gel_matched} / {len(gel_gen)}")

# EPAL
epal_df = pd.read_excel('public/epal-2025.xls', header=None)
epal_gen = epal_df.iloc[3:][epal_df.iloc[3:][3] == 'ΕΠΑΛ ΓΕΝΙΚΗ ΣΕΙΡΑ ΗΜ.']

epal_matched = 0
for _, row in epal_gen.iterrows():
    name = str(row[2]).strip() if pd.notna(row[2]) else ''
    inst = str(row[1]).strip() if pd.notna(row[1]) else ''
    base = row[11]
    
    if not name: continue
    try: base_val = float(base) if pd.notna(base) else 0
    except: base_val = 0
    
    key = normalize_for_match(name) + normalize_for_match(inst)
    coeffs = [0.2, 0.2, 0.3, 0.3]
    
    if key in epal_coef_map:
        coeffs = epal_coef_map[key]
        epal_matched += 1
    else:
        best_ratio = 0
        best_k = None
        for k, v in epal_coef_map.items():
            ratio = SequenceMatcher(None, key, k).ratio()
            if ratio > 0.85 and ratio > best_ratio:
                best_ratio = ratio
                best_k = k
        if best_k:
            coeffs = epal_coef_map[best_k]
            epal_matched += 1
            
    all_data.append({
        'name': to_title_case(name) + (f" ({inst})" if inst else ""),
        'institution': "",
        'city': "",
        'field': "ΕΠΑΛ",
        'coefficients': [round(c, 4) for c in coeffs],
        'base2025': base_val,
    })

print(f"EPAL Matched: {epal_matched} / {len(epal_gen)}")

unique_data = []
seen = set()
for d in all_data:
    k = (d['name'], d['institution'], d['field'])
    if k not in seen:
        seen.add(k)
        unique_data.append(d)

print(f"Total unique records generated: {len(unique_data)}")

# Count by field
from collections import Counter
fields = Counter(d['field'] for d in unique_data)
for f, cnt in fields.items():
    print(f"  {f}: {cnt}")
