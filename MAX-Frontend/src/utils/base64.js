export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (let index = 0; index < bytes.length; index += 0x8000) {
    const chunk = bytes.subarray(index, index + 0x8000);
    binary += Array.from(chunk, (byte) => String.fromCharCode(byte)).join('');
  }

  return btoa(binary);
}
