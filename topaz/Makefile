SHELL 	   := $(shell which bash)

NO_COLOR   :=\033[0m
OK_COLOR   :=\033[32;01m
ERR_COLOR  :=\033[31;01m
WARN_COLOR :=\033[36;01m
ATTN_COLOR :=\033[33;01m

VERSION    ?= $(shell svu)
COMMIT     ?= $(shell git rev-parse --short HEAD 2>/dev/null)
DATE       ?= $(shell date "+%FT%T%z")
GOPATH     ?= $(shell go env GOPATH)

POLICY_HOST  := ghcr.io
POLICY_ORG   := aserto-proj
POLICY_REPO  := pnw-appsec
POLICY_IMAGE := ${POLICY_HOST}/${POLICY_ORG}/${POLICY_REPO}
POLICY_NAME  := ${POLICY_REPO}

CONTAINER_NAME := topaz
CONTAINER_VERSION := latest

.PHONY: all
all: todo-roles todo-groups todo-rebac

.PHONY: todo-roles
todo-roles: build-todo-roles configure-todo-roles sleep-roles manifest-roles data-roles test-roles

.PHONY: todo-groups
todo-groups: build-todo-groups configure-todo-groups sleep-groups manifest-groups data-groups test-groups

.PHONY: todo-rebac
todo-rebac: build-todo-rebac configure-todo-rebac sleep-rebac manifest-rebac data-rebac test-rebac

.PHONY: install
install:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz stop
	@topaz install --container-name=${CONTAINER_NAME} --container-version=${CONTAINER_VERSION}

# build targets (one for each policy)
.PHONY: build-todo-roles
build-todo-roles:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@policy build policy-todo-roles --tag ${POLICY_IMAGE}:roles

.PHONY: build-todo-groups
build-todo-groups:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@policy build policy-todo-groups --tag ${POLICY_IMAGE}:groups

.PHONY: build-todo-rebac
build-todo-rebac:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@policy build policy-todo-rebac --tag ${POLICY_IMAGE}:rebac

# configure targets (one for each policy)
.PHONY: configure-todo-roles
configure-todo-roles:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz stop
	@topaz config new --name ${POLICY_NAME}-roles  --local-policy-image ${POLICY_IMAGE}:roles -d
	@topaz config use ${POLICY_NAME}-roles
	@topaz start

.PHONY: configure-todo-groups
configure-todo-groups:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz stop
	@topaz config new --name ${POLICY_NAME}-groups  --local-policy-image ${POLICY_IMAGE}:groups -d
	@topaz config use ${POLICY_NAME}-groups
	@topaz start

.PHONY: configure-todo-rebac
configure-todo-rebac:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz stop
	@topaz config new --name ${POLICY_NAME}-rebac  --local-policy-image ${POLICY_IMAGE}:rebac -d
	@topaz config use ${POLICY_NAME}-rebac
	@topaz start

.PHONY: sleep-roles
sleep-roles:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@sleep 1

.PHONY: sleep-groups
sleep-groups:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@sleep 1

.PHONY: sleep-rebac
sleep-rebac:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@sleep 1

.PHONY: manifest
manifest:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz directory set manifest ./model/manifest.yaml --insecure --no-check

.PHONY: manifest-roles
manifest-roles:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz directory set manifest ./model/manifest.yaml --insecure --no-check

.PHONY: manifest-groups
manifest-groups:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz directory set manifest ./model/manifest.yaml --insecure --no-check

.PHONY: manifest-rebac
manifest-rebac:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz directory set manifest ./model/manifest.yaml --insecure --no-check

.PHONY: data
data:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz directory import --directory=./data --insecure --no-check

.PHONY: data-roles
data-roles:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz directory import --directory=./data --insecure --no-check

.PHONY: data-groups
data-groups:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz directory import --directory=./data --insecure --no-check

.PHONY: data-rebac
data-rebac:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz directory import --directory=./data --insecure --no-check

.PHONY: test
test:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz directory test exec ./test/assertions.json --insecure --no-check
	@topaz authorizer test exec ./test/decisions.json --insecure --no-check

.PHONY: test-roles
test-roles:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz directory test exec ./test/assertions.json --insecure --no-check
	@topaz authorizer test exec ./test/decisions.json --insecure --no-check

.PHONY: test-groups
test-groups:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz directory test exec ./test/assertions.json --insecure --no-check
	@topaz authorizer test exec ./test/decisions.json --insecure --no-check

.PHONY: test-rebac
test-rebac:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz directory test exec ./test/assertions.json --insecure --no-check
	@topaz authorizer test exec ./test/decisions.json --insecure --no-check

.PHONY: restart
restart:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz stop
	@topaz start

.PHONY: console
console:
	@echo -e "${ATTN_COLOR}==> $@ ${NO_COLOR}"
	@topaz console
