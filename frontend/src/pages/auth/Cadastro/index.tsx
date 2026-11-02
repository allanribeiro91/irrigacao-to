import { useMemo, useState, type FormEvent } from "react";

import { Link, useNavigate } from "react-router";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Layers3,
  LockKeyhole,
  Mail,
  Phone,
  User,
  BadgeCheck,
} from "lucide-react";

import "./index.css";

import type { CadastroForm } from "./type";
import { initialForm } from "./type";
import { criarUsuario } from "./service";
import { CustomFeedback } from "../../../components/CustomFeedback";

function somenteNumeros(value: string) {
  return value.replace(/\D/g, "");
}

function formatarCpf(value: string) {
  const numeros = somenteNumeros(value).slice(0, 11);

  return numeros
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatarCelular(value: string) {
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

  const [form, setForm] = useState<CadastroForm>(initialForm);
  const [cadastroConcluido, setCadastroConcluido] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  function updateField<K extends keyof CadastroForm>(
    field: K,
    value: CadastroForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  const passwordsMatch = useMemo(() => {
    if (!form.ds_senha || !form.confirmar_senha) {
      return null;
    }

    return form.ds_senha === form.confirmar_senha;
  }, [form.ds_senha, form.confirmar_senha]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.ds_senha !== form.confirmar_senha) {
      return;
    }

    const celular = somenteNumeros(form.ds_celular);

    const payload = {
      co_cpf: somenteNumeros(form.co_cpf),
      no_nome: form.no_nome.trim(),
      ds_email: form.ds_email.trim(),
      ds_celular: celular || null,
      ds_senha: form.ds_senha,
    };

    try {
      await criarUsuario(payload);

      setCadastroConcluido(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="register-page">
      <div className="register-background" aria-hidden="true">
        <div className="register-background__sun" />

        <svg
          className="register-background__terrain"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
        >
          <path
            d="M-80 680 C160 560 320 750 560 630 C800 510 970 660 1190 560 C1380 475 1530 560 1690 470"
            className="register-terrain-line register-terrain-line--blue"
          />

          <path
            d="M-90 735 C180 600 345 810 605 680 C840 565 1010 700 1235 610 C1420 535 1540 620 1690 530"
            className="register-terrain-line register-terrain-line--green"
          />

          <path
            d="M-90 560 C170 470 350 540 540 430 C710 335 890 390 1060 320 C1240 245 1430 300 1660 210"
            className="register-contour-line"
          />

          <path
            d="M-100 610 C180 510 370 590 575 475 C755 375 950 430 1120 360 C1300 290 1470 345 1680 265"
            className="register-contour-line"
          />

          <path
            d="M-110 660 C190 565 400 630 610 525 C790 435 980 490 1160 420 C1340 355 1500 405 1690 335"
            className="register-contour-line"
          />
        </svg>
      </div>

      <header className="register-header">
        <Link className="register-brand" to="/">
          <div className="register-brand__symbol" aria-hidden="true">
            <Layers3 size={28} strokeWidth={1.8} />
          </div>

          <div className="register-brand__text">
            <span>Plano de Desenvolvimento Sustentável</span>
            <strong>Polo de Agricultura Irrigada</strong>
            <small>Sudoeste do Tocantins</small>
          </div>
        </Link>

        <Link className="register-header__back" to="/">
          <ArrowLeft size={16} />
          Voltar para o acesso
        </Link>
      </header>

      <section className="register-content">
        <div className="register-presentation">
          <span className="register-presentation__eyebrow">
            Portal de Dados
          </span>

          <h1>
            Crie seu acesso à<span> inteligência territorial.</span>
          </h1>

          <p>
            Cadastre suas informações para acessar mapas, indicadores, análises
            territoriais e dados estratégicos do Polo.
          </p>

          <div className="register-benefits">
            <div className="register-benefit">
              <div className="register-benefit__icon">
                <Check size={16} />
              </div>

              <div>
                <strong>Dados integrados</strong>
                <span>
                  Informações territoriais, produtivas e socioeconômicas.
                </span>
              </div>
            </div>

            <div className="register-benefit">
              <div className="register-benefit__icon">
                <Check size={16} />
              </div>

              <div>
                <strong>Ambiente geográfico</strong>
                <span>
                  Mapas, camadas e análises espaciais em uma única plataforma.
                </span>
              </div>
            </div>

            <div className="register-benefit">
              <div className="register-benefit__icon">
                <Check size={16} />
              </div>

              <div>
                <strong>Planejamento territorial</strong>
                <span>
                  Informações estruturadas para apoiar decisões e monitoramento.
                </span>
              </div>
            </div>
          </div>
        </div>

        <section className="register-card">
          <div className="register-card__accent" />

          <div className="register-card__header">
            <span>Solicitação de acesso</span>

            <h2>Criar cadastro</h2>

            <p>Preencha seus dados para criar uma conta no Portal de Dados.</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-field register-field--full">
              <label htmlFor="nome">Nome completo</label>

              <div className="register-input">
                <User size={18} aria-hidden="true" />

                <input
                  id="nome"
                  name="no_nome"
                  type="text"
                  placeholder="Informe seu nome completo"
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
                  <BadgeCheck size={18} aria-hidden="true" />

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
                    required
                  />
                </div>
              </div>

              <div className="register-field">
                <label htmlFor="celular">Celular</label>

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
                    required
                  />
                </div>
              </div>
            </div>

            <div className="register-field register-field--full">
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
                    placeholder="Digite uma senha"
                    autoComplete="new-password"
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
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="register-field">
                <label htmlFor="confirmar-senha">Confirmar senha</label>

                <div
                  className={[
                    "register-input",
                    passwordsMatch === false ? "register-input--error" : "",
                    passwordsMatch === true ? "register-input--success" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <LockKeyhole size={18} aria-hidden="true" />

                  <input
                    id="confirmar-senha"
                    name="confirmar_senha"
                    type={showPasswordConfirmation ? "text" : "password"}
                    placeholder="Repita a senha"
                    autoComplete="new-password"
                    value={form.confirmar_senha}
                    onChange={(event) =>
                      updateField("confirmar_senha", event.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    className="register-input__action"
                    aria-label={
                      showPasswordConfirmation
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                    onClick={() =>
                      setShowPasswordConfirmation((current) => !current)
                    }
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {passwordsMatch === false && (
                  <span className="register-field__error">
                    As senhas não coincidem.
                  </span>
                )}

                {passwordsMatch === true && (
                  <span className="register-field__success">
                    As senhas coincidem.
                  </span>
                )}
              </div>
            </div>

            <div className="register-password-hint">
              <span>Sua senha deve conter pelo menos 8 caracteres.</span>
            </div>

            <button
              className="register-submit"
              type="submit"
              disabled={passwordsMatch === false}
            >
              <span>Criar cadastro</span>
              <ArrowRight size={19} />
            </button>
          </form>

          <div className="register-login">
            <span>Já possui uma conta?</span>
            <Link to="/">Entrar</Link>
          </div>
        </section>
      </section>

      <footer className="register-footer">
        <div>
          <span>APROEST</span>
          <i />
          <span>UFT</span>
          <i />
          <span>OPAJE</span>
        </div>

        <span>Desenvolvimento sustentável e inteligência territorial</span>
      </footer>

      <CustomFeedback
        open={cadastroConcluido}
        type="success"
        title="Cadastro realizado com sucesso"
        message="Seu usuário foi criado e já está disponível para acesso. Clique em Ok para ir para a tela de login."
        confirmText="Ok"
        onConfirm={() => navigate("/")}
      />
    </main>
  );
}
