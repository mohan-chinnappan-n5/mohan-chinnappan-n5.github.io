# Reasoning and Acting (ReAct)

**ReAct** is a framework that integrates reasoning and acting in language model-based systems to improve their decision-making and task execution capabilities.

## Key Features
1. **Unified Approach**: Combines reasoning (deductive or inferential thinking) and acting (interacting with the environment) in a single framework.
2. **Interactive**: Allows models to respond dynamically to evolving contexts by reasoning through observations and acting accordingly.
3. **Task Agnostic**: Can be applied to various domains like question answering, planning, and multi-step problem-solving.

## Advantages
- **Improved Problem Solving**: Enhances the ability of models to address complex, multi-step problems.
- **Adaptability**: Facilitates better handling of ambiguous or changing scenarios.
- **Efficiency**: Reduces errors by interweaving reasoning with real-world feedback.

## Applications
- Open-domain question answering
- Dynamic task execution in interactive environments
- Multi-agent systems requiring reasoning and collaboration

## Example Workflow
1. **Observation**: Gather data or context from the environment.
2. **Reasoning**: Analyze and infer solutions or next steps.
3. **Action**: Execute actions to achieve goals or refine understanding.

ReAct emphasizes the symbiosis of reasoning and action, making AI systems more effective in practical, real-world applications.

## References 
- [ReAct: SYNERGIZING REASONING AND ACTING IN LANGUAGE MODELS](https://arxiv.org/pdf/2210.03629v1)

## Abstract
While large language models (LLMs) have demonstrated impressive performance
across tasks in **language understanding and interactive decision making**, their
abilities for reasoning (e.g. chain-of-thought prompting) and acting (e.g. action
plan generation) have primarily been studied as separate topics. 

In this [ReAct: SYNERGIZING REASONING AND ACTING IN LANGUAGE MODELS](https://arxiv.org/pdf/2210.03629v1), we
explore the use of LLMs to generate both reasoning traces and task-specific actions
in an interleaved manner, allowing for greater synergy between the two: 

1. **reasoning traces** help the model induce, track, and
2.  update **action plans** as well as handle exceptions, while actions allow it to interface with and gather additional information from external sources such as knowledge bases or environments.

We apply our approach, named **ReAct**, to a diverse set of language and decision making tasks
and demonstrate its effectiveness over state-of-the-art baselines in addition to
improved human interpretability and trustworthiness. Concretely, on question
answering (HotpotQA) and fact verification (Fever), ReAct overcomes prevalent
issues of hallucination and error propagation in chain-of-thought reasoning by
interacting with a simple Wikipedia API, and generating human-like task-solving
trajectories that are more interpretable than baselines without reasoning traces.
Furthermore, on two interactive decision making benchmarks (ALFWorld and
WebShop), ReAct outperforms imitation and reinforcement learning methods by
an absolute success rate of 34% and 10% respectively, while being prompted with
only one or two in-context examples.
