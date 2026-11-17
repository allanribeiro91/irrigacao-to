import "./index.css";

export function AuthBackground() {
  return (
    <div className="auth-background" aria-hidden="true">
      <div className="auth-background__sun" />

      <svg
        className="auth-background__terrain"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
      >
        <path
          d="M-80 690 C180 560 310 780 560 650 C790 530 930 650 1170 560 C1370 485 1510 560 1690 470"
          className="auth-terrain-line auth-terrain-line--blue-1"
        />
        <path
          d="M-90 735 C170 605 330 825 590 690 C815 575 990 690 1210 605 C1400 530 1515 620 1690 520"
          className="auth-terrain-line auth-terrain-line--blue-2"
        />
        <path
          d="M-120 785 C160 650 340 875 620 735 C855 615 1030 745 1250 660 C1435 590 1545 670 1710 575"
          className="auth-terrain-line auth-terrain-line--green"
        />
        <path
          d="M-70 560 C160 470 360 530 525 430 C700 325 890 385 1045 315 C1220 235 1420 290 1660 205"
          className="auth-contour-line"
        />
        <path
          d="M-80 605 C190 510 355 585 555 475 C735 375 925 430 1100 355 C1280 280 1455 340 1660 260"
          className="auth-contour-line"
        />
        <path
          d="M-90 650 C190 560 385 625 585 520 C770 425 960 480 1140 410 C1315 345 1480 400 1680 330"
          className="auth-contour-line"
        />
      </svg>

      <div className="auth-fields">
        {Array.from({ length: 6 }, (_, index) => (
          <span
            key={index}
            className={`auth-fields__line auth-fields__line--${index + 1}`}
          />
        ))}
      </div>

      <div className="auth-map-point auth-map-point--water">
        <span />
        <small>Recursos hídricos</small>
      </div>

      <div className="auth-map-point auth-map-point--production">
        <span />
        <small>Produção</small>
      </div>

      <div className="auth-map-point auth-map-point--territory">
        <span />
        <small>Território</small>
      </div>
    </div>
  );
}
