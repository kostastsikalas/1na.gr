import pdfplumber
import sys

def main():
    try:
        with pdfplumber.open("public/fek.pdf") as pdf:
            print(f"Total pages: {len(pdf.pages)}")
            # Read first few pages
            for i in range(min(15, len(pdf.pages))):
                text = pdf.pages[i].extract_text()
                if text and "ΣΧΟΛΗ" in text.upper():
                    print(f"--- PAGE {i} ---")
                    print(text[:1000])  # Print first 1000 chars
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
