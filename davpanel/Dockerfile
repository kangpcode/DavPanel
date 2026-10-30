FROM --platform=linux/$TARGETARCH alpine:3.22

ARG TARGETARCH

LABEL maintainer="kangpcode@users.noreply.github.com"
LABEL author="Dhafa Nazula Permadi"

WORKDIR /

# Runtime dependencies
RUN apk add --no-cache \
    bash \
    grep \
    procps \
    coreutils \
    findutils \
    wget \
    curl \
    mariadb-client \
    zip \
    unzip \
    jq \
    openssl \
    podman \
    podman-compose \
    tzdata \
    gawk \
    tar \
    gzip \
    acl \
    attr \
    shadow \
    quota-tools \
    git \
    git-daemon \
    openssh-client


# DavCLI
COPY davcli /usr/local/bin/davcli
RUN chmod +x /usr/local/bin/davcli

# Platform-specific binaries
COPY encoded-${TARGETARCH}/ /

# Podman socket
ENV CONTAINER_HOST=unix:///run/podman/podman.sock
ENV DOCKER_HOST=unix:///run/podman/podman.sock

# Port
EXPOSE 2083

# Entrypoint
CMD ["/davpanel"]
