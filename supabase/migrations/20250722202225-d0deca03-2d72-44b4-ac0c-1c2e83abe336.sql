-- Adicionar campos faltantes na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cnpj TEXT,
ADD COLUMN IF NOT EXISTS endereco TEXT,
ADD COLUMN IF NOT EXISTS cep TEXT,
ADD COLUMN IF NOT EXISTS cidade TEXT,
ADD COLUMN IF NOT EXISTS estado TEXT,
ADD COLUMN IF NOT EXISTS complemento TEXT;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_cnpj ON public.profiles(cnpj);
CREATE INDEX IF NOT EXISTS idx_profiles_ativo ON public.profiles(ativo);