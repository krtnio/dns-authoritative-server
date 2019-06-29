'use strict'

const dgram = require('dgram')
const dnsPacket = require('dns-packet')
const BaseServer = require('./base-server')

class UDPServer extends BaseServer {
  socket

  constructor (resolver, zone) {
    super(resolver, zone)

    this.socket = dgram.createSocket('udp4')

    this.socket.on('message', this.handleMessage)
    this.socket.on('error', error => console.error('error', error)) // TODO handle errors
  }

  handleMessage = async (message, rinfo) => {
    const dnsRequest = dnsPacket.decode(message)
    const response = await this.processMessage(dnsRequest)
    const buffer = dnsPacket.encode(response)
    this.socket.send(buffer, 0, buffer.length, rinfo.port, rinfo.address)
  }

  start (port = 53, addr) {
    if (addr) {
      this.socket.bind(port, addr)
    } else {
      this.socket.bind(port)
    }
  }
}

module.exports = UDPServer
