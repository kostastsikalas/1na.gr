import pandas as pd
import json
import unicodedata
import re
from difflib import SequenceMatcher

def normalize_for_match(text):
    if not isinstance(text, str): return ""
    text = ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    text = text.lower()
    text = re.sub(r'[^a-z0-9α-ω]', '', text)
    return text

def main():
    print("Loading coefficients from Σχολές_ΑΕΙ_Συντελεστές_2026.xlsx...")
    coef_xls = pd.ExcelFile('public/Σχολές_ΑΕΙ_Συντελεστές_2026.xlsx')
    
    # GEL Coefs
    coef_gel = pd.read_excel(coef_xls, sheet_name='ΓΕΛ – Σχολές & Συντελεστές')
    headers_gel = [str(h).replace('\n', ' ').strip() for h in coef_gel.iloc[1].tolist()]
    coef_gel = coef_gel.iloc[2:].copy()
    coef_gel.columns = headers_gel

    coef_map = {}
    for _, row in coef_gel.iterrows():
        inst = str(row.get('Ίδρυμα', '')).strip()
        dept = str(row.get('Τμήμα / Σχολή', '')).strip()
        if not inst and not dept: continue
        if str(inst) == 'nan': inst = ''
        if str(dept) == 'nan': dept = ''
        
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
            'nice_name': dept,
            'nice_inst': inst,
            'lang': lang, 'arch': arch, 'hist': hist, 'lat': lat,
            'math': math, 'phys': phys, 'chem': chem, 'bio': bio,
            'spec': spec
        }

    # EPAL Coefs
    coef_epal = pd.read_excel(coef_xls, sheet_name='ΕΠΑΛ – Σχολές & Συντελεστές')
    headers_epal = [str(h).replace('\n', ' ').strip() for h in coef_epal.iloc[1].tolist()]
    coef_epal = coef_epal.iloc[2:].copy()
    coef_epal.columns = headers_epal
    coef_epal['Τομέας ΕΠΑΛ'] = coef_epal['Τομέας ΕΠΑΛ'].ffill()

    epal_coef_map = {}
    for _, row in coef_epal.iterrows():
        inst = str(row.get('Ίδρυμα', '')).strip()
        dept = str(row.get('Τμήμα / Σχολή', '')).strip()
        sector = str(row.get('Τομέας ΕΠΑΛ', '')).strip()
        if not inst and not dept: continue
        if str(inst) == 'nan': inst = ''
        if str(dept) == 'nan': dept = ''
        
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
        epal_coef_map[key] = {
            'nice_name': f"{dept} ({inst})" if inst else dept,
            'nice_inst': sector,
            'coeffs': [lang, math, spec/2, spec/2]
        }

    FIELD_MAP = {
        '1': 'Ανθρωπιστικών Σπουδών',
        '2': 'Θετικών Σπουδών',
        '3': 'Σπουδών Υγείας',
        '4': 'Σπουδών Οικονομίας & Πληροφορικής'
    }

    all_data = []

    # GEL
    print("Processing Ministry GEL files...")
    gel_df = pd.read_excel('public/gel-2025.xls', header=None)
    gel_gen = gel_df.iloc[3:][gel_df.iloc[3:][3] == 'ΓΕΛ ΓΕΝΙΚΗ ΣΕΙΡΑ ΗΜ.']

    for _, row in gel_gen.iterrows():
        name = str(row[2]).strip() if pd.notna(row[2]) else ''
        inst = str(row[1]).strip() if pd.notna(row[1]) else ''
        fields_str = str(row[4]).strip() if pd.notna(row[4]) else ''
        base = row[12]
        
        if not name: continue
        if str(inst) == 'nan': inst = ''
        try: base_val = float(base) if pd.notna(base) else 0
        except: base_val = 0
        
        fields = [f.strip() for f in fields_str.split('/') if f.strip() in FIELD_MAP]
        if not fields: continue
        
        key = normalize_for_match(name) + normalize_for_match(inst)
        
        best_coef = None
        if key in coef_map:
            best_coef = coef_map[key]
        else:
            best_ratio = 0
            best_k = None
            for k, v in coef_map.items():
                ratio = SequenceMatcher(None, key, k).ratio()
                if ratio > 0.85 and ratio > best_ratio:
                    best_ratio = ratio
                    best_k = k
            if best_k:
                best_coef = coef_map[best_k]
                
        # Assign coefficients based on field
        for f in fields:
            field_name = FIELD_MAP[f]
            if not best_coef:
                coeffs = [0.25, 0.25, 0.25, 0.25]
                spec_pct = None
                final_name = name
                final_inst = inst
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
                    coeffs = [lang if lang is not None else 0.25, arch if arch is not None else 0.25, hist if hist is not None else 0.25, lat if lat is not None else 0.25]
                elif f == '2':
                    gl = lang if lang is not None else (bio if bio is not None else 0.25)
                    coeffs = [gl, math if math is not None else 0.25, phys if phys is not None else 0.25, chem if chem is not None else 0.25]
                elif f == '3':
                    gl = lang if lang is not None else (math if math is not None else 0.25)
                    coeffs = [gl, phys if phys is not None else 0.25, chem if chem is not None else 0.25, bio if bio is not None else 0.25]
                elif f == '4':
                    gl = lang if lang is not None else (bio if bio is not None else 0.25)
                    coeffs = [gl, math if math is not None else 0.25, phys if phys is not None else 0.25, chem if chem is not None else 0.25]
                
                spec_pct = round(spec * 100) if spec else None
                final_name = best_coef['nice_name']
                final_inst = best_coef['nice_inst']
                
            entry = {
                'name': final_name,
                'institution': final_inst,
                'city': "",
                'field': field_name,
                'coefficients': [round(c, 4) for c in coeffs],
                'base2025': base_val,
            }
            if best_coef and spec_pct:
                entry['specialSubjectPct'] = spec_pct
            all_data.append(entry)

    # EPAL
    print("Processing Ministry EPAL files...")
    epal_df = pd.read_excel('public/epal-2025.xls', header=None)
    epal_gen = epal_df.iloc[3:][epal_df.iloc[3:][3] == 'ΕΠΑΛ ΓΕΝΙΚΗ ΣΕΙΡΑ ΗΜ.']

    for _, row in epal_gen.iterrows():
        name = str(row[2]).strip() if pd.notna(row[2]) else ''
        inst = str(row[1]).strip() if pd.notna(row[1]) else ''
        base = row[11]
        
        if not name: continue
        if str(inst) == 'nan': inst = ''
        try: base_val = float(base) if pd.notna(base) else 0
        except: base_val = 0
        
        key = normalize_for_match(name) + normalize_for_match(inst)
        
        if key in epal_coef_map:
            best_coef = epal_coef_map[key]
        else:
            best_ratio = 0
            best_k = None
            for k, v in epal_coef_map.items():
                ratio = SequenceMatcher(None, key, k).ratio()
                if ratio > 0.85 and ratio > best_ratio:
                    best_ratio = ratio
                    best_k = k
            best_coef = epal_coef_map.get(best_k) if best_k else None
                
        if best_coef:
            final_name = best_coef['nice_name']
            final_inst = best_coef['nice_inst']
            coeffs = best_coef['coeffs']
        else:
            final_name = f"{name} ({inst})" if inst else name
            final_inst = ""
            coeffs = [0.2, 0.2, 0.3, 0.3]
            
        all_data.append({
            'name': final_name,
            'institution': final_inst,
            'city': "",
            'field': "ΕΠΑΛ",
            'coefficients': [round(c, 4) for c in coeffs],
            'base2025': base_val,
        })

    # Remove duplicates
    unique_data = []
    seen = set()
    for d in all_data:
        k = (d['name'], d['institution'], d['field'])
        if k not in seen:
            seen.add(k)
            unique_data.append(d)

    with open('public/calculator_bases.json', 'w', encoding='utf-8') as f:
        json.dump(unique_data, f, ensure_ascii=False, indent=2)
        
    print(f"Extracted {len(unique_data)} unique records to public/calculator_bases.json")
    
    generate_ts(unique_data)

def generate_ts(data):
    lines = []
    lines.append('/**')
    lines.append(' * Δεδομένα Σχολών 2026 — Συντελεστές Βαρύτητας & Βάσεις')
    lines.append(' * Πλήρης λίστα από Υπουργείο με coefficients όπου υπάρχουν.')
    lines.append(' */')
    lines.append('')
    lines.append('export type Field =')
    lines.append('  | "Ανθρωπιστικών Σπουδών"')
    lines.append('  | "Θετικών Σπουδών"')
    lines.append('  | "Σπουδών Υγείας"')
    lines.append('  | "Σπουδών Οικονομίας & Πληροφορικής"')
    lines.append('  | "ΕΠΑΛ";')
    lines.append('')
    lines.append('export const fieldSubjects: Record<Field, [string, string, string, string]> = {')
    lines.append('  "Ανθρωπιστικών Σπουδών": [')
    lines.append('    "Νεοελληνική Γλώσσα & Λογοτεχνία",')
    lines.append('    "Αρχαία Ελληνικά",')
    lines.append('    "Ιστορία",')
    lines.append('    "Λατινικά",')
    lines.append('  ],')
    lines.append('')
    lines.append('  "Θετικών Σπουδών": [')
    lines.append('    "Νεοελληνική Γλώσσα & Λογοτεχνία",')
    lines.append('    "Μαθηματικά",')
    lines.append('    "Φυσική",')
    lines.append('    "Χημεία",')
    lines.append('  ],')
    lines.append('  "Σπουδών Υγείας": [')
    lines.append('    "Νεοελληνική Γλώσσα & Λογοτεχνία",')
    lines.append('    "Φυσική",')
    lines.append('    "Χημεία",')
    lines.append('    "Βιολογία",')
    lines.append('  ],')
    lines.append('  "Σπουδών Οικονομίας & Πληροφορικής": [')
    lines.append('    "Νεοελληνική Γλώσσα & Λογοτεχνία",')
    lines.append('    "Μαθηματικά",')
    lines.append('    "Πληροφορική (ΑΕΠΠ)",')
    lines.append('    "Οικονομία (ΑΟΘ)",')
    lines.append('  ],')
    lines.append('  "ΕΠΑΛ": [')
    lines.append('    "Μαθηματικά (Άλγεβρα)",')
    lines.append('    "Νέα Ελληνικά",')
    lines.append('    "Μάθημα Ειδικότητας 1",')
    lines.append('    "Μάθημα Ειδικότητας 2",')
    lines.append('  ],')
    lines.append('};')
    lines.append('')
    lines.append('export type School = {')
    lines.append('  name: string;')
    lines.append('  institution: string;')
    lines.append('  city: string;')
    lines.append('  field: Field;')
    lines.append('  coefficients: [number, number, number, number];')
    lines.append('  base2025: number;')
    lines.append('  specialSubjectPct?: number;')
    lines.append('};')
    lines.append('')
    lines.append('export const schools: School[] = [')
    
    for d in data:
        c = d['coefficients']
        lines.append('  {')
        lines.append(f'    name: {json.dumps(d["name"], ensure_ascii=False)},')
        lines.append(f'    institution: {json.dumps(d["institution"], ensure_ascii=False)},')
        lines.append(f'    city: {json.dumps(d["city"], ensure_ascii=False)},')
        lines.append(f'    field: {json.dumps(d["field"], ensure_ascii=False)},')
        lines.append(f'    coefficients: [{c[0]}, {c[1]}, {c[2]}, {c[3]}],')
        lines.append(f'    base2025: {d["base2025"]},')
        if d.get('specialSubjectPct'):
            lines.append(f'    specialSubjectPct: {d["specialSubjectPct"]},')
        lines.append('  },')
    
    lines.append('];')
    lines.append('')
    lines.append('export function calcPoints(')
    lines.append('  grades: number[],')
    lines.append('  coefficients: [number, number, number, number],')
    lines.append('  specialSubjectGrade?: number,')
    lines.append('  specialSubjectPct?: number,')
    lines.append('): number {')
    lines.append('  // Main 4 subjects contribution')
    lines.append('  const mainSum = grades.reduce((acc, g, i) => acc + g * coefficients[i], 0);')
    lines.append('  let total = mainSum;')
    lines.append('  ')
    lines.append('  // If school has a special subject, add its weighted contribution')
    lines.append('  if (specialSubjectPct && specialSubjectGrade !== undefined) {')
    lines.append('    total += specialSubjectGrade * (specialSubjectPct / 100);')
    lines.append('  }')
    lines.append('  ')
    lines.append('  return Math.round(total * 1000);')
    lines.append('}')
    lines.append('')
    
    ts_content = '\n'.join(lines)
    with open('src/lib/schools2026.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"Generated src/lib/schools2026.ts with {len(data)} schools")

if __name__ == '__main__':
    main()
