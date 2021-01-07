/* tslint:disable:no-bitwise */
/* tslint:disable:max-classes-per-file */
/* tslint:disable:prefer-for-of */

const alphabet = '0123456789abcdefghjkmnpqrtuvwxyz'
const alias = { o: 0, i: 1, l: 1, s: 5 }

/**
 * Build a lookup table and memoize it
 *
 * Return an object that maps a character to its
 * byte value.
 */
let lookupTable: { [char: string]: number } | undefined
const lookup = () => {
  if (lookupTable) {
    return lookupTable
  }

  // Invert 'alphabet'
  lookupTable = {}
  for (let i = 0; i < alphabet.length; i++) {
    lookupTable[alphabet[i]] = i
  }
  // Splice in 'alias'
  for (const key in alias) {
    if (!alias.hasOwnProperty(key)) {
      continue
    }
    lookupTable[key] = lookupTable['' + (alias as any)[key]]
  }

  return lookupTable
}

class Base32Encoder {
  skip = 0 // how many bits we will skip from the first byte
  bits = 0 // 5 high bits, carry from one byte to the next

  output = ''

  // Read one byte of input
  // Should not really be used except by "update"
  readByte(byte: string | number) {
    // coerce the byte to an int
    if (typeof byte === 'string') {
      byte = byte.charCodeAt(0)
    }

    if (this.skip < 0) {
      // we have a carry from the previous byte
      this.bits |= byte >> -this.skip
    } else {
      // no carry
      this.bits = (byte << this.skip) & 248
    }

    if (this.skip > 3) {
      // not enough data to produce a character, get us another one
      this.skip -= 8
      return 1
    }

    if (this.skip < 4) {
      // produce a character
      this.output += alphabet[this.bits >> 3]
      this.skip += 5
    }

    return 0
  }

  // Flush any remaining bits left in the stream
  finish(check: boolean) {
    const output = this.output + (this.skip < 0 ? alphabet[this.bits >> 3] : '') + (check ? '$' : '')
    this.output = ''
    return output
  }

  update(input: string, flush?: boolean) {
    for (let i = 0; i < input.length; i) {
      i += this.readByte(input[i])
    }

    // consume all output
    let output = this.output
    this.output = ''
    if (flush) {
      output += this.finish(false)
    }
    return output
  }
}

class Base32Decoder {
  skip = 0 // how many bits we have from the previous character
  byte = 0 // current byte we're producing

  output = ''

  // Consume a character from the stream, store
  // the output in this.output. As before, better
  // to use update().
  readChar(char: string | number) {
    if (typeof char !== 'string') {
      if (typeof char === 'number') {
        char = String.fromCharCode(char)
      }
    }

    char = char.toLowerCase()
    let val = lookup()[char]
    if (typeof val === 'undefined') {
      // character does not exist in our lookup table
      return // skip silently. An alternative would be:
      // throw Error('Could not find character "' + char + '" in lookup table.')
    }
    val <<= 3 // move to the high bits
    this.byte |= val >>> this.skip
    this.skip += 5

    if (this.skip >= 8) {
      // we have enough to preduce output
      this.output += String.fromCharCode(this.byte)
      this.skip -= 8
      if (this.skip > 0) {
        this.byte = (val << (5 - this.skip)) & 255
      } else {
        this.byte = 0
      }
    }
  }

  finish(check: boolean) {
    const output = this.output + (this.skip < 0 ? alphabet[this.byte >> 3] : '') + (check ? '$' : '')
    this.output = ''
    return output
  }

  update(input: string, flush?: boolean) {
    for (let i = 0; i < input.length; i++) {
      this.readChar(input[i])
    }
    let output = this.output
    this.output = ''
    if (flush) {
      output += this.finish(false)
    }
    return output
  }
}

export const encodeBase32 = (input: string) => {
  const encoder = new Base32Encoder()

  return encoder.update(input, true)
}

export const decodeBase32 = (input: string) => {
  const decoder = new Base32Decoder()

  return decoder.update(input, true)
}
