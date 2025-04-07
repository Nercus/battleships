import pako from 'pako'

export function useJsonCompressor() {
  function compress(jsonData: object): string {
    const jsonString = JSON.stringify(jsonData)
    const compressedData = pako.deflate(jsonString, { raw: true })
    const compressedDataString = String.fromCharCode(...compressedData)
    return btoa(compressedDataString)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }

  function decompress(compressedData: string): object {
    let base64 = compressedData
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    // Pad with "=" if missing
    while (base64.length % 4) {
      base64 += '='
    }
    const compressedDataString = atob(base64)
    const compressedDataArray = new Uint8Array(
      Array.from(compressedDataString).map(char => char.charCodeAt(0)),
    )
    const decompressedData = pako.inflate(compressedDataArray, { raw: true })
    const jsonString = String.fromCharCode(...decompressedData)
    return JSON.parse(jsonString)
  }

  return {
    compress,
    decompress,
  }
}
