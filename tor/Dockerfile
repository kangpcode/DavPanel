FROM alpine:3.22
LABEL org.opencontainers.image.title="DavPanel Tor service"
LABEL org.opencontainers.image.authors="Dhafa Nazula Permadi (kangpcode)"
RUN apk add --no-cache tor \
    && install -d -m 700 -o 0 -g 0 /var/lib/tor \
    && install -d /etc/tor \
    && printf 'SocksPort 0\n' > /etc/tor/torrc
ENTRYPOINT ["tor", "-f", "/etc/tor/torrc", "--RunAsDaemon", "0", "--DataDirectory", "/var/lib/tor"]
