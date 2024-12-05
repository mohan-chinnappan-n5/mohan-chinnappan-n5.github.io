# Notes: Tree-of-Thoughts (ToT) Framework

The **Tree-of-Thoughts (ToT)** framework is an advanced approach designed to enhance decision-making and problem-solving capabilities of large language models (LLMs) by structuring reasoning processes in a tree-like format. 

## **Key Concepts**
1. **Structured Reasoning:**
   - Instead of processing inputs and generating a single sequence of outputs, ToT explores multiple reasoning paths.
   - Each step in the reasoning process branches into multiple possible continuations, forming a tree structure.

2. **Exploration and Evaluation:**
   - The framework evaluates various branches of the tree to select the most promising path.
   - Decisions are made based on predefined metrics such as accuracy, utility, or alignment with the goal.

3. **Incorporation of Human-Like Problem Solving:**
   - Inspired by how humans explore and evaluate alternative ideas before reaching a solution.
   - Mimics strategies like brainstorming, pros and cons evaluation, and hypothesis testing.

## **Key Steps in Tree-of-Thoughts**
1. **Initialization:**
   - Define the problem space and set the starting point.
   - Establish the evaluation criteria for paths.

2. **Expansion:**
   - At each node (current thought), generate possible continuations or sub-thoughts.
   - Each continuation becomes a branch in the tree.

3. **Evaluation:**
   - Assess the generated branches against the criteria.
   - Score each path and prune less promising branches to focus on the most likely successful outcomes.

4. **Iteration:**
   - Continue expanding and evaluating until the optimal path is identified or a stopping condition is met.

## **Benefits of Tree-of-Thoughts**
- **Improved Decision-Making:**  
  Allows for exploring multiple possibilities before converging on a final solution.  
- **Handling Complex Problems:**  
  Useful for scenarios requiring multi-step reasoning or where the initial solution isn't apparent.  
- **Scalable Reasoning:**  
  Can be adapted to problems with varying levels of complexity.

## **Applications**
- **Planning and Strategy Development:**  
  Helps AI agents create long-term plans or strategies in games, business scenarios, or logistics.  
- **Creative Tasks:**  
  Generates diverse creative ideas and evaluates them for feasibility and effectiveness.  
- **Mathematical and Logical Reasoning:**  
  Solves complex problems involving multiple logical steps.

## **Challenges**
- **Computational Overhead:**  
  Exploring multiple paths requires significant computational resources.  
- **Balancing Exploration and Exploitation:**  
  Deciding when to explore new paths versus deepening existing ones can be tricky.  
- **Evaluation Metrics:**  
  Defining and automating evaluation criteria for paths may be problem-specific and subjective.

## **Papers**
- [Tree of Thoughts: Deliberate Problem Solving with Large Language Models](https://arxiv.org/pdf/2305.10601)
## **Abstract**

Language models  are increasingly being deployed for general problem solving
across a wide range of tasks, but are still confined to token-level, left-to-right
decision-making processes during inference. 

This means they can fall short in tasks that require **exploration, strategic lookahead**, or where initial decisions play
a pivotal role. To surmount these challenges, we introduce a new framework for
language model inference, “Tree of Thoughts” (ToT), which generalizes over the
popular “Chain of Thought” approach to prompting language models, and enables
exploration over coherent units of text (“thoughts”) that serve as intermediate steps
toward problem solving. 

ToT allows LMs to perform deliberate decision making
by considering multiple different reasoning paths and self-evaluating choices to
decide the next course of action, as well as looking ahead or backtracking when
necessary to make global choices. Our experiments show that ToT significantly
enhances language models’ problem-solving abilities on three novel tasks requiring
non-trivial planning or search: Game of 24, Creative Writing, and Mini Crosswords.

For instance, in Game of 24, while GPT-4 with chain-of-thought prompting only
solved 4% of tasks, our method achieved a success rate of 74%.

