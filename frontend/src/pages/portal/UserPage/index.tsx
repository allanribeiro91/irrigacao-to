import { type FormEvent, useState } from "react";

import {
  CalendarDays,
  Check,
  Clock3,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  Map,
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

interface UserLog {
  id: number;
  action: string;
  description: string;
  date: string;
  time: string;
  icon: "login" | "map" | "profile" | "security";
}

const initialUser: UserData = {
  name: "Allan Ribeiro",
  email: "allan.ribeiro@email.com",
  phone: "(61) 99999-9999",
  organization: "APROEST",
  position: "Usuário da plataforma",
};

const userLogs: UserLog[] = [
  {
    id: 1,
    action: "Acesso à plataforma",
    description: "Login realizado com sucesso",
    date: "15/08/2026",
    time: "15:42",
    icon: "login",
  },
  {
    id: 2,
    action: "Consulta geográfica",
    description: "Acesso ao mapa territorial do Tocantins",
    date: "15/08/2026",
    time: "15:44",
    icon: "map",
  },
  {
    id: 3,
    action: "Dados cadastrais",
    description: "Informações do perfil atualizadas",
    date: "12/08/2026",
    time: "10:16",
    icon: "profile",
  },
  {
    id: 4,
    action: "Segurança",
    description: "Senha de acesso alterada",
    date: "02/08/2026",
    time: "09:30",
    icon: "security",
  },
];

function getLogIcon(icon: UserLog["icon"]) {
  switch (icon) {
    case "map":
      return <Map size={17} />;

    case "profile":
      return <UserRound size={17} />;

    case "security":
      return <ShieldCheck size={17} />;

    default:
      return <Monitor size={17} />;
  }
}

export function UserPage() {
  const [user, setUser] = useState<UserData>(initialUser);
  const [formData, setFormData] = useState<UserData>(initialUser);
  const [editing, setEditing] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function updateField(field: keyof UserData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function cancelEditing() {
    setFormData(user);
    setEditing(false);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setUser(formData);
    setEditing(false);

    // Posteriormente:
    // await api.patch("/usuarios/me", formData);
  }

  function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const newPassword = String(data.get("newPassword") ?? "");
    const passwordConfirmation = String(data.get("passwordConfirmation") ?? "");

    if (newPassword !== passwordConfirmation) {
      return;
    }

    // Posteriormente:
    // await api.patch("/usuarios/me/senha", {
    //   currentPassword: data.get("currentPassword"),
    //   newPassword,
    // });

    form.reset();
  }

  return (
    <section className="user-page">
      <header className="user-page__header">
        <div className="user-page__title">
          <div className="user-page__title-icon" aria-hidden="true">
            <User size={20} />
          </div>

          <div>
            <span>Minha conta</span>
            <h1>Perfil do usuário</h1>
          </div>
        </div>

        <div className="user-page__status">
          <span />
          Conta ativa
        </div>
      </header>

      <div className="user-page__content">
        <div className="user-page__container">
          <section className="user-page__summary">
            <div className="user-page__avatar" aria-hidden="true">
              {initials}
            </div>

            <div className="user-page__identity">
              <span>Perfil pessoal</span>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>

            <div className="user-page__registration">
              <CalendarDays size={18} />

              <div>
                <span>Cadastrado em</span>
                <strong>20 de julho de 2026</strong>
              </div>
            </div>
          </section>

          <div className="user-page__grid">
            <section className="user-card user-card--profile">
              <header className="user-card__header">
                <div className="user-card__heading">
                  <div className="user-card__icon">
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
                    onClick={() => setEditing(true)}
                  >
                    <Pencil size={15} />
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
                    <User size={17} />

                    <input
                      id="user-name"
                      type="text"
                      value={formData.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="user-form__field">
                  <label htmlFor="user-email">E-mail</label>

                  <div className="user-form__control">
                    <Mail size={17} />

                    <input
                      id="user-email"
                      type="email"
                      value={formData.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="user-form__field">
                  <label htmlFor="user-phone">Telefone</label>

                  <div className="user-form__control">
                    <Phone size={17} />

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
                    <Monitor size={17} />

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
                    <ShieldCheck size={17} />

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
                      <Save size={16} />
                      Salvar alterações
                    </button>
                  </footer>
                )}
              </form>
            </section>

            <section className="user-card user-card--security">
              <header className="user-card__header">
                <div className="user-card__heading">
                  <div className="user-card__icon">
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
                    <LockKeyhole size={17} />

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
                      aria-label="Mostrar ou ocultar senha atual"
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
                    <LockKeyhole size={17} />

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
                      aria-label="Mostrar ou ocultar nova senha"
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
                    <Check size={17} />

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
                      aria-label="Mostrar ou ocultar confirmação"
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

                <button
                  type="submit"
                  className="user-button user-button--primary user-button--full"
                >
                  <KeyRound size={16} />
                  Alterar senha
                </button>
              </form>
            </section>

            <section className="user-card user-card--activity">
              <header className="user-card__header">
                <div className="user-card__heading">
                  <div className="user-card__icon">
                    <Clock3 size={19} />
                  </div>

                  <div>
                    <h2>Atividades recentes</h2>
                    <p>Últimos acessos e ações na plataforma.</p>
                  </div>
                </div>
              </header>

              <div className="user-activity">
                {userLogs.map((log) => (
                  <article key={log.id} className="user-activity__item">
                    <div className="user-activity__icon" aria-hidden="true">
                      {getLogIcon(log.icon)}
                    </div>

                    <div className="user-activity__information">
                      <strong>{log.action}</strong>
                      <p>{log.description}</p>
                    </div>

                    <time className="user-activity__date">
                      <strong>{log.date}</strong>
                      <span>{log.time}</span>
                    </time>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
