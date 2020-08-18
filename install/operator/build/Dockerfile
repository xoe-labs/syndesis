# ------------
# Builder
# ------------
FROM golang:1.13.7 as builder

ARG GO_BUILD_OPTIONS=
ARG CONTAINER_REGISTRY=docker.io
ARG IMAGE_NAMESPACE=syndesis
ARG IMAGE_NAME=syndesis-operator
ARG IMAGE_TAG=latest
ARG BUILD_TIME=

WORKDIR /go/src/github.com/syndesisio/syndesis/install/operator
ENV GO111MODULE=on
COPY . .
RUN go generate ./pkg/...
RUN go test -test.short -mod=vendor ./cmd/... ./pkg/...

# Build syndesis-operator binary
RUN go build \
    -ldflags \
        -X github.com/syndesisio/syndesis/install/operator/pkg.DefaultOperatorImage=${CONTAINER_REGISTRY}/${IMAGE_NAMESPACE}/${IMAGE_NAME} \
    	-X github.com/syndesisio/syndesis/install/operator/pkg.DefaultOperatorTag=${IMAGE_TAG} \
    	-X github.com/syndesisio/syndesis/install/operator/pkg.BuildDateTime=${BUILD_TIME} \
	${GO_BUILD_OPTIONS} \
    -o /out/syndesis-operator \
    -gcflags all=-trimpath=\${GOPATH} \
    -asmflags all=-trimpath=\${GOPATH} \
    -mod=vendor github.com/syndesisio/syndesis/install/operator/cmd/manager

# Build platform-detect binary
RUN go build \
    -ldflags \
        -X github.com/syndesisio/syndesis/install/operator/pkg.DefaultOperatorImage=${CONTAINER_REGISTRY}/${IMAGE_NAMESPACE}/${IMAGE_NAME} \
    	-X github.com/syndesisio/syndesis/install/operator/pkg.DefaultOperatorTag=${IMAGE_TAG} \
    	-X github.com/syndesisio/syndesis/install/operator/pkg.BuildDateTime=${BUILD_TIME} \
	${GO_BUILD_OPTIONS} \
    -o /out/platform-detect \
    -gcflags all=-trimpath=\${GOPATH} \
    -asmflags all=-trimpath=\${GOPATH} \

# ------------
# Runner
# ------------
FROM registry.access.redhat.com/ubi7/ubi-minimal:latest as runner

ENV OPERATOR=/usr/local/bin/syndesis-operator \
    USER_UID=1001 \
    USER_NAME=operator

# install operator binary
COPY --from=builder /out/syndesis-operator ${OPERATOR}
COPY build/bin /usr/local/bin
RUN  /usr/local/bin/user_setup
USER ${USER_UID}

# Add conf directory
ADD build/conf /conf

ENTRYPOINT ["/usr/local/bin/entrypoint", "run"]
