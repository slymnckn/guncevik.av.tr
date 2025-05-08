-- Admin profilleri için tablo oluşturma
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Otomatik updated_at güncellemesi için trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_admin_profiles_updated_at ON admin_profiles;
CREATE TRIGGER update_admin_profiles_updated_at
BEFORE UPDATE ON admin_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) politikaları
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için tüm işlemlere izin veren politika
CREATE POLICY admin_all ON admin_profiles
  USING (auth.jwt() ? 'admin_access')
  WITH CHECK (auth.jwt() ? 'admin_access');

-- Kullanıcıların kendi profillerini görüntülemesine izin veren politika
CREATE POLICY users_read_own ON admin_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Kullanıcıların kendi profillerini güncellemesine izin veren politika
CREATE POLICY users_update_own ON admin_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND (
    -- Sadece belirli alanları güncelleyebilirler
    NEW.name IS NOT DISTINCT FROM OLD.name OR
    NEW.avatar_url IS NOT DISTINCT FROM OLD.avatar_url
  ));

-- İlk admin kullanıcısını oluştur (eğer yoksa)
DO $$
DECLARE
  admin_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM admin_profiles WHERE role = 'admin';
  
  IF admin_count = 0 THEN
    -- Burada bir admin kullanıcısı oluşturabilirsiniz
    -- NOT: Bu işlem için önce auth.users tablosunda bir kullanıcı oluşturmanız gerekir
    RAISE NOTICE 'Henüz admin kullanıcısı yok. Bir admin kullanıcısı oluşturmanız önerilir.';
  ELSE
    RAISE NOTICE 'Sistemde zaten % admin kullanıcısı var.', admin_count;
  END IF;
END $$;
