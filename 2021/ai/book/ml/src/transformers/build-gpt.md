# Building GPT

```py

input_txt = "Once upon a time there was a king called Askhoka. He planted fruit bearing trees for the benefit of the animals and humans"
chars = sorted(set(input_txt))
vocab_size = len(chars)

print (''.join(chars)

# to integer (encoding)
stoi = {ch:i for i,ch in enumerate(chars)}
itos = {i:ch for i,ch in enumerate(chars)}

encode = lambda s:  [ stoi[c] for c in s]
decode = lambda l:  [ itos[i] for i in l ]

encode('thompson')
decode(encode('thompson'))

''.join(decode(encode('thompson')))

```
- [Colab link](https://github.com/mohan-chinnappan-n/ml-book/blob/main/nanogpt2.ipynb)





## References
- [MathJax basic tutorial and quick reference](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)
