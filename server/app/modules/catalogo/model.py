from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import BigInteger, Date, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

class CatalogoDado(Base):
    __tablename__ = "tb_catalogo_dado"
    __table_args__ = {"schema": "scportaldados"}

    # Chave primária
    CO_SEQ_CATALOGO_DADO: Mapped[int] = mapped_column("co_seq_catalogo_dado",BigInteger,primary_key=True,autoincrement=True)

    # Identificação e classificação
    NO_CONJUNTO_DADO: Mapped[str] = mapped_column("no_conjunto_dado",String(255))
    DS_DESCRICAO: Mapped[str] = mapped_column("ds_descricao",Text)
    CO_TP_DADO: Mapped[int] = mapped_column("co_tp_dado",BigInteger)
    CO_TEMA: Mapped[int | None] = mapped_column("co_tema",BigInteger)

    # Procedência e acesso
    NO_FONTE: Mapped[str] = mapped_column("no_fonte",String(200))
    DS_ORIGEM: Mapped[str | None] = mapped_column("ds_origem",String(255))
    DS_IDENTIFICADOR_ORIGEM: Mapped[str | None] = mapped_column("ds_identificador_origem",String(255))
    DS_URL_FONTE: Mapped[str | None] = mapped_column("ds_url_fonte",Text)
    DS_URL_ACESSO: Mapped[str | None] = mapped_column("ds_url_acesso",Text)
    NO_FORMATO: Mapped[str | None] = mapped_column("no_formato",String(50))
    DS_LICENCA: Mapped[str | None] = mapped_column("ds_licenca",Text)

    # Atualização e referência dos dados
    CO_PERIODICIDADE: Mapped[int | None] = mapped_column("co_periodicidade",BigInteger)
    DT_ULTIMA_BUSCA: Mapped[datetime | None] = mapped_column("dt_ultima_busca",DateTime(timezone=True))
    DT_ATUALIZACAO_FONTE: Mapped[date | None] = mapped_column("dt_atualizacao_fonte",Date)
    DT_REFERENCIA_INICIO: Mapped[date | None] = mapped_column("dt_referencia_inicio",Date)
    DT_REFERENCIA_FIM: Mapped[date | None] = mapped_column("dt_referencia_fim",Date)

    # Cobertura e interpretação
    DS_ABRANGENCIA_TERRITORIAL: Mapped[str | None] = mapped_column("ds_abrangencia_territorial",Text)
    DS_GRANULARIDADE: Mapped[str | None] = mapped_column("ds_granularidade",String(150))
    DS_LIMITACOES: Mapped[str | None] = mapped_column("ds_limitacoes",Text)

    # Auditoria e exclusão lógica
    DT_REGISTRO: Mapped[datetime] = mapped_column("dt_registro",DateTime(timezone=True),server_default=func.now())
    CO_USUARIO_REGISTRO: Mapped[int] = mapped_column("co_usuario_registro",BigInteger)
    DT_ATUALIZACAO: Mapped[datetime] = mapped_column("dt_atualizacao",DateTime(timezone=True),server_default=func.now())
    CO_USUARIO_ATUALIZACAO: Mapped[int] = mapped_column("co_usuario_atualizacao",BigInteger)
    DS_OBSERVACOES: Mapped[str | None] = mapped_column("ds_observacoes",Text)
    ST_REGISTRO_ATIVO: Mapped[int] = mapped_column("st_registro_ativo",Integer,server_default="6")