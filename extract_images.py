import fitz  # PyMuPDF
import sys
import os

def extract_images(pdf_path, output_dir):
    try:
        doc = fitz.open(pdf_path)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        print(f"Processing {pdf_path}...")
        
        for i, page in enumerate(doc):
            image_list = page.get_images()
            
            for image_index, img in enumerate(image_list):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                
                image_filename = f"page{i+1}_img{image_index+1}.{image_ext}"
                image_path = os.path.join(output_dir, image_filename)
                
                with open(image_path, "wb") as f:
                    f.write(image_bytes)
                
                print(f"Saved {image_filename}")
                
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 extract_images.py <pdf_path> <output_dir>")
        sys.exit(1)
    
    extract_images(sys.argv[1], sys.argv[2])
