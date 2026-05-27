import pandas as pd
import json

def clean_col_name(col):
    if isinstance(col, str):
        return col.replace('\n', ' ').strip()
    return col

def main():
    file_path = 'public/Σχολές_ΑΕΙ_Συντελεστές_2026.xlsx'
    xls = pd.ExcelFile(file_path)
    all_data = []

    # --- GEL ---
    df = pd.read_excel(xls, sheet_name='ΓΕΛ – Σχολές & Συντελεστές')
    headers = [clean_col_name(h) for h in df.iloc[1].tolist()]
    data_df = df.iloc[2:].copy()
    data_df.columns = headers
    
    field_map = {
        'Πεδίο 1': 'Ανθρωπιστικών Σπουδών',
        'Πεδίο 2': 'Θετικών Σπουδών',
        'Πεδίο 3': 'Σπουδών Υγείας',
        'Πεδίο 4': 'Σπουδών Οικονομίας & Πληροφορικής'
    }

    # Excel column mapping:
    # Πεδίο 1: Ν.Γλώσσα, Αρχαία, Ιστορία, Λατινικά  (cols 4-7)
    # Πεδίο 2: Μαθημ, Φυσική, Χημεία, Βιολογία       (cols 8-11)
    # Πεδίο 3: Μαθημ(→Γλώσσα), Φυσική, Χημεία, Βιολογία (cols 8-11)
    # Πεδίο 4: Μαθημ, Φυσική(→Πληρ), Χημεία(→Οικον), Βιολογία(→Γλώσσα) (cols 8-11)
    
    # UI subject order per field:
    # Πεδίο 1 UI: [Ν.Γλώσσα, Αρχαία, Ιστορία, Λατινικά]
    # Πεδίο 2 UI: [Ν.Γλώσσα, Μαθηματικά, Φυσική, Χημεία]
    # Πεδίο 3 UI: [Ν.Γλώσσα, Φυσική, Χημεία, Βιολογία]
    # Πεδίο 4 UI: [Ν.Γλώσσα, Μαθηματικά, Πληροφορική, Οικονομία]

    for _, row in data_df.iterrows():
        inst = row.get('Ίδρυμα')
        dept = row.get('Τμήμα / Σχολή')
        field_raw = row.get('Πεδίο')
        
        if pd.isna(inst) and pd.isna(dept):
            continue
            
        inst = str(inst).strip() if pd.notna(inst) else ""
        dept = str(dept).strip() if pd.notna(dept) else ""
        field = field_map.get(field_raw)
        
        if not field:
            continue

        def get_pct(col_name):
            """Get percentage value from column, return None if missing."""
            val = row.get(col_name)
            if pd.isna(val) or val == '-' or val == '':
                return None
            try:
                return float(val) / 100
            except (ValueError, TypeError):
                return None

        # Get all raw coefficients from Excel
        lang_pct = get_pct('Ν.Γλώσσα & Λογοτ. %')
        arch_pct = get_pct('Αρχαία Ελλην. %')
        hist_pct = get_pct('Ιστορία %')
        lat_pct  = get_pct('Λατιν. %')
        math_pct = get_pct('Μαθημ. %')
        phys_pct = get_pct('Φυσική %')
        chem_pct = get_pct('Χημεία %')
        bio_pct  = get_pct('Βιολογία %')
        spec_pct = get_pct('Ειδικό Μάθημα %')

        # Map coefficients to UI order based on field
        if field_raw == 'Πεδίο 1':
            # UI: [Ν.Γλώσσα, Αρχαία, Ιστορία, Λατινικά]
            coeffs = [
                lang_pct if lang_pct is not None else 0.25,
                arch_pct if arch_pct is not None else 0.25,
                hist_pct if hist_pct is not None else 0.25,
                lat_pct  if lat_pct  is not None else 0.25,
            ]
        elif field_raw == 'Πεδίο 2':
            # Excel has: Μαθημ, Φυσική, Χημεία, (Ν.Γλώσσα in Βιολογία col sometimes)
            # UI: [Ν.Γλώσσα, Μαθηματικά, Φυσική, Χημεία]
            # In the Excel, for Πεδίο 2 the Ν.Γλώσσα is stored as the 4th coefficient
            # which maps to the "Βιολογία" column
            gl = lang_pct if lang_pct is not None else (bio_pct if bio_pct is not None else 0.25)
            coeffs = [
                gl,
                math_pct if math_pct is not None else 0.25,
                phys_pct if phys_pct is not None else 0.25,
                chem_pct if chem_pct is not None else 0.25,
            ]
        elif field_raw == 'Πεδίο 3':
            # Excel has: (Ν.Γλώσσα in Μαθημ col), Φυσική, Χημεία, Βιολογία
            # UI: [Ν.Γλώσσα, Φυσική, Χημεία, Βιολογία]
            gl = lang_pct if lang_pct is not None else (math_pct if math_pct is not None else 0.25)
            coeffs = [
                gl,
                phys_pct if phys_pct is not None else 0.25,
                chem_pct if chem_pct is not None else 0.25,
                bio_pct  if bio_pct  is not None else 0.25,
            ]
        elif field_raw == 'Πεδίο 4':
            # Excel has: Μαθημ, Φυσική(→Πληρ), Χημεία(→Οικ), Βιολογία(→Γλώσσα)
            # UI: [Ν.Γλώσσα, Μαθηματικά, Πληροφορική, Οικονομία]
            gl = lang_pct if lang_pct is not None else (bio_pct if bio_pct is not None else 0.25)
            coeffs = [
                gl,
                math_pct if math_pct is not None else 0.25,
                phys_pct if phys_pct is not None else 0.25,  # Πληροφορική
                chem_pct if chem_pct is not None else 0.25,  # Οικονομία
            ]
        else:
            coeffs = [0.25, 0.25, 0.25, 0.25]

        # Get base 2025 (primary), fall back to 2024
        base_val = 0
        b2025 = row.get('Βάση 2025')
        if pd.notna(b2025) and b2025 != '-':
            try:
                base_val = float(b2025)
            except ValueError:
                pass

        if base_val == 0:
            b2024 = row.get('Βάση 2024')
            if pd.notna(b2024) and b2024 != '-':
                try:
                    base_val = float(b2024)
                except ValueError:
                    pass

        # Special subject percentage (if any)
        special_subject = None
        if spec_pct is not None and spec_pct > 0:
            special_subject = round(spec_pct * 100)

        entry = {
            'name': dept,
            'institution': inst,
            'city': "",
            'field': field,
            'coefficients': [round(c, 4) for c in coeffs],
            'base2025': base_val,
        }
        
        if special_subject is not None:
            entry['specialSubjectPct'] = special_subject
        
        all_data.append(entry)

    # --- EPAL ---
    df_epal = pd.read_excel(xls, sheet_name='ΕΠΑΛ – Σχολές & Συντελεστές')
    headers_epal = [clean_col_name(h) for h in df_epal.iloc[1].tolist()]
    data_epal = df_epal.iloc[2:].copy()
    data_epal.columns = headers_epal
    
    # Forward fill sector
    data_epal['Τομέας ΕΠΑΛ'] = data_epal['Τομέας ΕΠΑΛ'].ffill()
    
    for _, row in data_epal.iterrows():
        inst = row.get('Ίδρυμα')
        dept = row.get('Τμήμα / Σχολή')
        sector = row.get('Τομέας ΕΠΑΛ')
        
        if pd.isna(inst) and pd.isna(dept):
            continue
            
        school_name = f"{dept} ({inst})" if pd.notna(inst) else dept
        institution = str(sector).strip() if pd.notna(sector) else ""
        
        # Coefficients
        lang = row.get('Νεοελλην. Γλώσσα %')
        math = row.get('Μαθ/κά %')
        spec = row.get('Μάθημα Ειδικότητας %')
        
        try: lang = float(lang)/100 if pd.notna(lang) else 0.2
        except: lang = 0.2
        try: math = float(math)/100 if pd.notna(math) else 0.2
        except: math = 0.2
        try: spec = float(spec)/100 if pd.notna(spec) else 0.6
        except: spec = 0.6
        
        coeffs = [lang, math, spec/2, spec/2]
        
        base_val = 0
        # Try Βάση 2025 first, then 2024
        for col in ['Βάση 2025', 'Βάση 2024']:
            b = row.get(col)
            if pd.notna(b) and b != '-':
                try:
                    base_val = float(b)
                    break
                except ValueError:
                    pass
                
        all_data.append({
            'name': school_name,
            'institution': institution,
            'city': "",
            'field': "ΕΠΑΛ",
            'coefficients': [round(c, 4) for c in coeffs],
            'base2025': base_val,
        })

    # Remove duplicates based on (name, institution, field)
    unique_data = []
    seen = set()
    for d in all_data:
        key = (d['name'], d['institution'], d['field'])
        if key not in seen:
            seen.add(key)
            unique_data.append(d)

    with open('public/calculator_bases.json', 'w', encoding='utf-8') as f:
        json.dump(unique_data, f, ensure_ascii=False, indent=2)
        
    print(f"Extracted {len(unique_data)} unique records to public/calculator_bases.json")
    
    # --- Stats ---
    non_equal = sum(1 for d in unique_data if d['coefficients'] != [0.25, 0.25, 0.25, 0.25])
    with_spec = sum(1 for d in unique_data if d.get('specialSubjectPct'))
    print(f"  Non-equal coefficients: {non_equal}")
    print(f"  With special subjects: {with_spec}")
    
    # --- Generate schools2026.ts ---
    generate_ts(unique_data)

def generate_ts(data):
    """Generate the TypeScript file with all school data."""
    lines = []
    lines.append('/**')
    lines.append(' * Δεδομένα Σχολών 2026 — Συντελεστές Βαρύτητας & Βάσεις')
    lines.append(' * Αυτόματα δημιουργημένο από τα Excel (ΓΕΛ & ΕΠΑΛ 2025).')
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
