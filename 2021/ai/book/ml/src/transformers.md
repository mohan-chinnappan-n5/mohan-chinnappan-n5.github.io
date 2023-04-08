# 19.  Transformers

## Papers
- [Attention is All You Need](https://arxiv.org/pdf/1706.03762.pdf)
    - A new simple network architecture, the **Transformer**, based solely on **attention mechanisms**, 
        - dispensing with recurrence and convolutions entirely
    - Transformer generalizes well to other tasks by applying it successfully to English constituency parsing both with large and limited training data.

   - sequence modeling tasks are based on
        - LSTM  (long short-term memory)
        - language modeling and machine translation
        - generate a sequence of hidden states ht as a function of the previous hidden state ht−1 1 and the input for position t. This inherently sequential nature precludes **parallelization** within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples.
    - **Attention mechanisms** have become an integral part of compelling sequence modeling and transduction models in various tasks, allowing modeling of dependencies without regard to their distance in the input or output sequences

    - Transformer
        - a model architecture eschewing recurrence and instead relying entirely on **an attention mechanism** to draw **global dependencies** between input and output.
        - allows for significantly more **parallelization** and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.


    - Usually we compute the hidden representations in parallel for all input and output positions. 
    - In these models,the **number of operations** required to relate signals from two arbitrary input or output positions grows in the **distance between positions**
    - This makes it more difficult to learn dependencies between distant positions 
    - In Transformer this is reduced to a **constant number of operations**

    - **Self-attention**, sometimes called intra-attention
        -  attention mechanism **relating different positions** of a single sequence in order to compute a representation of the sequence.
        - relying entirely on self-attention to compute representations of its input and output without using sequence aligned RNNs or convolution. 
    
    ![transformer](img/transform-1.png)


    ### Encoder
    [wc](http://localhost:7010/github-mirror/mohan-chinnappan-n5.github.io/wc/wc.html?c=1)
    - The encoder is composed of a stack of ```N = 6``` identical layers
    - Each Layer has  2 Sub Layers, each Sub Layer has:
        - multi-head **self-attention**
        - position-wise fully connected feed-forward network


    - ```Sublayer(x)``` is the function implemented by the sub-layer itself.
    - Output of each sub-layer is ```LayerNorm(x + Sublayer(x))```

    - To facilitate these residual connections, all sub-layers in the model, as well as the embedding layers, produce outputs of dimension ```dmodel = 512```

    ### Decoder
    - also composed of a stack of ```N = 6``` identical layers
    - In addition to the two sub-layers in each encoder layer, the decoder **inserts a third sub-layer**
        -  which performs multi-head **attention over the output** of the encoder stack
        - Similar to the encoder, we employ residual connections around each of the sub-layers, followed by layer normalization
    - We also modify the self-attention sub-layer in the decoder stack to **prevent positions from attending to subsequent positions**. 
        - This masking, combined with fact that the output embeddings are offset by one position
          - ensures that the predictions for position ```i``` can depend only on the known outputs at positions   ```< i```.

    ### Attention
    - Can be described as mapping a **query** and a **set of key-value pairs** to an **output**,
    - where the query, keys, values, and output are all **vectors**.
    -  The output is computed as a **weighted sum of the values**
        -  where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.



- [Language Models are Few-Shot Learners](https://arxiv.org/pdf/2005.14165.pdf)

