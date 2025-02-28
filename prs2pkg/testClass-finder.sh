#!/bin/bash

# Directory containing Apex classes (modify as needed)
SOURCE_DIR="/Users/mchinnappan/ascent_code/ascent/src/sales/channel-fundamentals/main/default/classes"


# Check if directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Error: Directory $SOURCE_DIR not found"
    exit 1
fi

# Check if there are any .cls files in the directory
if [ -z "$(ls -A "$SOURCE_DIR"/*.cls 2>/dev/null)" ]; then
    echo "No Apex classes found in $SOURCE_DIR."
    exit 1
fi

# Temporary Python script
cat << 'EOF' > analyze_class.py
import sys
import re

def read_file(file_path):
    try:
        with open(file_path, 'r') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return ""

def find_class_name(class_content):
    match = re.search(r'\b(public|private|global|protected)\s+class\s+(\w+)', class_content, re.IGNORECASE)
    return match.group(2) if match else None

def check_test_coverage(class_name, test_content):
    return class_name.lower() in test_content.lower()

def main():
    if len(sys.argv) != 3:
        print("Usage: python analyze_class.py <class_file> <test_file>")
        sys.exit(1)
    
    class_file, test_file = sys.argv[1], sys.argv[2]
    
    class_content = read_file(class_file)
    test_content = read_file(test_file)
    
    class_name = find_class_name(class_content)
    if not class_name:
        print(f"Could not determine class name in {class_file}")
        sys.exit(1)
    
    if check_test_coverage(class_name, test_content):
        print(f"✅ FOUND: {test_file} likely tests {class_name}")
        sys.exit(0)
   
if __name__ == "__main__":
    main()
EOF

echo "Scanning Apex classes in $SOURCE_DIR..."
echo "----------------------------------------"

# Find all .cls files excluding test classes
find "$SOURCE_DIR" -type f -name "*.cls" | while read -r class_file; do
    # Skip if it's a test class
    if [[ "$(basename "$class_file" | tr '[:upper:]' '[:lower:]')" =~ test ]]; then
        continue
    fi

    class_name=$(grep -iE '\b(public|private|global|protected)\s+class\s+[a-zA-Z0-9_]+' "$class_file" | \
                 sed -E 's/.*class\s+([a-zA-Z0-9_]+).*/\1/' | head -n1)

    if [ -z "$class_name" ]; then
        echo "⚠️ Could not determine class name for $class_file"
        continue
    fi

    echo "🔍 Looking for test class for: $class_name ($class_file)"
    
    found_test=false
    for test_file in "$SOURCE_DIR"/*.cls; do
        if [[ "$(basename "$test_file" | tr '[:upper:]' '[:lower:]')" =~ test ]]; then
            if python3 analyze_class.py "$class_file" "$test_file"; then
                found_test=true
            fi
        fi
    done
    
    
    echo "----------------------------------------"
done

# Clean up
rm -f analyze_class.py

echo "✅ Scan complete!"
