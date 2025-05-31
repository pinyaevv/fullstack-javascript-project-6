setup: prepare install db-migrate

install:
	npm install

db-migrate:
	NODE_ENV=production npx knex migrate:latest || echo "Skipping DB migration if DB is unreachable"

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

test:
	npm test -s