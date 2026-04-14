import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const filename = formData.get('filename') as string

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo fornecido' }, { status: 400 })
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Configuração de storage não encontrada' }, { status: 500 })
    }
    
    const blob = await put(filename || file.name, file, {
      access: 'public',
      contentType: 'application/pdf',
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Erro no upload:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: `Falha no upload: ${errorMessage}` }, { status: 500 })
  }
}
