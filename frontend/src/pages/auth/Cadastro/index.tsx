import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  IdCard,
  Layers3,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import type { CadastroForm } from "./type";
import { initialForm } from "./type";
import { criarUsuario } from "./service";
import { CustomFeedback } from "../../../components/CustomFeedback";
import { somenteNumeros } from "../../../utils/somenteNumeros";
import { formatarCpf } from "../../../utils/formatarCpf";
import { getApiErrorMessage } from "../../../api/client";

import "./index.css";
import { AuthBackground } from "../../../components/AuthBackground";

function formatarCelular(value: string): string {
  const numeros = somenteNumeros(value).slice(0, 11);

  if (numeros.length <= 10) {
    return numeros
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return numeros
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function CadastroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CadastroForm>({ ...initialForm });
  const [cadastroConcluido, setCadastroConcluido] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMismatch =
    form.confirmar_senha.length > 0 && form.ds_senha !== form.confirmar_senha;

  function updateField<K extends keyof CadastroForm>(
    field: K,
    value: CadastroForm[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    if (form.ds_senha !== form.confirmar_senha) {
      setError("As senhas informadas não coincidem.");
      return;
    }

    if (form.ds_senha.length < 8) {
      setError("A senha deve conter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await criarUsuario({
        co_cpf: somenteNumeros(form.co_cpf),
        no_nome: form.no_nome.trim(),
        ds_email: form.ds_email.trim(),
        ds_celular: somenteNumeros(form.ds_celular) || null,
        ds_senha: form.ds_senha,
      });

      setCadastroConcluido(true);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Não foi possível concluir o cadastro."),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <AuthBackground />

      <header className="register-header">
        <Link className="register-brand" to="/login">
          <span className="register-brand__symbol" aria-hidden="true">
            <Layers3 size={27} strokeWidth={1.8} />
          </span>
          <span className="register-brand__text">
            <small>Plano de Desenvolvimento Sustentável</small>
            <strong>Polo de Agricultura Irrigada</strong>
            <span>Sudoeste do Tocantins</span>
          </span>
        </Link>
        <Link className="register-header__back" to="/login">
          <ArrowLeft size={16} />
          Voltar ao login
        </Link>
      </header>

      <section
        className="register-content"
        aria-label="Cadastro no Portal de Dados"
      >
        <div className="register-card">
          <div className="register-card__accent" />
          <header className="register-card__header">
            <span>PORTAL DE DADOS</span>
            <h1>Criar cadastro</h1>
            <p>Informe seus dados para acessar a plataforma.</p>
          </header>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-field">
              <label htmlFor="nome">Nome completo</label>
              <div className="register-input">
                <UserRound size={18} aria-hidden="true" />
                <input
                  id="nome"
                  name="no_nome"
                  type="text"
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  value={form.no_nome}
                  onChange={(event) =>
                    updateField("no_nome", event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="register-form__row">
              <div className="register-field">
                <label htmlFor="cpf">CPF</label>
                <div className="register-input">
                  <IdCard size={18} aria-hidden="true" />
                  <input
                    id="cpf"
                    name="co_cpf"
                    type="text"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    autoComplete="off"
                    value={form.co_cpf}
                    onChange={(event) =>
                      updateField("co_cpf", formatarCpf(event.target.value))
                    }
                    maxLength={14}
                    required
                  />
                </div>
              </div>
              <div className="register-field">
                <label htmlFor="celular">
                  Celular <span className="register-optional">(opcional)</span>
                </label>
                <div className="register-input">
                  <Phone size={18} aria-hidden="true" />
                  <input
                    id="celular"
                    name="ds_celular"
                    type="tel"
                    inputMode="tel"
                    placeholder="(63) 99999-9999"
                    autoComplete="tel"
                    value={form.ds_celular}
                    onChange={(event) =>
                      updateField(
                        "ds_celular",
                        formatarCelular(event.target.value),
                      )
                    }
                    maxLength={15}
                  />
                </div>
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="email">E-mail</label>
              <div className="register-input">
                <Mail size={18} aria-hidden="true" />
                <input
                  id="email"
                  name="ds_email"
                  type="email"
                  placeholder="nome@instituicao.br"
                  autoComplete="email"
                  value={form.ds_email}
                  onChange={(event) =>
                    updateField("ds_email", event.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="register-form__row">
              <div className="register-field">
                <label htmlFor="senha">Senha</label>
                <div className="register-input">
                  <LockKeyhole size={18} aria-hidden="true" />
                  <input
                    id="senha"
                    name="ds_senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo de 8 caracteres"
                    autoComplete="new-password"
                    minLength={8}
                    value={form.ds_senha}
                    onChange={(event) =>
                      updateField("ds_senha", event.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    className="register-input__action"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="register-field">
                <label htmlFor="confirmar-senha">Confirmar senha</label>
                <div
                  className={`register-input${passwordsMismatch ? " register-input--error" : ""}`}
                >
                  <LockKeyhole size={18} aria-hidden="true" />
                  <input
                    id="confirmar-senha"
                    name="confirmar_senha"
                    type={showPasswordConfirmation ? "text" : "password"}
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                    value={form.confirmar_senha}
                    onChange={(event) =>
                      updateField("confirmar_senha", event.target.value)
                    }
                    aria-invalid={passwordsMismatch}
                    aria-describedby={
                      passwordsMismatch ? "register-password-error" : undefined
                    }
                    required
                  />
                  <button
                    type="button"
                    className="register-input__action"
                    aria-label={
                      showPasswordConfirmation
                        ? "Ocultar confirmação"
                        : "Mostrar confirmação"
                    }
                    aria-pressed={showPasswordConfirmation}
                    onClick={() =>
                      setShowPasswordConfirmation((value) => !value)
                    }
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {passwordsMismatch && (
                  <span
                    className="register-field__error"
                    id="register-password-error"
                  >
                    As senhas não coincidem.
                  </span>
                )}
              </div>
            </div>

            {error && (
              <p className="register-form__error" role="alert">
                {error}
              </p>
            )}

            <button
              className="register-submit"
              type="submit"
              disabled={loading || passwordsMismatch}
            >
              {loading ? "Cadastrando..." : "Criar cadastro"}
              {!loading && <ArrowRight size={18} aria-hidden="true" />}
            </button>
          </form>

          <div className="register-login">
            Já possui uma conta? <Link to="/login">Entrar</Link>
          </div>
        </div>
      </section>

      <CustomFeedback
        open={cadastroConcluido}
        type="success"
        title="Cadastro realizado com sucesso"
        message="Seu usuário foi criado e já está disponível para acesso. Clique em Ok para ir para a tela de login."
        confirmText="Ok"
        onConfirm={() => navigate("/login")}
      />
    </main>
  );
}
