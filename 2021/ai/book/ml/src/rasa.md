# Rasa
Rasa is an open source machine learning framework for **automated text and voice-based conversations**.


## Sample Training data in yaml

- NLU Data
```yaml
nlu:
- intent: greet
  examples: |
    - Hi
    - Hey!
    - Hallo
    - Good day
    - Good morning

- intent: subscribe
  examples: |
    - I want to get the newsletter
    - Can you send me the newsletter?
    - Can you sign me up for the newsletter?

- intent: inform
  examples: |
    - My email is example@example.com
    - random@example.com
    - Please send it to anything@example.com
    - Email is something@example.com
```

- Responses

```yaml
responses:
   utter_greet:
       - text: |
           Hello! How can I help you?
       - text: |
           Hi!
   utter_ask_email:
       - text: |
           What is your email address?
   utter_subscribed:
       - text: |
           Check your inbox at {email} in order to finish subscribing to the newsletter!
       - text: |
           You're all set! Check your inbox at {email} to confirm your subscription.
```

- Stores - connect intents with actions (utters)
```yaml
stories:
 - story: greet and subscribe
   steps:
   - intent: greet
   - action: utter_greet
   - intent: subscribe
   - action: newsletter_form
   - active_loop: newsletter_form
```

- Forms - collect information from the user

```yaml
slots:
  email:
    type: text
    mappings:
    - type: from_text
      conditions:
      - active_loop: newsletter_form
        requested_slot: email
forms:
  newsletter_form:
    required_slots:
    - email
```


- Rules
```yaml
rules:
 - rule: activate subscribe form
   steps:
   - intent: subscribe
   - action: newsletter_form
   - active_loop: newsletter_form

 - rule: submit form
   condition:
   - active_loop: newsletter_form
   steps:
   - action: newsletter_form
   - active_loop: null
   - action: utter_subscribed
```

