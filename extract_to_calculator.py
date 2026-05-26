import pandas as pd
import json

def clean_col_name(col):
    if isinstance(col, str):
        return col.replace('\n', ' ').strip()
    return col

def main():
    file_path = 'public/Βάσεις_2024_Συντελεστές_2025-2026.xlsx'
    xls = pd.ExcelFile(file_path)
    
    sheets_to_process = [
        ('1️⃣ Θετικές', 'Θετικών Σπουδών'),
        ('2️⃣ Υγεία', 'Σπουδών Υγείας'),
        # 3ο Πεδίο: Κοινωνικές — ΔΙΑΦΟΡΕΤΙΚΟί ΣΒ από Ανθρωπιστικές
        ('3️⃣ Κοινωνικές', 'Κοινωνικών Επιστημών'),
        # 4ο Πεδίο: Ανθρωπιστικές — Νέα Ελλ, Αρχαία, Ιστορία, Λατινικά
        ('4️⃣ Ανθρωπιστικές', 'Ανθρωπιστικών Σπουδών'),
        ('5️⃣ Οικονομία', 'Σπουδών Οικονομίας & Πληροφορικής'),
        ('🔧 ΕΠΑΛ', 'ΕΠΑΛ')
    ]
    
    all_data = []
    
    for sheet_name, category in sheets_to_process:
        try:
            df = pd.read_excel(xls, sheet_name=sheet_name)
        except Exception as e:
            print(f"Failed to read sheet {sheet_name}: {e}")
            continue
            
        if len(df) < 3:
            continue
            
        # The columns are at index 2 (row 3)
        headers = df.iloc[2].tolist()
        headers = [clean_col_name(h) for h in headers]
        
        # The data starts from index 3
        data_df = df.iloc[3:].copy()
        data_df.columns = headers
        
        is_epal = sheet_name == '🔧 ΕΠΑΛ'
        
        # For EPAL, forward-fill the sector column (merged cells in Excel)
        if is_epal:
            sector_col_idx = 1  # "Τομέας ΕΠΑΛ" is column index 1
            data_df.iloc[:, sector_col_idx] = data_df.iloc[:, sector_col_idx].ffill()
        
        for index, row in data_df.iterrows():
            if is_epal:
                # ΕΠΑΛ: Τομέας ΕΠΑΛ = institution, Τμήμα/Σχολή & Ίδρυμα = name
                sector = row.get(headers[1])   # "Τομέας ΕΠΑΛ"
                dept_inst = row.get(headers[2]) # "Τμήμα / Σχολή & Ίδρυμα"
                if pd.isna(sector) and pd.isna(dept_inst):
                    continue
                institution = str(sector).strip() if not pd.isna(sector) else ""
                department = str(dept_inst).strip() if not pd.isna(dept_inst) else ""
                base = row.get('Βάση ΕΠΑΛ 2024') if 'Βάση ΕΠΑΛ 2024' in headers else row.get(headers[3])
            else:
                institution = row.get('Ίδρυμα')
                department = row.get('Τμήμα / Σχολή')
                base = row.get('Βάση ΓΕΛ 2024')
                
                if pd.isna(institution) and pd.isna(department):
                    continue
                    
                # Skip informational rows
                if isinstance(institution, str) and 'ΣΒ =' in institution:
                    continue
                    
                institution = str(institution).strip() if not pd.isna(institution) else ""
                department = str(department).strip() if not pd.isna(department) else ""
                
            # Collect coefficients (ΣΒ columns)
            coeffs = []
            for col in headers:
                if isinstance(col, str) and col.startswith('ΣΒ'):
                    val = row.get(col)
                    if not pd.isna(val) and val != '-':
                        if isinstance(val, (int, float)):
                            coeffs.append(float(val))
                        elif isinstance(val, str) and val.replace('.','').isdigit():
                            coeffs.append(float(val))
                        else:
                            coeffs.append(0)
            
            # Pad/truncate to exactly 4
            while len(coeffs) < 4:
                coeffs.append(0)
            coeffs = coeffs[:4]
            
            base_val = 0
            if base is not None and not pd.isna(base) and base != '-':
                try:
                    base_val = float(base)
                except (ValueError, TypeError):
                    pass
            
            if (department or institution):
                entry = {
                    'name': department,
                    'institution': institution,
                    'city': "",
                    'field': category,
                    'coefficients': coeffs,
                    'base2025': base_val,
                    'year2024': base_val
                }
                all_data.append(entry)

    with open('public/calculator_bases.json', 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
        
    print(f"Extracted {len(all_data)} records to public/calculator_bases.json")
    
    # Summary
    from collections import Counter
    fields = Counter(d['field'] for d in all_data)
    for f, cnt in sorted(fields.items()):
        print(f"  {f}: {cnt}")

if __name__ == '__main__':
    main()
