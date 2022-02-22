# Movies API task

[![Unit and Integration Tests CI](https://github.com/eniogit/movies-task/actions/workflows/cicd.yml/badge.svg)](https://github.com/eniogit/movies-task/actions/workflows/cicd.yml)

## Run locally
```shell
docker-compose build
docker-compose up
```
Movies API is listening on port 3001.

OpenAPI documentation is available at `/api`.

## Run unit & integration tests

```shell
docker-compose -f docker-compose-unit-test.yml build # To build the image
docker-compose -f docker-compose-unit-test.yml run --rm app # Unit tests

docker-compose -f docker-compose-integration-test.yml build
docker-compose -f docker-compose-integration-test.yml run --rm app # Integration tests
```
Unit tests can also be run without docker.
```shell
npm i
npm run test
```
