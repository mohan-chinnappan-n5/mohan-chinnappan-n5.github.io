import os
import argparse
from rich.console import Console
from rich.table import Table

def find_apex_test_classes(apex_folder):
    if not os.path.isdir(apex_folder):
        print(f"[red]Invalid folder path: {apex_folder}[/red]")
        return

    apex_classes = []
    test_classes = []

    # Read files in the folder
    files = [f[:-4] for f in os.listdir(apex_folder) if f.endswith(".cls")]

    if not files:
        print(f"[yellow]No Apex class files found in {apex_folder}[/yellow]")
        return

    # Categorize files
    for file in files:
        if file.endswith("Test") or file.startswith("Test"):
            test_classes.append(file)
        else:
            apex_classes.append(file)

    # Map Apex classes to their test classes
    class_to_test_map = {}
    for apex_class in apex_classes:
        expected_test_suffix = f"{apex_class}Test"
        expected_test_prefix = f"Test{apex_class}"
        related_tests = [test for test in test_classes if test in {expected_test_suffix, expected_test_prefix}]

        class_to_test_map[apex_class] = related_tests if related_tests else ["❌ No test class found"]

    # Print results in a colorful table
    print_table(class_to_test_map)


def print_table(class_to_test_map):
    console = Console()
    table = Table(title="Apex Classes and Corresponding Test Classes", highlight=True)
    
    table.add_column("Apex Class", style="bold cyan", justify="left")
    table.add_column("Test Classes", style="bold yellow", justify="left")

    for apex_class, tests in class_to_test_map.items():
        test_display = ", ".join(tests)
        test_style = "bold red" if "❌" in test_display else "bold green"
        table.add_row(apex_class, f"[{test_style}]{test_display}[/{test_style}]")

    console.print(table)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Find Apex test classes")
    parser.add_argument("--cls-folder", required=True, help="Path to the folder containing Apex classes")
    args = parser.parse_args()

    find_apex_test_classes(args.cls_folder)