-- Criar tabela admin_profiles com RLS
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas para admin_profiles
CREATE POLICY "admin_profiles_select_own"
  ON public.admin_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "admin_profiles_insert_own"
  ON public.admin_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "admin_profiles_update_own"
  ON public.admin_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Criar trigger para auto-criar perfil de admin no cadastro
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'admin')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Criar trigger
DROP TRIGGER IF EXISTS on_auth_admin_user_created ON auth.users;

CREATE TRIGGER on_auth_admin_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_admin_user();
