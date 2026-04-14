import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('[v0] Iniciando upload de PDF...')
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const filename = formData.get('filename') as string

    console.log('[v0] Arquivo recebido:', file?.name, 'Tamanho:', file?.size)

    if (!file) {
      console.log('[v0] Erro: Nenhum arquivo fornecido')
      return NextResponse.json({ error: 'Nenhum arquivo fornecido' }, { status: 400 })
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log('[v0] Erro: BLOB_READ_WRITE_TOKEN não configurado')
      return NextResponse.json({ error: 'Configuração de storage não encontrada' }, { status: 500 })
    }

    console.log('[v0] Token do Blob encontrado, iniciando upload...')
    
    // Gera um nome único para evitar conflitos
    const timestamp = Date.now()
    const uniqueFilename = filename 
      ? `${filename.replace('.pdf', '')}_${timestamp}.pdf`
      : `${file.name.replace('.pdf', '')}_${timestamp}.pdf`
    
    console.log('[v0] Nome do arquivo:', uniqueFilename)
    
    const blob = await put(uniqueFilename, file, {
      access: 'public',
      contentType: 'application/pdf',
    })

    console.log('[v0] Upload concluído com sucesso:', blob.url)

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('[v0] Erro no upload:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: `Falha no upload: ${errorMessage}` }, { status: 500 })
  }
}
