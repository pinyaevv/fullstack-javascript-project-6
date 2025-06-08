setup: prepare install db-migrate

install:
	npm ci

db-migrate:
	npx knex migrate:latest

build:
	npm run build

prepare:
	cp -n .env.example .env || true

start:
	make start-backend
	make start-frontend

start-backend:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-frontend:
	npx webpack --watch --progress

deploy: build
	railway up --detach

lint:
	npx eslint .

fix:
	npx eslint . --fix

test:
	npm test -s