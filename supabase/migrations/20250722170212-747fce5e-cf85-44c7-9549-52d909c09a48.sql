-- Criar usuário admin com role de administrador
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Obter o ID do usuário admin
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@primar.com';
    
    -- Inserir role de admin se não existir
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
END $$;