#!/bin/bash

# Check if the user provided a source directory as an argument
if [ $# -ne 1 ]; then
    echo "Usage: $0 <source_directory>"
    exit 1
fi

SOURCE_DIR="$1"

# Check if directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Directory $SOURCE_DIR not found"
    exit 1
fi

# Temporary Python script to analyze class coverage
cat << 'EOF' > analyze_class.py
import sys
import re

def read_file(file_path):
    try:
        with open(file_path, 'r') as f:
            return f.read()
    except Exception:
        return ""

def find_class_name(class_content):
    # Extract only the class name without modifiers like public/private/global
    match = re.search(r'\b(?:public|private|global|protected)?\s*class\s+(\w+)', class_content, re.IGNORECASE)
    return match.group(1) if match else None

def check_test_coverage(class_name, test_content):
    return class_name.lower() in test_content.lower()

def main():
    if len(sys.argv) != 3:
        sys.exit(1)  # Exit silently if incorrect args
    
    class_file, test_file = sys.argv[1], sys.argv[2]
    
    class_content = read_file(class_file)
    test_content = read_file(test_file)
    
    class_name = find_class_name(class_content)
    if not class_name:
        return  # No class name found
    
    if check_test_coverage(class_name, test_content):
        print(test_file)  # Print only test class name

if __name__ == "__main__":
    main()
EOF

# Print table header
printf "%-30s | %-30s\n" "Class" "TestClass"
printf "%-30s-+-%-30s\n" "------------------------------" "------------------------------"

# Process Apex classes
for class_file in "$SOURCE_DIR"/*.cls; do
    if [[ $(basename "$class_file" | tr '[:upper:]' '[:lower:]') =~ test ]]; then
        continue  # Skip test classes
    fi
    
    # Extract only the class name
    class_name=$(grep -iE '^\s*(public|private|global|protected)?\s*class\s+[a-zA-Z0-9_]+' "$class_file" | \
                 sed -E 's/.*class\s+([a-zA-Z0-9_]+).*/\1/' | head -n1)
    
    if [ -z "$class_name" ]; then
        continue  # Skip if no class name found
    fi
    
    matched_test_class="Could not match"

    # Search for matching test classes
    for test_file in "$SOURCE_DIR"/*[Tt]est*.cls; do
        if [ -f "$test_file" ]; then
            test_class=$(python3 analyze_class.py "$class_file" "$test_file")
            if [ -n "$test_class" ]; then
                matched_test_class=$(basename "$test_class")  # Get test file name
                break  # Stop searching after first match
            fi
        fi
    done

    # Print formatted row only if there's a matching test class
    if [[ "$matched_test_class" != "Could not match" ]]; then
        printf "%-30s | %-30s\n" "$class_name" "$matched_test_class"
    fi
done

# Clean up
rm -f analyze_class.py
