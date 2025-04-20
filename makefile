.PHONY: up down build restart logs clean

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build --no-cache

restart: down up

logs:
	docker compose logs -f

clean:
	docker compose down --volumes --rmi all

frontend:
	docker compose up -d frontend-dev

backend:
	docker compose up -d backend

frontend-shell:
	docker compose exec frontend-dev sh

backend-shell:
	docker compose exec backend bash

ps:
	docker compose ps
