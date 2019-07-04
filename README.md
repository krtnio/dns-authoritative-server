# DNS Authoritative Server

## Installation
```bash
$ yarn add @krtn/dns-authoritative-server
```

## Usage

```js
const { TCPServer, UDPServer } = require('@krtn/dns-authoritative-server')

// (optional) restrict responder to handle only specific DNS zone
const zone = 'myzone'

// resolve IP address for the DNS name being requested
async function resolver (name) {
  console.log(`Resolving ${name}`)
  return name === `example.${zone}` ? '1.1.1.1' : null
}

// start UDP listener
const udpServer = new UDPServer(resolver, zone)
udpServer.start(53)

// start TCP listener
const tcpServer = new TCPServer(resolver, zone)
tcpServer.start(53)
```
