import os
import re
import json
import fitz  # PyMuPDF

PDF_DIR = "public/annales"
IMAGE_OUTPUT_DIR = "public/annales/images"
JSON_OUTPUT = "app/annales/annales_db.json"

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def parse_filename(filename):
    # Expected format: terminale-YYYY-region-sujet-X.pdf or similar
    # Remove 'terminale-' prefix and extension
    name = filename.replace("terminale-", "").replace(".pdf", "")
    
    parts = name.split("-")
    year = parts[0] if parts[0].isdigit() else "2024" # Default fallback
    
    # Try to extract useful ID
    subject_id = name
    
    return year, subject_id, name.replace("-", " ").title()

def extract_content(pdf_path, subject_id):
    doc = fitz.open(pdf_path)
    
    exercices = []
    current_exo = None
    current_questions = []
    current_intro = []
    
    img_dir = os.path.join(IMAGE_OUTPUT_DIR, subject_id)
    os.makedirs(img_dir, exist_ok=True)
    
    full_text = ""
    
    # Iterate pages
    for page_num, page in enumerate(doc):
        text = page.get_text("text")
        full_text += text + "\n"
        
        # Image extraction
        image_list = page.get_images()
        for img_index, img in enumerate(image_list):
            xref = img[0]
            try:
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                image_name = f"p{page_num+1}_{img_index+1}.{image_ext}"
                image_path = os.path.join(img_dir, image_name)
                
                # Filter small icons/logos
                if len(image_bytes) > 2000: 
                    with open(image_path, "wb") as f:
                        f.write(image_bytes)
            except:
                pass

    # Basic Parsing Logic (Heuristic)
    # Split by "EXERCICE"
    # This is a simplified parser. Real NSI subjects have complex structures.
    
    # Regex to find exercises: "EXERCICE" followed by number or text
    exo_splits = re.split(r'(EXERCICE\s+\d+)', full_text)
    
    if len(exo_splits) > 1:
        # The first part is header/intro of the exam
        header = exo_splits[0]
        
        for i in range(1, len(exo_splits), 2):
            exo_title = exo_splits[i] # "EXERCICE 1"
            exo_content = exo_splits[i+1] if i+1 < len(exo_splits) else ""
            
            # Extract points if available (e.g., "(4 points)")
            points = 4 # Default
            points_match = re.search(r'\((\d+)\s*points\)', exo_content)
            if points_match:
                points = int(points_match.group(1))
            
            # Extract theme (often first lines)
            theme = "NSI"
            lines = exo_content.strip().split('\n')
            if lines:
                # Look for "Thème" or just take the first meaningful line
                for line in lines[:5]:
                    if "Thème" in line or "thème" in line:
                        theme = line.replace("Thème", "").replace(":", "").strip()
                        break
            
            # Parse Questions (1., 2., a), b))
            # Heuristic: split by numbered list
            # We will just store raw text for now as splitting questions reliably is hard without layout analysis
            
            # Identify intro text (before first question)
            q_split = re.split(r'(\n\s*1\.\s+)', exo_content, 1)
            intro = ""
            questions_text = exo_content
            
            if len(q_split) > 1:
                intro = q_split[0]
                questions_text = q_split[1] + q_split[2]
            else:
                intro = exo_content[:200] + "..." # Fallback
            
            # Create a simplified question list (placeholder)
            questions = [
                {
                    "id": "1", 
                    "question": "Voir le sujet complet pour les détails.", 
                    "indice": "Lisez attentivement l'énoncé.", 
                    "reponse": "Correction en cours de génération."
                }
            ]
            
            exercices.append({
                "title": f"{exo_title} : {clean_text(lines[0] if lines else '')}",
                "theme": clean_text(theme),
                "points": points,
                "intro": clean_text(intro),
                "questions": questions
            })
            
    return exercices

def main():
    if not os.path.exists(PDF_DIR):
        print(f"Directory {PDF_DIR} not found.")
        return

    annales_db = {}
    
    files = [f for f in os.listdir(PDF_DIR) if f.endswith('.pdf')]
    print(f"Found {len(files)} PDF files.")
    
    for filename in files:
        if "corrigé" in filename:
            continue # Skip correction files for now, or link them later
            
        print(f"Processing {filename}...")
        try:
            year, subject_id, title = parse_filename(filename)
            pdf_path = os.path.join(PDF_DIR, filename)
            
            exercices = extract_content(pdf_path, subject_id)
            
            if exercices:
                if subject_id not in annales_db:
                    annales_db[subject_id] = {
                        "title": title,
                        "date": year,
                        "description": "Sujet officiel.",
                        "exercices": exercices
                    }
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    # Write to JSON
    with open(JSON_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(annales_db, f, indent=2, ensure_ascii=False)
    
    print(f"Database saved to {JSON_OUTPUT}")

if __name__ == "__main__":
    main()
