-- Habilitar RLS na tabela equipe_tecnica
ALTER TABLE public.equipe_tecnica ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT público (leitura para todos)
CREATE POLICY "equipe_tecnica_select" ON public.equipe_tecnica
    FOR SELECT
    TO public
    USING (true);

-- Política para permitir INSERT público
CREATE POLICY "equipe_tecnica_insert" ON public.equipe_tecnica
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Política para permitir UPDATE público
CREATE POLICY "equipe_tecnica_update" ON public.equipe_tecnica
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Política para permitir DELETE público
CREATE POLICY "equipe_tecnica_delete" ON public.equipe_tecnica
    FOR DELETE
    TO public
    USING (true);
