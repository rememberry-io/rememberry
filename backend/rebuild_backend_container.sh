#!/bin/bash


docker compose stop backend
docker rm rembackend

docker compose up -d --build
