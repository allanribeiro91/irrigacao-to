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
import { getHttpErrorMessage } from "../../../services/httpClient";
import { somenteNumeros } from "../../../utils/somenteNumeros";
import { formatarCpf } from "../../../utils/formatarCpf";
import { useUser } from "../../../providers/UserProvider/context";
import "./index.css";

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
      setErro(getHttpErrorMessage(error, "CPF ou senha inválidos."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-background" aria-hidden="true">
        <div className="login-background__sun" />
        <svg
          className="login-background__terrain"
          viewBox="0 0 1600 900"
          preserveAspectRatio="none"
        >
          <path
            d="M-80 690 C180 560 310 780 560 650 C790 530 930 650 1170 560 C1370 485 1510 560 1690 470"
            className="login-terrain-line login-terrain-line--blue-1"
          />
          <path
            d="M-90 735 C170 605 330 825 590 690 C815 575 990 690 1210 605 C1400 530 1515 620 1690 520"
            className="login-terrain-line login-terrain-line--blue-2"
          />
          <path
            d="M-120 785 C160 650 340 875 620 735 C855 615 1030 745 1250 660 C1435 590 1545 670 1710 575"
            className="login-terrain-line login-terrain-line--green"
          />
          <path
            d="M-70 560 C160 470 360 530 525 430 C700 325 890 385 1045 315 C1220 235 1420 290 1660 205"
            className="login-contour-line"
          />
          <path
            d="M-80 605 C190 510 355 585 555 475 C735 375 925 430 1100 355 C1280 280 1455 340 1660 260"
            className="login-contour-line"
          />
          <path
            d="M-90 650 C190 560 385 625 585 520 C770 425 960 480 1140 410 C1315 345 1480 400 1680 330"
            className="login-contour-line"
          />
        </svg>
        <div className="login-fields">
          {Array.from({ length: 6 }, (_, index) => (
            <span
              key={index}
              className={`login-fields__line login-fields__line--${index + 1}`}
            />
          ))}
        </div>
        <div className="login-map-point login-map-point--water">
          <span />
          <small>Recursos hídricos</small>
        </div>
        <div className="login-map-point login-map-point--production">
          <span />
          <small>Produção</small>
        </div>
        <div className="login-map-point login-map-point--territory">
          <span />
          <small>Território</small>
        </div>
      </div>

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
