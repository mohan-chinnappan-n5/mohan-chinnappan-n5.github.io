// eng2sqlApp.js
// mohan chinnappan
// --------------
// The eng2sqlApp.js script is responsible for generating SQL queries based on user prompts and CSV data. 
// It uses the Groq API to generate SQL queries and displays the results to the user. 
// The script handles file uploads, generates SQL queries based on user prompts, 
// and displays the generated SQL queries to the user.

const urlParams = new URLSearchParams(window.location.search);
const groqApiKey = urlParams.get('key');

if (!groqApiKey) {
  alert('GroqAPIKey is required to proceed. Please provide it in the URL as ?key=YOUR_API_KEY');
  document.body.innerHTML = ''; // Clear the app content
  throw new Error('GroqAPIKey is missing.');
}

const groqModel = urlParams.get('model') || 'llama3-8b-8192';
const previewLines = parseInt(urlParams.get('lines')) || 10;

let csvHeaders = [];
let csvData = [];
let csvPreview = '';

// Handle file upload
document.getElementById('csvInput').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split('\n').filter(line => line.trim());
    //csvHeaders = lines[0].split(',');
    // Parse CSV headers properly, including handling field delimiters like quotes
    csvHeaders = lines[0].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map(header => 
    header.startsWith('"') && header.endsWith('"') 
      ? header.slice(1, -1) 
      : header
  );
    //csvData = lines.slice(1).map(line => line.split(','));
    // Parse CSV properly, including handling field delimiters like quotes
    csvData = lines.slice(1).map(line => {
    return line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g).map(field => 
      field.startsWith('"') && field.endsWith('"') 
        ? field.slice(1, -1) 
        : field
    );
  });

    if (!csvHeaders.length || !csvData.length) {
      alert('The uploaded CSV file appears to be empty or invalid.');
      return;
    }

    // Show CSV preview
    csvPreview = lines.slice(0, previewLines + 1).join('\n');
    $('#csvTable').DataTable({
      destroy: true,
      data: csvData,
      columns: csvHeaders.map(header => ({ title: header })),
    });
    $('#tableSection').removeClass('hidden');
    document.getElementById('generateSQL').classList.remove('hidden');
  };
  reader.readAsText(file);
});

// Generate SQL query
document.getElementById('generateSQL').addEventListener('click', async function () {
  const userPrompt = document.getElementById('userPrompt').value.trim();
  if (!userPrompt) {
    alert('Please enter a prompt describing your request.');
    return;
  }

  if (!csvPreview) {
    alert('Please upload a CSV file.');
    return;
  }

  const requestBody = {
    model: groqModel,
    messages: [{
      role: 'user',
      content: `Based on the following CSV data, write an SQL query for a table named 'Data' to fulfill this request: "${userPrompt}". When a field name contains spaces, use square brackets [ ] around the field name (e.g., [Field Name]).\n\nCSV Content:\n${csvPreview}`
    }]
  };

  document.getElementById('requestBodyContent').innerText = JSON.stringify(requestBody, null, 2);
  document.getElementById('requestBodySection').classList.remove('hidden');


  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Failed to generate SQL query.');
    }

    const result = await response.json();
    const sql = result.choices?.[0]?.message?.content || 'No SQL query generated.';
    document.getElementById('sqlOutput').innerText = sql;
    document.getElementById('sqlSection').classList.remove('hidden');
    document.getElementById('sqlSection').scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error(error);
    alert('Error generating SQL query.');
  }
});