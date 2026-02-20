import os
import shutil
from tkinter import Tk, filedialog, simpledialog
from config import ASSETS_DIR

# Predefined asset folders
ASSET_FOLDERS = {
    "card logos": "card logos",
    "fonts": "fonts",
    "icons": "icons",
    "monsters": "monsters",
    "scenes": "scenes",
    "playable_characters": "playable_characters"
}

def import_asset_with_folder_choice():
    """
    Lets the user pick a file to import and select one of the predefined asset folders.
    Case-insensitive folder selection.
    Returns the path of the imported file, or None if cancelled.
    """
    root = Tk()
    root.withdraw()  # Hide root window

    # 1️⃣ Pick the file to import
    file_path = filedialog.askopenfilename(
        title="Select a file to import",
        filetypes=[("Image files", "*.png *.jpg *.jpeg *.bmp *.gif"), ("All files", "*.*")]
    )
    if not file_path:
        print("Import cancelled.")
        root.destroy()
        return None

    # 2️⃣ Ask which folder to put it in (case-insensitive)
    folder_choice = simpledialog.askstring(
        "Asset Folder",
        f"Select the destination folder:\nOptions: {', '.join(ASSET_FOLDERS.keys())}"
    )
    if not folder_choice:
        print("Cancelled folder selection.")
        root.destroy()
        return None

    # Normalize input to lowercase for comparison
    folder_choice_lower = folder_choice.strip().lower()
    if folder_choice_lower not in ASSET_FOLDERS:
        print(f"Invalid folder choice: '{folder_choice}'.")
        root.destroy()
        return None

    dest_dir = os.path.join(ASSETS_DIR, ASSET_FOLDERS[folder_choice_lower])
    os.makedirs(dest_dir, exist_ok=True)

    # Copy the file
    file_name = os.path.basename(file_path)
    dest_path = os.path.join(dest_dir, file_name)
    if os.path.exists(dest_path):
        print(f"File '{file_name}' already exists in {dest_dir}")
        root.destroy()
        return dest_path

    shutil.copy(file_path, dest_path)
    print(f"Imported '{file_name}' to {dest_dir}")
    root.destroy()
    return dest_path


# Example usage
if __name__ == "__main__":
    imported_file = import_asset_with_folder_choice()
    if imported_file is None:
        print("No file imported.")
