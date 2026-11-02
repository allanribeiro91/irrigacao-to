from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.autenticacao.dependency import (
    get_current_user,
    requer_tipos_usuario,
)
from app.modules.usuario.model import Usuario

from .schema import (
    CatalogoDadoCreate,
    CatalogoDadoResponse,
    CatalogoDadoUpdate,
)
from .service import CatalogoDadoService


router = APIRouter(
    prefix="/catalogo-dados",
    tags=["Catálogo de Dados"],
)


DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]

UsuarioAtual = Annotated[
    Usuario,
    Depends(get_current_user),
]

ApenasAdministradorOuMaster = Depends(
    requer_tipos_usuario(
        "Administrador",
        "Master",
    )
)


@router.post(
    "",
    response_model=CatalogoDadoResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[ApenasAdministradorOuMaster],
)
def create(
    payload: CatalogoDadoCreate,
    db: DatabaseSession,
    usuario_atual: UsuarioAtual,
):
    return CatalogoDadoService.create(
        db=db,
        dados=payload,
        usuario_id=usuario_atual.CO_SEQ_USUARIO,
    )


@router.put(
    "/{catalogo_id}",
    response_model=CatalogoDadoResponse,
    dependencies=[ApenasAdministradorOuMaster],
)
def update(
    catalogo_id: int,
    payload: CatalogoDadoUpdate,
    db: DatabaseSession,
    usuario_atual: UsuarioAtual,
):
    return CatalogoDadoService.update(
        db=db,
        catalogo_id=catalogo_id,
        dados=payload,
        usuario_id=usuario_atual.CO_SEQ_USUARIO,
    )


@router.delete(
    "/{catalogo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[ApenasAdministradorOuMaster],
)
def delete(
    catalogo_id: int,
    db: DatabaseSession,
    usuario_atual: UsuarioAtual,
) -> Response:
    CatalogoDadoService.delete(
        db=db,
        catalogo_id=catalogo_id,
        usuario_id=usuario_atual.CO_SEQ_USUARIO,
    )

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )