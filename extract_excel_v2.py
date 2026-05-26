import pandas as pd
import json

def clean_col_name(col):
    if isinstance(col, str):
        return col.replace('\n', ' ').strip()
    return col

def main():
    file_path = 'public/Σχολές_ΑΕΙ_Συντελεστές_2026.xlsx'
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

    cols = ['Ν.Γλώσσα & Λογοτ. %', 'Αρχαία Ελλην. %', 'Ιστορία %', 'Λατιν. %', 'Μαθημ. %', 'Φυσική %', 'Χημεία %', 'Βιολογία %']

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
            
        vals = []
        for c in cols:
            val = row.get(c)
            if not pd.isna(val) and val != '-':
                try:
                    vals.append(float(val) / 100)
                except ValueError:
                    pass
                    
        # Pad to 4
        while len(vals) < 4:
            vals.append(0)
            
        if len(vals) > 4:
            vals = vals[:4]

        # Rearrange based on field to match UI
        coeffs = vals
        if field_raw == 'Πεδίο 2':
            # Excel: Math, Phys, Chem, Bio(Language)
            # UI: Language, Math, Phys, Chem
            coeffs = [vals[3], vals[0], vals[1], vals[2]]
        elif field_raw == 'Πεδίο 3':
            # Excel: Math(Language), Phys, Chem, Bio
            # UI: Language, Phys, Chem, Bio
            coeffs = vals
        elif field_raw == 'Πεδίο 4':
            # Excel: Math, Phys(Info), Chem(Econ), Bio(Language)
            # UI: Language, Math, Info, Econ
            coeffs = [vals[3], vals[0], vals[1], vals[2]]
            
        base_val = 0
        b2024 = row.get('Βάση 2024')
        if pd.notna(b2024) and b2024 != '-':
            try:
                base_val = float(b2024)
            except ValueError:
                pass
                
        all_data.append({
            'name': dept,
            'institution': inst,
            'city': "",
            'field': field,
            'coefficients': coeffs,
            'base2025': base_val,
            'year2024': base_val
        })

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
            
        # In EPAL, UI displays 'institution' as the sector, and 'name' as the school+dept
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
        
        # UI expects 4 coefficients: [Language, Math, Spec1, Spec2]
        # Excel gives spec for both combined, so we split it in half
        coeffs = [lang, math, spec/2, spec/2]
        
        base_val = 0
        b2024 = row.get('Βάση 2024')
        if pd.notna(b2024) and b2024 != '-':
            try:
                base_val = float(b2024)
            except ValueError:
                pass
                
        all_data.append({
            'name': school_name,
            'institution': institution,
            'city': "",
            'field': "ΕΠΑΛ",
            'coefficients': coeffs,
            'base2025': base_val,
            'year2024': base_val
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

if __name__ == '__main__':
    main()
