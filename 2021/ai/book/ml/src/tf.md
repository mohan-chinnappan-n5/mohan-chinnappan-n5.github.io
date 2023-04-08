# 5. Tensorflow


## Distributed Training with Tensorflow

Deep Learning involves very large datasets.

Faster model training time helps to provide faster iterations to reach model goals faster and trying new ideas.


Distribution is not automatic.

In case of a 4 GPU hardware:

|GPU#|Name|Temp|PowerUsage|GPU Util|
|---|---|---|--|--|
|0|Tesla|59C|113/250W|72%|
|1|Tesla|52C|113/250W|0%|
|2|Tesla|50C|113/250W|0%|
|3|Tesla|59C|113/250W|0%|

To enable to use of all GPUs, modeling code needs to be modified to make TensorFlow to coordinate across the GPUs at runtime.




### Model Parallelism
- Running independent parts of the computations which we can run in parallel.
``WX``  (matrix multpicaton) is done at gpu-0 which adding (add op) with ```b``` bias is done at gpu-1

### Data Parallelism
- Works with any model architecture, so widely adopted.

```py

# Linear Model, W: Weights, b: Bias
y_pred =  WX + b

# Equivalent to a keras Dense single unit
tf.keras.layers.Dense(units=1)

model.fit(x,y, batch_size=32)


```
For **each step** of the model training, **a batch of data** is used to calculate gradients. Thus obtained gradients are used to update the weights of the model.
**Larger** the batch size, the **more accurate** the gradients are.
Making batch size **too large** will make us to run out of **GPU memory**.

```py
# with data parallelism we can add NUM_GPUS in the batch_size
model.fit(x,y, batch_size=32 * NUM_GPUS)


```

Each GPU gets a separate slice of the data, calculate the gradients, and those gradients are **averaged**. So the model is able to **see more data** during **each training step**. So less time is taken to finish an epoch (a full pass to the training data)


#### Synchronous Data Parallelism

#### Asynchronous Data Parallelism

