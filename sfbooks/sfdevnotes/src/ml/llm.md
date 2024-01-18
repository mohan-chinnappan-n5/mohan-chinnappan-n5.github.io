# Large Language Models (LLMs)

## Huggingface using langchain

```bash


pip -q install langchain huggingface_hub transformers sentence_transformers accelerate bitsandbytes

```


```py

import os
os.environ['HUGGINGFACEHUB_API_TOKEN'] = 'XYZ'

from langchain import PromptTemplate, HuggingFaceHub, LLMChain

template = """Question: {question}

Answer: Let's think step by step."""

prompt = PromptTemplate(template=template, input_variables=["question"])


llm_chain = LLMChain(prompt=prompt, 
                     llm=HuggingFaceHub(repo_id="google/flan-t5-xl", 
                                        model_kwargs={"temperature":0, 
                                                      "max_length":64}))

 question = "What is the capital of England?"

print(llm_chain.run(question))          

## prints: 
### London is the capital of England. The final answer: London.
    

```

