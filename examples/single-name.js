const { TCPServer, UDPServer } = require('..')

const zone = 'myzone'

async function resolver (name) {
  console.log(`Resolving ${name}`)
  return name === `example.${zone}` ? '1.1.1.1' : null
}

const udpServer = new UDPServer(resolver, zone)
udpServer.start(53)

const tcpServer = new TCPServer(resolver, zone)
tcpServer.start(53)
