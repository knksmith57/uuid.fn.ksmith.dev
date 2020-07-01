#!/usr/bin/env node
'use strict'

const express = require('express')
const app = (exports.app = express())

app.get('/v1', (req, res, next) => {
  res.locals.uuid = unsanitizedUuidToBuffer(require('uuid').v1())
  next()
})

app.get(['/', '/v4'], (req, res, next) => {
  res.locals.uuid = unsanitizedUuidToBuffer(require('uuid').v4())
  next()
})

app.get('/convert', (req, res, next) => {
  try {
    res.locals.uuid = unsanitizedUuidToBuffer(req.query.uuid)
  } catch (e) {}

  if (res.locals.uuid == null) {
    res.status(400).send(`empty or malformed UUID provided`)
    return
  }

  next()
})

app.use((req, res) => {
  const format = req.query.format || 'canonical'
  if (!Reflect.has(serdes, format)) {
    res
      .status(400)
      .send(
        `unsupported serialization format provided. supported formats: ${Object.keys(
          serdes
        ).join(', ')}`
      )
    return
  }

  try {
    const uuid = serdes[format].serialize(res.locals.uuid)
    res.status(200).send(uuid)
    return
  } catch (e) {}

  res.status(400).send(`unable to serialize to ${format} format`)
})

const serdes = {
  base32: {
    deserialize(str) {
      const { base32 } = require('rfc4648')
      return base32.parse(str, {
        loose: true,
        out: Buffer.allocUnsafe,
      })
    },

    serialize(buf) {
      const { base32 } = require('rfc4648')
      return base32.stringify(Array.from(buf), { pad: false })
    },
  },

  canonical: {
    deserialize(str) {
      str = str.split('-').join('')
      return Buffer.from(str, 'hex')
    },
    serialize(buf) {
      const str = buf.toString('hex')
      return `${str.substring(0, 8)}-${str.substring(8, 12)}-${str.substring(
        12,
        16
      )}-${str.substring(16, 20)}-${str.substring(20)}`
    },
  },

  hex: {
    deserialize(str) {
      return Buffer.from(str, 'hex')
    },
    serialize(buf) {
      return buf.toString('hex')
    },
  },
}

function unsanitizedUuidToBuffer(unsanitizedUuid) {
  if (typeof unsanitizedUuid === 'string') {
    try {
      switch (unsanitizedUuid.length) {
        case 36: // canonical (hex w/ hyphens), eg: "970e1ba9-3584-4ea6-ab40-b8103d64757f"
          return serdes.canonical.deserialize(unsanitizedUuid)
        case 32: // hex, eg: "970e1ba935844ea6ab40b8103d64757f"
          return serdes.hex.deserialize(unsanitizedUuid)
        case 26: // base32, eg: "S4HBXKJVQRHKNK2AXAID2ZDVP4"
          return serdes.base32.deserialize(unsanitizedUuid)
      }
    } catch (e) {
      console.error(e)
    }
  }
  return null
}

if (require.main === module) {
  const { PORT: port = 8080 } = process.env
  app.listen(port)
}
