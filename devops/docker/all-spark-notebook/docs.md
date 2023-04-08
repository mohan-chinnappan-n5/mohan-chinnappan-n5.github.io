
 - [Jupyter Docker Stacks¶ ](https://jupyter-docker-stacks.readthedocs.io/en/latest/index.html)

```
docker run -p 8888:8888 jupyter/scipy-notebook:b418b67c225b

```

```
docker run -it --rm -p 8888:8888 -v "${PWD}":/home/jovyan/work jupyter/datascience-notebook:b418b67c225b

```

docker run -it --rm -p 8888:8888  jupyter/datascience-notebook:b418b67c225b


