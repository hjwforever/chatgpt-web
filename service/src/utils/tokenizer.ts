import { getEncoding } from 'js-tiktoken'

// TODO: make this configurable
const tokenizer = getEncoding('cl100k_base')

export function encode(input: string): Uint32Array {
  return new Uint32Array(tokenizer.encode(input))
}

export async function getTokenCount(text: string) {
  // TODO: use a better fix in the tokenizer
  text = text.replace(/<\|endoftext\|>/g, '')

  return tokenizer.encode(text).length
}
