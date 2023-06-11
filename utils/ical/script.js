function createICalEvent() {
  // Define the event details
  var event = {
    summary: 'Sample Event',
    location: 'Event Location',
    description: 'Event Description',
    start: '2023-06-15T10:00:00',
    end: '2023-06-15T12:00:00'
  };

  // Generate the iCal content
  var icalContent = generateICalContent(event);

  // Create a Blob from the iCal content
  var blob = new Blob([icalContent], { type: 'text/calendar' });

  // Create a download link
  var downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'event.ics';
  downloadLink.click();
}

function generateICalContent(event) {
  var icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Apple Inc.//iCal 4.0.4//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${event.summary}
LOCATION:${event.location}
DESCRIPTION:${event.description}
DTSTART:${event.start}
DTEND:${event.end}
END:VEVENT
END:VCALENDAR`;

  return icalContent;
}

