from pyicloud import PyiCloudService
api = PyiCloudService('mchinnappan@salesforce.com', 'NewGreen1962')

ical_service = api.calendar
events = ical_service.events()
for event in events:
    print(event)

# create new event
new_event = ical_service.new_event()
new_event.title = 'My Event'
new_event.location = 'Event Location'
new_event.notes = 'Event Description'
new_event.start = '2023-06-15 10:00:00'
new_event.end = '2023-06-15 12:00:00'
new_event.save()

# Update an existing event:
event_id = 'your_event_id'
event = ical_service.event(event_id)
event.title = 'Updated Event Title'
event.save()

# Delete an event:
event_id = 'your_event_id'
event = ical_service.event(event_id)
event.delete()

