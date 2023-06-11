// iCalApp.mjs
// mchinnappan 

const event =
`
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Apple Inc.//iCal 4.0.4//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Sample Event
LOCATION:Event Location
DESCRIPTION:Event Description
DTSTART:2023-06-15T10:00:00
DTEND:2023-06-15T12:00:00
END:VEVENT
END:VCALENDAR` 
;


const getEle = id => document.getElementById(id);

Split(["#menu", "#content"], { sizes: [50, 50] });

const editorSQL = ace.edit("commands");
editorSQL.setTheme("ace/theme/monokai");
editorSQL.session.setMode("ace/mode/text");
editorSQL.setValue(event);

function createICalEvent(event) {
  // Create a Blob from the iCal content
  var blob = new Blob([event], { type: 'text/calendar' });

  // Create a download link
  var downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'event.ics';
  downloadLink.click();

}





getEle('execute').addEventListener('click', event => {
        try {
            createICalEvent(editorSQL.getValue());
        } catch (e) {
            // alert(e);
            console.log(e);
            getEle('errors').value = e;
        }


});

//-------

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
