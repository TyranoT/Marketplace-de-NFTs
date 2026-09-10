/** Mesmo teto que o servidor devolve como `AVATAR_TOO_LARGE`. */
export const MAXIMUM_AVATAR_KB = 512

/**
 * Arquivo escolhido no navegador → `data:` URL, que é o formato que o avatar
 * guarda. O tamanho é checado antes de ler: recusar depois de converter para
 * base64 gastaria memória por um arquivo que já se sabe grande demais.
 */
export function readImageFile(file: File): Promise<string> {
  if (file.size > MAXIMUM_AVATAR_KB * 1024) {
    return Promise.reject(
      new Error(`Escolha uma imagem com menos de ${MAXIMUM_AVATAR_KB} KB.`),
    )
  }

  if (!file.type.startsWith('image/')) {
    return Promise.reject(new Error('Escolha um arquivo de imagem.'))
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'))
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
}
