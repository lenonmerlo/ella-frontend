import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { http } from "../lib/http";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, loadProfile } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    // Preencher form com dados do usuário
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setAddress(user.address || "");
    setBirthDate(user.birthDate || "");

    // Se houver avatar persistido, usa como preview inicial
    setAvatarPreview(user.avatarDataUrl || null);
  }, [user, navigate]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setAvatarPreview(evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Atualizar dados do usuário
      await http.put(`/users/${user?.id}`, {
        name,
        email,
        phone,
        address,
        birthDate,
      });

      // Se houver avatar, fazer upload separado
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);

        await http.post(`/users/${user?.id}/avatar`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess("Perfil atualizado com sucesso!");

      // Atualizar state local imediatamente
      setName(name);
      setEmail(email);
      setPhone(phone);
      setAddress(address);
      setBirthDate(birthDate);

      // Recarregar perfil após atualização (com tratamento de erro)
      setTimeout(() => {
        loadProfile().catch(() => {
          // Se falhar ao recarregar, manter dados atualizados localmente
          console.log("Perfil local atualizado, reload do servidor falhou");
        });
      }, 500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao atualizar perfil";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm("Tem certeza que deseja deletar sua conta? Esta ação é irreversível.")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await http.delete(`/users/${user?.id}`);
      setSuccess("Conta deletada com sucesso. Redirecionando...");
      setTimeout(() => {
        logout();
        navigate("/auth/login");
      }, 1000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao deletar conta";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return null;
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "E";

  return (
    <div className="bg-ella-background min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-ella-navy text-3xl font-semibold">Configurações</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-ella-subtile hover:text-ella-navy text-sm font-medium"
          >
            ← Voltar
          </button>
        </div>

        {/* Avatar Section */}
        <section className="ella-glass border-ella-muted rounded-2xl border p-6">
          <h2 className="text-ella-navy mb-4 text-lg font-semibold">Foto de Perfil</h2>

          <div className="flex items-center gap-6">
            <div className="bg-ella-gold flex h-24 w-24 items-center justify-center overflow-hidden rounded-full text-2xl font-medium text-white">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="flex-1">
              <label className="block">
                <span className="sr-only">Escolher arquivo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="text-ella-subtile file:bg-ella-gold block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:brightness-110"
                />
              </label>
              <p className="text-ella-subtile mt-2 text-xs">PNG, JPG ou GIF (máx. 5MB)</p>
            </div>
          </div>
        </section>

        {/* Profile Information */}
        <section className="ella-glass border-ella-muted rounded-2xl border p-6">
          <h2 className="text-ella-navy mb-4 text-lg font-semibold">Informações Pessoais</h2>

          <form className="space-y-4" onSubmit={handleUpdateProfile}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-ella-subtile text-xs font-medium uppercase">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-ella-muted focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ella-subtile text-xs font-medium uppercase">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-ella-muted focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ella-subtile text-xs font-medium uppercase">Telefone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="border-ella-muted focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ella-subtile text-xs font-medium uppercase">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="border-ella-muted focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-ella-subtile text-xs font-medium uppercase">Endereço</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, complemento"
                className="border-ella-muted focus:border-ella-gold focus:ring-ella-gold w-full rounded-lg border px-3 py-2 text-sm focus:ring-1"
              />
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}
            {success && <div className="text-sm text-emerald-600">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="bg-ella-gold text-ella-navy w-full rounded-lg px-4 py-2 text-sm font-medium hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="ella-glass rounded-2xl border border-red-200 bg-red-50/30 p-6">
          <h2 className="mb-4 text-lg font-semibold text-red-700">Zona de Perigo</h2>

          <p className="mb-4 text-sm text-red-600">
            Ao deletar sua conta, todos os seus dados serão permanentemente removidos. Esta ação não
            pode ser desfeita.
          </p>

          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="w-full rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {loading ? "Deletando..." : "Deletar Minha Conta"}
          </button>
        </section>
      </div>
    </div>
  );
}
