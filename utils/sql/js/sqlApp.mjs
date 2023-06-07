// sqlApp.mjs
// mchinnappan 

const sql =
    `-- setup the table and data for the table
DROP TABLE IF EXISTS employees;
CREATE TABLE employees(
id          integer,  name    text,
designation text,     manager integer,
hired_on    date,     salary  integer,
commission  float,    dept    integer
);

INSERT INTO employees VALUES 
(1,'JOHNSON','ADMIN',6,'1990-12-17',18000,NULL,4),
(2,'HARDING','MANAGER',9,'1998-02-02',52000,300,3),
(3,'TAFT','SALES I',2,'1996-01-02',25000,500,3),
(4,'HOOVER','SALES I',2,'1990-04-02',27000,NULL,3),
(5,'LINCOLN','TECH',6,'1994-06-23',22500,1400,4),
(6,'GARFIELD','MANAGER',9,'1993-05-01',54000,NULL,4),
(7,'POLK','TECH',6,'1997-09-22',25000,NULL,4),
(8,'GRANT','ENGINEER',10,'1997-03-30',32000,NULL,2),
(9,'JACKSON','CEO',NULL,'1990-01-01',75000,NULL,4),
(10,'FILLMORE','MANAGER',9,'1994-08-09',56000,NULL,2),
(11,'ADAMS','ENGINEER',10,'1996-03-15',34000,NULL,2),
(12,'WASHINGTON','ADMIN',6,'1998-04-16',18000,NULL,4),
(13,'MONROE','ENGINEER',10,'2000-12-03',30000,NULL,2),
(14,'ROOSEVELT','CPA',9,'1995-10-12',35000,NULL,1)
;



`;

const query =
    `-- uncomment a query in the below list to run        
SELECT * FROM employees;
-- SELECT * FROM employees LIMIT 3;
-- SELECT name, dept FROM employees LIMIT 3;
-- SELECT name, dept FROM employees WHERE dept = '4';

-- SELECT COUNT(*) CNT FROM employees;
-- SELECT SUM(salary) total_salary FROM employees ;
-- SELECT AVG(salary) avg_salary FROM employees ;
-- SELECT MAX(salary) max_salary, name FROM employees ;



`;

const getEle = id => document.getElementById(id);
// getEle('query').value = query;


Split(["#menu", "#content"], { sizes: [50, 50] });

const editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/json");
const data = [{ "name": "unix", "authors": "ken and dmr" }, { "name": "c", "authors": "dmr" }
];
editor.setValue(JSON.stringify(data, null, '\t'));

const editorSQL = ace.edit("commands");
editorSQL.setTheme("ace/theme/monokai");
editorSQL.session.setMode("ace/mode/sql");
editorSQL.setValue(sql);

const editorQuery = ace.edit("query");
editorQuery.setTheme("ace/theme/monokai");
editorQuery.session.setMode("ace/mode/sql");
editorQuery.setValue(query);


//-------------
const config = { locateFile: filename => `js/${filename}` }
// The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
// We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.


getEle('execute').addEventListener('click', event => {
    initSqlJs(config).then(function (SQL) {
        //Create the database
        const DB = new SQL.Database();
        // Run a query without reading the results
        DB.run(editorSQL.getValue());
        // Prepare a statement
        //const stmt = DB.prepare("SELECT * FROM employees WHERE name = $firstname");
        //stmt.bind({ $firstname: 'GRANT'});
        try {
            const stmt2 = DB.prepare(editorQuery.getValue());
            let results = [];
            while (stmt2.step()) { //
                results.push(stmt2.getAsObject());
            }
            editor.setValue(JSON.stringify(results, null, '\t'));
        } catch (e) {
            // alert(e);
            console.log(e);
            getEle('errors').value = e;
        }


    });
});

//-------
getEle('execute').click();


const convertAndDownload = jsonData => {
    // Convert JSON to CSV
    const csvData = Papa.unparse(jsonData);
  
    // Generate download link
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv';
    link.click();
  
    // Clean up
    URL.revokeObjectURL(url);
}

function convertAndCopyToClipboard(jsonData) {
    // Convert JSON to CSV
    const csvData = Papa.unparse(jsonData);
  
    // Copy CSV data to clipboard
    navigator.clipboard.writeText(csvData)
      .then(() => {
        console.log('CSV data copied to clipboard!');
      })
      .catch((error) => {
        console.error('Failed to copy CSV data to clipboard:', error);
      });
}
  
  

getEle('tocsv').addEventListener('click', event => {
    convertAndDownload(editor.getValue());

});

getEle('viewcsv').addEventListener('click', event => {
    // Convert JSON to CSV
    convertAndCopyToClipboard(editor.getValue());
    window.location.href = `https://mohan-chinnappan-n5.github.io/viz/datatable/dt.html?c=csv`;
});

//---------