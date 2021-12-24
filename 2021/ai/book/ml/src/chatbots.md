# Chat bots

- A chatbot is a **conversational AI system** that is able to communicate with a human in a natural language.
- It can be integrated into websites, messaging platforms, and devices.

- Companies can delegate routine tasks to a chatbot
    -  which will be able to process *multiple user requests simultaneously*

- Chatbots are **always available** to assist the users and provide huge labor cost savings.


## Two groups of chatbots

- **Rule Based**
    - Rely on predefined commands and templates. 
    - Each of these commands should be written by a chatbot developer using regular expressions and textual data analysis

- **Data-Driven**
    - Rely on machine learning (ML) models pre-trained on dialogue data.

## Main parts of the chatbot

- **Natural Language Understanding (NLU)**
    - chatbot needs to understand **utterances** in a natural language
    - NLU translates a user query from natural language into a **labeled semantic** representation.
    - Example: The following in English:
    ```
    What is the rental price in Boston?
    ```

    - will be translated into:

```py
rent_price("Boston")
``` 

- Then chatbot has to decide what is expected of it

-  **Dialogue Manager (DM)**
    -  keeps track of the dialogue **state** and decides what should be answered to the user. 

-  **Natural Language Generator (NLG)**
    - translates a semantic representation back into human language
    - Example:

```
    rent_price_in_USD("Boston") = 2500
``` 
- will be translated to:
```
 The average rent price in Boston is around $2,500

``` 

![chatbot components](img/chatbots/chatbot-1.svg)

## openAI Chat
![OpenAI chat](https://raw.githubusercontent.com/mohan-chinnappan-n/ml-book-assets/master/openAI/openAI-chat-1.webm.gif)


## References
- Einstein
    - [Einstein Bots](https://help.salesforce.com/s/articleView?id=sf.bots_service_intro.htm&type=5)
    - [Deploy Your Bot to Your Channels](https://help.salesforce.com/s/articleView?id=sf.bots_service_deploy_to_channels.htm&type=5)
- Google Contact Center AI
    - [Google Dialogflow](https://cloud.google.com/dialogflow)
- DEEPPAVLOV
    - [DeepPavlov articles with Python code](https://github.com/deepmipt/dp_notebooks)
- RASA
    - [RASA: The Future of Customer Experience](https://rasa.com/)