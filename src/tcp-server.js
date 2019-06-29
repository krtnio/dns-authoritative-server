'use strict'

const net = require('net')
const dnsPacket = require('dns-packet')
const BaseServer = require('./base-server')

class TCPServer extends BaseServer {
  server

  constructor (resolver, zone) {
    super(resolver, zone)

    this.server = net.createServer()

    this.server.on('connection', (socket) => {
      socket.on('data', (message) => this.handleMessage(message, socket))
    })
    this.server.on('error', error => console.error('error', error)) // TODO handle errors
  }

  handleMessage = async (message, socket) => {
    const dnsRequest = dnsPacket.streamDecode(message)
    const response = await this.processMessage(dnsRequest)
    const buffer = dnsPacket.streamEncode(response)
    socket.end(buffer)
  }

  start (port = 53, addr) {
    if (addr) {
      this.server.listen(port, addr)
    } else {
      this.server.listen(port)
    }
  }
}

module.exports = TCPServer
