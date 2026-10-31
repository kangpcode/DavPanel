FROM alpine:3.22
LABEL org.opencontainers.image.title="DavPanel Tor service"
LABEL org.opencontainers.image.authors="Dhafa Nazula Permadi (kangpcode)"
RUN apk add --no-cache tor && install -d -m 700 /var/lib/tor
ENTRYPOINT ["tor", "-f", "/etc/tor/torrc", "--RunAsDaemon", "0", "--DataDirectory", "/var/lib/tor"]
