import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowRight,
  Eye,
  EyeOff,
  IdCard,
  Layers3,
  LockKeyhole,
} from "lucide-react";
import { login } from "./service";
import { getApiErrorMessage } from "../../../api/client";
import { somenteNumeros } from "../../../utils/somenteNumeros";
import { formatarCpf } from "../../../utils/formatarCpf";
import { useUser } from "../../../providers/UserProvider/context";
import "./index.css";
import { AuthBackground } from "../../../components/AuthBackground";

export function LoginPage() {
  const navigate = useNavigate();
  const { setUserSession } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [coCpf, setCoCpf] = useState("");
  const [dsSenha, setDsSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro(null);
    setLoading(true);

    try {
      const resultado = await login({
        co_cpf: somenteNumeros(coCpf),
        ds_senha: dsSenha,
      });

      setUserSession(resultado);
      navigate("/portal/geografico");
    } catch (error) {
      setErro(getApiErrorMessage(error, "CPF ou senha inválidos."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <AuthBackground />

      <header className="login-header">
        <div className="login-brand">
          <div className="login-brand__symbol" aria-hidden="true">
            <Layers3 size={29} strokeWidth={1.8} />
          </div>
          <div className="login-brand__text">
            <span className="login-brand__eyebrow">
              Plano de Desenvolvimento Sustentável
            </span>
            <strong>Polo de Agricultura Irrigada</strong>
            <span>Sudoeste do Tocantins</span>
          </div>
        </div>
      </header>

      <section className="login-content" aria-label="Acesso ao Portal de Dados">
        <div className="login-card">
          <div className="login-card__accent" />
          <div className="login-card__header">
            <span className="login-card__eyebrow">Bem-vindo</span>
            <h1>Portal de Dados</h1>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="cpf">CPF</label>
              <div className="login-input">
                <IdCard size={18} aria-hidden="true" />
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  autoComplete="username"
                  value={coCpf}
                  onChange={(event) =>
                    setCoCpf(formatarCpf(event.target.value))
                  }
                  maxLength={14}
                  required
                />
              </div>
            </div>
            <div className="login-field">
              <div className="login-field__header">
                <label htmlFor="password">Senha</label>
                <Link to="/recuperar-senha">Esqueci minha senha</Link>
              </div>
              <div className="login-input">
                <LockKeyhole size={18} aria-hidden="true" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  value={dsSenha}
                  onChange={(event) => setDsSenha(event.target.value)}
                  required
                />
                <button
                  className="login-input__action"
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden="true" />
                  ) : (
                    <Eye size={18} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            {erro && (
              <div className="login-form__error" role="alert">
                {erro}
              </div>
            )}
            <button className="login-submit" type="submit" disabled={loading}>
              <span>{loading ? "Entrando..." : "Entrar"}</span>
              {!loading && <ArrowRight size={19} aria-hidden="true" />}
            </button>
          </form>
          <div className="login-register">
            <span>Ainda não possui acesso?</span>
            <Link to="/cadastro">Solicitar cadastro</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
