import { useState, type FormEvent } from "react";

import {
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  Monitor,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  User,
  UserRound,
  X,
} from "lucide-react";

import "./index.css";

interface UserData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
}

// Dados demonstrativos: substituir pela consulta à API / UserProvider.
const initialUser: UserData = {
  name: "Usuário da plataforma",
  email: "usuario@exemplo.com",
  phone: "(63) 99999-9999",
  organization: "APROEST",
  position: "Usuário da plataforma",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "US";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function UserPage() {
  const [user, setUser] = useState<UserData>(initialUser);
  const [formData, setFormData] = useState<UserData>(initialUser);
  const [editing, setEditing] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  function updateField(field: keyof UserData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function startEditing() {
    setFormData({ ...user });
    setEditing(true);
  }

  function cancelEditing() {
    setFormData({ ...user });
    setEditing(false);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Atualização apenas local, enquanto o endpoint de perfil não é integrado.
    setUser({ ...formData });
    setEditing(false);
  }

  function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const newPassword = String(data.get("newPassword") ?? "");
    const passwordConfirmation = String(data.get("passwordConfirmation") ?? "");

    if (newPassword !== passwordConfirmation) {
      setPasswordMessage("A nova senha e sua confirmação não coincidem.");
      return;
    }

    // A alteração da senha exige integração futura com o backend.
    // Não apresentar sucesso nem limpar o formulário até essa integração.
    setPasswordMessage(
      "A alteração de senha ainda não está disponível nesta versão.",
    );
  }

  return (
    <section className="user-page">
      <div className="user-page__content">
        <div className="user-page__container">
          <section className="user-page__summary" aria-label="Resumo do perfil">
            <div className="user-page__avatar" aria-hidden="true">
              {getInitials(user.name)}
            </div>

            <div className="user-page__identity">
              <span>Meus dados</span>
              <h1>{user.name}</h1>
              <p>{user.email}</p>
            </div>
          </section>

          <div className="user-page__grid">
            <section className="user-card user-card--profile">
              <header className="user-card__header">
                <div className="user-card__heading">
                  <div className="user-card__icon" aria-hidden="true">
                    <UserRound size={19} />
                  </div>
                  <div>
                    <h2>Dados de identificação</h2>
                    <p>Informações pessoais e institucionais.</p>
                  </div>
                </div>

                {!editing ? (
                  <button
                    type="button"
                    className="user-button user-button--secondary"
                    onClick={startEditing}
                  >
                    <Pencil size={15} aria-hidden="true" />
                    Editar
                  </button>
                ) : (
                  <button
                    type="button"
                    className="user-card__close-editing"
                    onClick={cancelEditing}
                    aria-label="Cancelar edição"
                    title="Cancelar edição"
                  >
                    <X size={18} />
                  </button>
                )}
              </header>

              <form className="user-form" onSubmit={saveProfile}>
                <div className="user-form__field user-form__field--full">
                  <label htmlFor="user-name">Nome completo</label>
                  <div className="user-form__control">
                    <User size={17} aria-hidden="true" />
                    <input
                      id="user-name"
                      type="text"
                      value={formData.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      disabled={!editing}
                      required
                    />
                  </div>
                </div>

                <div className="user-form__field">
                  <label htmlFor="user-email">E-mail</label>
                  <div className="user-form__control">
                    <Mail size={17} aria-hidden="true" />
                    <input
                      id="user-email"
                      type="email"
                      value={formData.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      disabled={!editing}
                      required
                    />
                  </div>
                </div>

                <div className="user-form__field">
                  <label htmlFor="user-phone">Telefone</label>
                  <div className="user-form__control">
                    <Phone size={17} aria-hidden="true" />
                    <input
                      id="user-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="user-form__field">
                  <label htmlFor="user-organization">Instituição</label>
                  <div className="user-form__control">
                    <Monitor size={17} aria-hidden="true" />
                    <input
                      id="user-organization"
                      type="text"
                      value={formData.organization}
                      onChange={(event) =>
                        updateField("organization", event.target.value)
                      }
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="user-form__field">
                  <label htmlFor="user-position">Perfil</label>
                  <div className="user-form__control">
                    <ShieldCheck size={17} aria-hidden="true" />
                    <input
                      id="user-position"
                      type="text"
                      value={formData.position}
                      onChange={(event) =>
                        updateField("position", event.target.value)
                      }
                      disabled={!editing}
                    />
                  </div>
                </div>

                {editing && (
                  <footer className="user-form__actions">
                    <button
                      type="button"
                      className="user-button user-button--secondary"
                      onClick={cancelEditing}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="user-button user-button--primary"
                    >
                      <Save size={16} aria-hidden="true" />
                      Salvar alterações
                    </button>
                  </footer>
                )}
              </form>
            </section>

            <section className="user-card user-card--security">
              <header className="user-card__header">
                <div className="user-card__heading">
                  <div className="user-card__icon" aria-hidden="true">
                    <KeyRound size={19} />
                  </div>
                  <div>
                    <h2>Alterar senha</h2>
                    <p>Atualize sua senha de acesso.</p>
                  </div>
                </div>
              </header>

              <form className="user-password-form" onSubmit={changePassword}>
                <div className="user-form__field">
                  <label htmlFor="current-password">Senha atual</label>
                  <div className="user-form__control">
                    <LockKeyhole size={17} aria-hidden="true" />
                    <input
                      id="current-password"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="user-form__password-toggle"
                      onClick={() =>
                        setShowCurrentPassword((current) => !current)
                      }
                      aria-label={
                        showCurrentPassword
                          ? "Ocultar senha atual"
                          : "Mostrar senha atual"
                      }
                      aria-pressed={showCurrentPassword}
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="user-form__field">
                  <label htmlFor="new-password">Nova senha</label>
                  <div className="user-form__control">
                    <LockKeyhole size={17} aria-hidden="true" />
                    <input
                      id="new-password"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="user-form__password-toggle"
                      onClick={() => setShowNewPassword((current) => !current)}
                      aria-label={
                        showNewPassword
                          ? "Ocultar nova senha"
                          : "Mostrar nova senha"
                      }
                      aria-pressed={showNewPassword}
                    >
                      {showNewPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="user-form__field">
                  <label htmlFor="password-confirmation">
                    Confirmar nova senha
                  </label>
                  <div className="user-form__control">
                    <Check size={17} aria-hidden="true" />
                    <input
                      id="password-confirmation"
                      name="passwordConfirmation"
                      type={showPasswordConfirmation ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="user-form__password-toggle"
                      onClick={() =>
                        setShowPasswordConfirmation((current) => !current)
                      }
                      aria-label={
                        showPasswordConfirmation
                          ? "Ocultar confirmação da senha"
                          : "Mostrar confirmação da senha"
                      }
                      aria-pressed={showPasswordConfirmation}
                    >
                      {showPasswordConfirmation ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <p className="user-password-form__hint">
                  Utilize pelo menos oito caracteres.
                </p>

                {passwordMessage && (
                  <p className="user-password-form__message" role="status">
                    {passwordMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="user-button user-button--primary user-button--full"
                >
                  <KeyRound size={16} aria-hidden="true" />
                  Alterar senha
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
