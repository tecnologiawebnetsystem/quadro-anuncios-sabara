import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] API upload-pdf: Iniciando processamento...')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const filename = formData.get('filename') as string

    console.log('[v0] API upload-pdf: file recebido:', file ? `${file.name} (${file.size} bytes)` : 'null')
    console.log('[v0] API upload-pdf: filename:', filename)

    if (!file) {
      console.error('[v0] API upload-pdf: Nenhum arquivo fornecido')
      return NextResponse.json({ error: 'Nenhum arquivo fornecido' }, { status: 400 })
    }

    // Verifica se BLOB_READ_WRITE_TOKEN está configurado
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('[v0] API upload-pdf: BLOB_READ_WRITE_TOKEN não configurado')
      return NextResponse.json({ error: 'Configuração de storage não encontrada' }, { status: 500 })
    }

    console.log('[v0] API upload-pdf: Enviando para Vercel Blob...')
    
    const blob = await put(filename || file.name, file, {
      access: 'public',
      contentType: 'application/pdf',
    })

    console.log('[v0] API upload-pdf: Upload concluído, URL:', blob.url)

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('[v0] API upload-pdf: Erro no upload:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: `Falha no upload: ${errorMessage}` }, { status: 500 })
  }
}
