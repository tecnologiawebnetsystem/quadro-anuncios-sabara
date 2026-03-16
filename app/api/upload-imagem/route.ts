import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ erro: 'Nenhum arquivo fornecido' }, { status: 400 })
    }

    // Validar tipo de arquivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!tiposPermitidos.includes(file.type)) {
      return NextResponse.json({ erro: 'Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP.' }, { status: 400 })
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ erro: 'Arquivo muito grande. Máximo 5MB.' }, { status: 400 })
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const nomeArquivo = `reunioes/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const blob = await put(nomeArquivo, file, {
      access: 'public',
    })

    return NextResponse.json({ 
      url: blob.url,
      pathname: blob.pathname 
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json({ erro: 'Falha no upload da imagem' }, { status: 500 })
  }
}
