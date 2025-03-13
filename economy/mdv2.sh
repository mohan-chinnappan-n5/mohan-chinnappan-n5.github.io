#!/bin/bash

# Check if a file argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <file>"
    exit 1
fi

# Check if the file exists
if [ ! -f "$1" ]; then
    echo "Error: File '$1' not found!"
    exit 1
fi

# Copy file content to clipboard (macOS and Linux support)
if command -v pbcopy &> /dev/null; then
    cat "$1" | pbcopy
elif command -v xclip &> /dev/null; then
    cat "$1" | xclip -selection clipboard
elif command -v xsel &> /dev/null; then
    cat "$1" | xsel --clipboard --input
else
    echo "Error: No clipboard utility found (pbcopy, xclip, or xsel)."
    exit 1
fi

echo "Content copied to clipboard."

# Open the markdown editor
if command -v open &> /dev/null; then
    open https://mohan-chinnappan-n5.github.io/md/2/md.html
elif command -v xdg-open &> /dev/null; then
    xdg-open https://mohan-chinnappan-n5.github.io/md/2/md.html
else
    echo "Please open the following URL manually:"
    echo "https://mohan-chinnappan-n5.github.io/md/2/md.html"
fi
