## Running Mixtral on Mac M2
- [Running Mistral 8x7Bs Mixture of Experts on a Macbook](https://mattmazur.com/2023/12/13/running-mistral-8x7bs-mixture-of-experts-on-a-macbook/)

###  How I got mistralai/Mistral-7B-Instruct-v0.2 to run on my M1 Mac Air with 16GB ram. Runs about 10 tokens/s:

1. Download HuggingFace downloader: 
   bash <(curl -sSL https://g.bodaay.io/hfd) -h

2. Download mistralai/Mistral-7B-Instruct-v0.2:
  ./hfdownloader -m mistralai/Mistral-7B-Instruct-v0.2

3. Clone llama.cpp: 
  gh repo clone ggerganov/llama.cpp 
  (if you need 'gh' get from here: https://cli.github.com)

4. Checkout Mistral MOE support branch (optional? for the non MOE version):
  gh pr checkout 4406

5. Move the downloaded model files from 2 above into llama.cpp/models/mixtral-7b-instruct-v0.2 (create this dir)

6. Convert to F16 (this is in ./llama.cpp dir):
  python3 http://convert.py ./models/mixtral-7b-instruct-v0.2 --outfile ./models/mixtral-7b-instruct-v0.2/ggml-model-f16.gguf --outttype f16

7. Quantize:
  ./quantize ./models/mixtral-7b-instruct-v0.2/ggml-model-f16.gguf ./models/mixtral-7b-instruct-v0.2/ggml-model-q4_0.gguf q4_0

8. Run server:
  make -j && ./server -m models/mixtral-7b-instruct-v0.2/ggml-model-q4_0.gguf -c 4096

9. Open browser when it says something like:
  "llama server listening at http://127.0.0.1:8080"
