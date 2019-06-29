declare module 'dns-authoritative-server' {
  type Resolver = (name: string) => Promise<string>

  interface Server {
    start (port?: number, hostname?: string)
  }

  class TCPServer implements Server {
    constructor (resolver: Resolver, zone?: string)

    start (port?: number, hostname?: string)
  }

  class UDPServer implements Server {
    constructor (resolver: Resolver, zone?: string)

    start (port?: number, hostname?: string)
  }
}
