include .env

start:
	docker start ${CONTAINER_NAME}

stop:
	docker stop ${CONTAINER_NAME}

create:
	docker rm -f ${CONTAINER_NAME} 2>/dev/null || true
	docker run -d \
		-v $(PWD)/db/dev.db:/app/db/dev.db \
		--name ${CONTAINER_NAME} \
		${IMAGE_NAME}

remove:
	docker rm -f ${CONTAINER_NAME}

build:
	docker build -t ${IMAGE_NAME} .

push:
	docker push ${IMAGE_NAME}

init: build create

print_hello:
	echo "Hello, world!"

reset:
	rm -rf ./db.sqlite

start:
	npm run dev

restart: reset start
