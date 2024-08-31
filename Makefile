include .env

start:
	docker start ${CONTAINER_NAME}

stop:
	docker stop ${CONTAINER_NAME}

create:
	docker rm -f ${CONTAINER_NAME} 2>/dev/null || true
	docker run -d \
		-p ${PORT}:${PORT} \
		-v $(PWD)/db/:/app/db/ \
		-v $(PWD)/.env/:/app/.env \
		--name ${CONTAINER_NAME} \
    --network ${NETWORK_NAME} \
		${IMAGE_NAME}

remove:
	docker rm -f ${CONTAINER_NAME}

build:
	docker build -t ${IMAGE_NAME} .

push:
	docker push ${IMAGE_NAME}

init: build create


reset:
	rm -rf ./db.sqlite

restart: reset start
