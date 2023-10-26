#!/bin/bash


docker compose stop rembackend
docker rm rembackend

docker compose up rembackend -d --build
