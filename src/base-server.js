'use strict'

const { isIPv4 } = require('net')
const dnsPacket = require('dns-packet')
const rcodes = require('dns-packet/rcodes')

class BaseServer {
  #resolver
  #zone

  constructor (resolver, zone) {
    if (typeof resolver !== 'function') {
      throw new Error('Resolver function must be specified')
    }

    if (zone !== null && typeof zone !== 'string') {
      throw new Error('DNS zone must be specified or set to null to disable zone check')
    }

    this.#resolver = resolver
    this.#zone = zone === null ? null : zone.toLowerCase()
  }

  processMessage = async (dnsRequest) => {
    const response = {
      id: dnsRequest.id,
      type: 'response',
      flags: dnsPacket.AUTHORITATIVE_ANSWER,
      questions: dnsRequest.questions
    }

    try {
      if (dnsRequest.type !== 'query') {
        throw new Error('Only queries are supported')
      }

      response.answers = await this.#answerQuestions(dnsRequest.questions)
    } catch (e) {
      console.error('Error occurred when resolving answers', e)
      response.flags |= rcodes.toRcode(e instanceof ZoneNotAllowedError ? 'REFUSED' : 'SERVFAIL')
    }

    return response
  }

  #answerQuestions = async (questions) => {
    if (questions.some(question => question.type !== 'A' || question.class !== 'IN')) {
      throw new Error('Unsupported type/class of record requested')
    }

    if (this.#zone !== null && questions.some(question => !question.name.toLowerCase().endsWith('.' + this.#zone))) {
      throw new ZoneNotAllowedError()
    }

    const answers = await Promise.all(questions.map(this.resolve))

    return answers.flat()
  }

  resolve = async (question) => {
    let addresses = await this.#resolver(question.name.toLowerCase())

    if (!Array.isArray(addresses)) addresses = [addresses]

    return addresses.filter(isIPv4).map(data =>
      ({
        type: 'A',
        name: question.name,
        ttl: 30,
        data
      })
    )
  }
}

class ZoneNotAllowedError extends Error {
  constructor () {
    super('Requested zone is not allowed')
  }
}

module.exports = BaseServer
