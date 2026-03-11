import pypdf
import sys
import os

def extract_text(pdf_path, output_path):
    try:
        reader = pypdf.PdfReader(pdf_path)
        with open(output_path, "w", encoding="utf-8") as f:
            for i, page in enumerate(reader.pages):
                # Using standard extraction for now as 'layout' might not be available or stable in all pypdf versions
                # layout mode was added recently in pypdf > 3.0.0
                try:
                    text = page.extract_text(extraction_mode="layout")
                except:
                    text = page.extract_text()
                
                f.write(f"\n--- PAGE {i+1} ---\n")
                f.write(text)
                f.write("\n")
        print(f"Extracted text saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 extract_pdf.py <pdf_path>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    base_name = os.path.basename(pdf_path)
    output_path = f"{base_name}.txt"
    
    extract_text(pdf_path, output_path)
