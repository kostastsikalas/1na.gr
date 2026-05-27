import pandas as pd
import json

def clean_col_name(col):
    if isinstance(col, str):
        return col.replace('\n', ' ').strip()
    return col

def main():
    file_path = 'public/Βάσεις_2024_Συντελεστές_2025-2026.xlsx'
    xls = pd.ExcelFile(file_path)
    
    sheets_to_process = [
        ('1️⃣ Θετικές', '2ο ΕΠΙΣΤΗΜΟΝΙΚΟ ΠΕΔΙΟ — Θετικές & Τεχνολογικές Επιστήμες'),
        ('2️⃣ Υγεία', '3ο ΕΠΙΣΤΗΜΟΝΙΚΟ ΠΕΔΙΟ — Επιστήμες Υγείας & Ζωής'),
        ('3️⃣ Κοινωνικές', 'Κοινωνικές Επιστήμες'),
        ('4️⃣ Ανθρωπιστικές', '1ο ΕΠΙΣΤΗΜΟΝΙΚΟ ΠΕΔΙΟ — Ανθρωπιστικές, Νομικές & Κοινωνικές Επιστήμες'),
        ('5️⃣ Οικονομία', '4ο ΕΠΙΣΤΗΜΟΝΙΚΟ ΠΕΔΙΟ — Επιστήμες Οικονομίας & Πληροφορικής'),
        ('🔧 ΕΠΑΛ', 'ΕΠΑΛ')
    ]
    
    all_data = []
    
    for sheet_name, category_fallback in sheets_to_process:
        try:
            df = pd.read_excel(xls, sheet_name=sheet_name)
        except Exception as e:
            print(f"Failed to read sheet {sheet_name}: {e}")
            continue
            
        if len(df) < 3:
            continue
            
        # Try to extract actual category name from column 1
        col_name = df.columns.tolist()[1]
        if isinstance(col_name, str) and 'ΠΕΔΙΟ' in col_name:
            category = col_name.strip()
        elif sheet_name == '🔧 ΕΠΑΛ':
            category = 'ΕΠΑΛ'
        else:
            category = category_fallback
            
        # The columns are at index 2 (row 3)
        headers = df.iloc[2].tolist()
        headers = [clean_col_name(h) for h in headers]
        
        # The data starts from index 3
        data_df = df.iloc[3:].copy()
        data_df.columns = headers
        
        for index, row in data_df.iterrows():
            institution = row.get('Ίδρυμα')
            department = row.get('Τμήμα / Σχολή')
            base = row.get('Βάση ΓΕΛ 2024')
            if pd.isna(base) and 'Βάση ΕΠΑΛ 2024' in row:
                base = row.get('Βάση ΕΠΑΛ 2024')
                
            if pd.isna(institution) and pd.isna(department):
                continue
                
            # Skip rows that are just informational text
            if isinstance(institution, str) and 'ΣΒ =' in institution:
                continue
                
            # Collect coefficients (ΣΒ)
            coeffs = {}
            for col in headers:
                if isinstance(col, str) and col.startswith('ΣΒ'):
                    val = row.get(col)
                    if not pd.isna(val) and val != '-':
                        coeffs[col] = float(val) if isinstance(val, (int, float, str)) and str(val).replace('.','').isdigit() else val
            
            base_val = None
            if not pd.isna(base) and base != '-':
                try:
                    base_val = float(base)
                except ValueError:
                    base_val = base
            
            entry = {
                'id': f"{sheet_name}-{index}",
                'category': category,
                'institution': str(institution).strip() if not pd.isna(institution) else "",
                'department': str(department).strip() if not pd.isna(department) else "",
                'base_2024': base_val,
                'coefficients': coeffs
            }
            all_data.append(entry)

    with open('public/bases.json', 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
        
    print(f"Extracted {len(all_data)} records to public/bases.json")

if __name__ == '__main__':
    main()
