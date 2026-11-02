from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from .model import CatalogoDado
from .schema import CatalogoDadoCreate, CatalogoDadoUpdate
from app.core.enums import StatusAtivoInativoBloqueado



class CatalogoDadoService:
    @staticmethod
    def create(
        db: Session,
        dados: CatalogoDadoCreate,
        usuario_id: int,
    ) -> CatalogoDado:
        catalogo = CatalogoDado(
            **dados.model_dump(),
            CO_USUARIO_REGISTRO=usuario_id,
            CO_USUARIO_ATUALIZACAO=usuario_id,
            ST_REGISTRO_ATIVO=StatusAtivoInativoBloqueado.ATIVO,
        )

        db.add(catalogo)
        db.commit()
        db.refresh(catalogo)

        return catalogo

    @staticmethod
    def update(
        db: Session,
        catalogo_id: int,
        dados: CatalogoDadoUpdate,
        usuario_id: int,
    ) -> CatalogoDado:
        catalogo = db.scalar(
            select(CatalogoDado).where(
                CatalogoDado.CO_SEQ_CATALOGO_DADO == catalogo_id
            )
        )

        if catalogo is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Registro do catálogo de dados não encontrado.",
            )

        if catalogo.ST_REGISTRO_ATIVO != StatusAtivoInativoBloqueado.ATIVO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registros inativos não podem ser atualizados.",
            )

        for campo, valor in dados.model_dump().items():
            setattr(catalogo, campo, valor)

        catalogo.CO_USUARIO_ATUALIZACAO = usuario_id
        catalogo.DT_ATUALIZACAO = datetime.now(timezone.utc)

        db.commit()
        db.refresh(catalogo)

        return catalogo

    @staticmethod
    def delete(
        db: Session,
        catalogo_id: int,
        usuario_id: int,
    ) -> None:
        catalogo = db.scalar(
            select(CatalogoDado).where(
                CatalogoDado.CO_SEQ_CATALOGO_DADO == catalogo_id
            )
        )

        if catalogo is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Registro do catálogo de dados não encontrado.",
            )

        if catalogo.ST_REGISTRO_ATIVO != StatusAtivoInativoBloqueado.ATIVO:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registro já está inativo.",
            )

        catalogo.ST_REGISTRO_ATIVO = StatusAtivoInativoBloqueado.INATIVO
        catalogo.CO_USUARIO_ATUALIZACAO = usuario_id
        catalogo.DT_ATUALIZACAO = datetime.now(timezone.utc)

        db.commit()