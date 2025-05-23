import pako from 'pako'

export function useCompression() {
  function compress(data: string): string {
    try {
      const compressedData = pako.deflate(data, { raw: true })
      const compressedDataString = String.fromCharCode(...compressedData)
      return btoa(compressedDataString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
    }
    catch (error) {
      console.error('Error compressing JSON data:', error)
      return ''
    }
  }

  function decompress(data: string): string {
    try {
      let base64 = data
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
      return String.fromCharCode(...decompressedData)
    }
    catch (error) {
      console.error('Error decompressing JSON data:', error)
      return ''
    }
  }

  return {
    compress,
    decompress,
  }
}
