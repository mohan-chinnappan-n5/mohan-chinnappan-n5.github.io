import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

nltk.download("punkt")
nltk.download("stopwords")

# Sample database (fictional)
database = {
    "employees": {
        "columns": ["id", "name", "age", "department"],
        "data": [
            (1, "John", 30, "HR"),
            (2, "Alice", 28, "IT"),
            (3, "Bob", 35, "Finance"),
            # Add more data as needed
        ],
    }
}

# Sample English query requirements
query_requirements = "Retrieve the names of employees in the HR department."

# Tokenize the query and remove stopwords
query_tokens = word_tokenize(query_requirements)
filtered_tokens = [word.lower() for word in query_tokens if word.isalnum() and word.lower() not in stopwords.words("english")]

# Function to generate a simple SQL query based on the filtered tokens
def generate_sql_query(tokens):
    if "retrieve" in tokens and "names" in tokens and "employees" in tokens:
        if "in" in tokens and "department" in tokens:
            department_index = tokens.index("department")
            department_name = tokens[department_index + 1]
            if department_name in ["hr", "it", "finance"]:
                return f"SELECT name FROM employees WHERE department = '{department_name.upper()}'"
    return "Invalid query"

# Generate and print the SQL query
sql_query = generate_sql_query(filtered_tokens)
print("English Query Requirements:", query_requirements)
print("Generated SQL Query:", sql_query)

