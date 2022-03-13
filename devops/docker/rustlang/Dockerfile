FROM rust:slim

## Refer
# https://gitlab.com/chevdor/jupyter-rust/-/tree/master

RUN apt update && \
    apt install -y \
        jupyter-notebook \
        python3-pip \
        cmake && \
    useradd -m -g users jupyter && \
    cargo install evcxr_jupyter
RUN chmod -R a+rwx /usr/local/cargo
    
ENV THEME=monokai
# More themes at https://github.com/dunovank/jupyter-themes/tree/master/screens
# try monokai, chesterish, grade3, ...

RUN mkdir -p /notebooks && chmod -R a+rwx /notebooks && \
    pip3 install jupyterthemes

COPY config /config
COPY scripts /scripts
COPY notebooks /notebooks

USER 1000:1000
RUN /usr/local/cargo/bin/evcxr_jupyter --install

WORKDIR /notebooks

EXPOSE 8888

CMD [ "sh", "/scripts/start_jupyter.sh" ]


### build with
## docker build . -t mohanchinnappan/jupyter-rust

### Push to docker hub
## docker push mohanchinnappan/jupyter-rust

### Run with
#  docker run --rm -it --name jupyter-rust -p 8888:8888 -e THEME=monokai mohanchinnappan/jupyter-rust






