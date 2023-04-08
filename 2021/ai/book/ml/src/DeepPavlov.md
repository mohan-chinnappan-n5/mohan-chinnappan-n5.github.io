# DeepPavlov

- DeepPavlov is an open source framework for 
    - chatbots and virtual assistants development

- DeepPavlov has comprehensive and flexible tools that let developers and NLP researchers:
  -  create production ready conversational skills 
  -  complex multi-skill conversational assistants

  - Developed on top of the open source machine learning frameworks TensorFlow and Keras.

- [Examples](https://github.com/deepmipt/DeepPavlov/tree/master/examples)
## Training the bot


- Installing 
```python deeppavlov

!pip install deeppavlov
!python -m deeppavlov install gobot_dstc2_minimal

```

- A policy module of the bot decides what action should be taken in the current dialogue state.
- The policy in our bot is implemented as a recurrent neural network (recurrency over user utterances) followed by a dense layer with softmax function on top. 



[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/deepmipt/DeepPavlov/blob/master/examples/gobot_tutorial.ipynb#scrollTo=XouQ1IBegRvR)


### Training data
```json
[
  [
    {
      "speaker": 1,
      "text": "hi"
    },
    {
      "speaker": 2,
      "text": "Hello, what is the weather today?",
      "act": "welcome_msg"
    },
    {
      "speaker": 1,
      "text": "Quite sunny outside"
    },
    {
      "speaker": 2,
      "text": "Then you should cycle!",
      "act": "suggest_cycling"
    },
    {
      "speaker": 1,
      "text": "Thanks! Great idea"
    },
    {
      "speaker": 2,
      "text": "You are welcome! Bye!",
      "act": "good_bye"
    }
  ],
  [
    {
      "speaker": 1,
      "text": "hey, bot"
    },
    {
      "speaker": 2,
      "text": "Hello, what is the weather today?",
      "act": "welcome_msg"
    },
    {
      "speaker": 1,
      "text": "raining a lot"
    },
    {
      "speaker": 2,
      "text": "Then you should try hot chinese tea!",
      "act": "suggest_tea"
    },
    {
      "speaker": 1,
      "text": "nice. thank you"
    },
    {
      "speaker": 2,
      "text": "You are welcome! Bye!",
      "act": "good_bye"
    }
  ],
  [
    {
      "speaker": 1,
      "text": "good morning you!"
    },
    {
      "speaker": 2,
      "text": "Hello, what is the weather today?",
      "act": "welcome_msg"
    },
    {
      "speaker": 1,
      "text": "hot and a little bit cloudy i guess"
    },
    {
      "speaker": 2,
      "text": "Then you should cycle!",
      "act": "suggest_cycling"
    },
    {
      "speaker": 1,
      "text": "no, i dont have a bike"
    },
    {
      "speaker": 2,
      "text": "That's a pity! Next time maybe. Have a good day!",
      "act": "bad_bye"
    }
  ],
  [
    {
      "speaker": 1,
      "text": "hello beautiful!"
    },
    {
      "speaker": 2,
      "text": "Hello, what is the weather today?",
      "act": "welcome_msg"
    },
    {
      "speaker": 1,
      "text": "too much snow, dont want to go out"
    },
    {
      "speaker": 2,
      "text": "Then you should try hot chinese tea!",
      "act": "suggest_tea"
    },
    {
      "speaker": 1,
      "text": "no i am not into tea"
    },
    {
      "speaker": 2,
      "text": "That's a pity! Next time maybe. Have a good day!",
      "act": "bad_bye"
    }
  ],
  [
    {
      "speaker": 1,
      "text": "good evening"
    },
    {
      "speaker": 2,
      "text": "Hello, what is the weather today?",
      "act": "welcome_msg"
    },
    {
      "speaker": 1,
      "text": "mainly cloudy and gray"
    },
    {
      "speaker": 2,
      "text": "Then you should try hot chinese tea!",
      "act": "suggest_tea"
    },
    {
      "speaker": 1,
      "text": "that sounds good"
    },
    {
      "speaker": 2,
      "text": "You are welcome! Bye!",
      "act": "good_bye"
    }
  ],
  [
    {
      "speaker": 1,
      "text": "hey"
    },
    {
      "speaker": 2,
      "text": "Hello, what is the weather today?",
      "act": "welcome_msg"
    },
    {
      "speaker": 1,
      "text": "very dark and murky"
    },
    {
      "speaker": 2,
      "text": "Then you should try hot chinese tea!",
      "act": "suggest_tea"
    },
    {
      "speaker": 1,
      "text": "tea is not funny"
    },
    {
      "speaker": 2,
      "text": "That's a pity! Next time maybe. Have a good day!",
      "act": "bad_bye"
    }
  ],
  [
    {
      "speaker": 1,
      "text": "how you doing"
    },
    {
      "speaker": 2,
      "text": "Hello, what is the weather today?",
      "act": "welcome_msg"
    },
    {
      "speaker": 1,
      "text": "the weather is gorgeous!"
    },
    {
      "speaker": 2,
      "text": "Then you should cycle!",
      "act": "suggest_cycling"
    },
    {
      "speaker": 1,
      "text": "maybe you are right, i'll try that"
    },
    {
      "speaker": 2,
      "text": "You are welcome! Bye!",
      "act": "good_bye"
    }
  ],
  [
    {
      "speaker": 1,
      "text": "hii"
    },
    {
      "speaker": 2,
      "text": "Hello, what is the weather today?",
      "act": "welcome_msg"
    },
    {
      "speaker": 1,
      "text": "nice weather really"
    },
    {
      "speaker": 2,
      "text": "Then you should cycle!",
      "act": "suggest_cycling"
    },
    {
      "speaker": 1,
      "text": "i dont wanna do such stuff"
    },
    {
      "speaker": 2,
      "text": "That's a pity! Next time maybe. Have a good day!",
      "act": "bad_bye"
    }
  ]
]

```
![training the bot](https://github.com/deepmipt/DeepPavlov/blob/master/examples/img/gobot_simple_policy.png?raw=1)

action|system response|
---|---|
welcome_msg|Hello, what is the weather today?|
suggest_tea|Then you should try hot chinese tea!|
suggest_cycling|Then you should cycle!|
good_bye|You are welcome! Bye!|
bad_bye|That's a pity! Next time maybe. Have a good day!|

![dialog system](https://github.com/deepmipt/DeepPavlov/blob/master/examples/img/gobot_simple_pipeline.png?raw=1)

#### Training the model
``` python
from deeppavlov import train_model

gobot_config['train']['batch_size'] = 4 # set batch size
gobot_config['train']['max_batches'] = 30 # maximum number of training batches
gobot_config['train']['val_every_n_batches'] = 30 # evaluate on full 'valid' split every 30 epochs
gobot_config['train']['log_every_n_batches'] = 5 # evaluate on full 'train' split every 5 batches

train_model(gobot_config)

```

### Building the model

```python
from deeppavlov import build_model
bot = build_model(gobot_config
```

### Interacting with the bot

```python

bot([[{"text": "good evening, bot"}]])

```
- response
```python
[['Hello, what is the weather today?']]
```

```python

bot([[{"text": "the weather is clooudy and gloooomy"}]])

```
- response
```python
[['Then you should cycle!']]
```

### Resetting the bot
```python
bot.reset()
```

![chat with bot](https://github.com/deepmipt/DeepPavlov/blob/master/examples/img/gobot_simple_example.png?raw=1)



  ## References
  - [DEEPPAVLOV](https://deeppavlov.ai/)
  - [How to build ‘Hello World!’ bot with DeepPavlov in 4 steps](https://medium.com/@vaskon/how-to-build-hello-world-bot-with-deeppavlov-in-4-steps-b8636563ff81)
  - [GloVe - Global Vectors for Word Representation](https://nlp.stanford.edu/projects/glove/)