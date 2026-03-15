import os

base_dir = "/Users/clementbraun/Nsi-app/copiesCsharp/B2 SLAM - Braun (2025-2027)-DS C#-5113"

for student_folder in sorted(os.listdir(base_dir)):
    student_path = os.path.join(base_dir, student_folder)
    if os.path.isdir(student_path):
        # Extract student name (before the first underscore)
        student_name = student_folder.split('_')[0]
        
        print(f"\n{'='*50}")
        print(f"STUDENT: {student_name}")
        print(f"{'='*50}")
        
        files = os.listdir(student_path)
        if not files:
            print("No files found.")
            continue
            
        for file in files:
            file_path = os.path.join(student_path, file)
            print(f"FILE: {file}")
            
            if file.endswith('.odt'):
                print("[ODT FILE - CANNOT READ CONTENT DIRECTLY]")
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                    content = f.read()
                    if not content.strip():
                        print("[EMPTY FILE]")
                    else:
                        print(content)
            except Exception as e:
                print(f"[ERROR READING FILE: {e}]")
