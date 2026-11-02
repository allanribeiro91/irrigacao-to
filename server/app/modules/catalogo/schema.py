from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class CatalogoDadoBase(BaseModel):
    NO_CONJUNTO_DADO: str = Field(min_length=2, max_length=255)
    DS_DESCRICAO: str = Field(min_length=1)

    CO_TP_DADO: int
    CO_TEMA: int | None = None

    NO_FONTE: str = Field(min_length=1, max_length=200)
    DS_ORIGEM: str | None = Field(default=None, max_length=255)
    DS_IDENTIFICADOR_ORIGEM: str | None = Field(
        default=None,
        max_length=255,
    )
    DS_URL_FONTE: str | None = None
    DS_URL_ACESSO: str | None = None
    NO_FORMATO: str | None = Field(default=None, max_length=50)
    DS_LICENCA: str | None = None

    CO_PERIODICIDADE: int | None = None
    DT_ULTIMA_BUSCA: datetime | None = None
    DT_ATUALIZACAO_FONTE: date | None = None
    DT_REFERENCIA_INICIO: date | None = None
    DT_REFERENCIA_FIM: date | None = None

    DS_ABRANGENCIA_TERRITORIAL: str | None = None
    DS_GRANULARIDADE: str | None = Field(
        default=None,
        max_length=150,
    )
    DS_LIMITACOES: str | None = None

    DS_OBSERVACOES: str | None = None


class CatalogoDadoCreate(CatalogoDadoBase):
    pass


class CatalogoDadoUpdate(CatalogoDadoBase):
    pass


class CatalogoDadoResponse(CatalogoDadoBase):
    model_config = ConfigDict(from_attributes=True)

    CO_SEQ_CATALOGO_DADO: int

    DT_REGISTRO: datetime
    CO_USUARIO_REGISTRO: int

    DT_ATUALIZACAO: datetime
    CO_USUARIO_ATUALIZACAO: int

    ST_REGISTRO_ATIVO: int