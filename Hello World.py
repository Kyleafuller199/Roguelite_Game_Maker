import tkinter as tk
from tkinter import messagebox

# Create the main application window (but keep it hidden)
root = tk.Tk()
root.withdraw()  # Hide the root window

# Show the pop-out message box
messagebox.showinfo("Hello", "Hello, World!")

# Close the app after message box is closed
root.destroy()