from typing import Annotated
from urllib.parse import quote

from fastapi import APIRouter, Depends, File, Query, UploadFile, status
from fastapi.responses import StreamingResponse

from app.modules.autenticacao.dependency import requer_tipos_usuario
from .schema import ArquivoResponse, ListaObjetosResponse
from .service import ArmazenamentoService

router = APIRouter(prefix="/armazenamento", tags=["Armazenamento"])

# Nesta primeira versão, todas as operações são restritas a administradores.
ApenasAdministradorOuMaster = Depends(
    requer_tipos_usuario("Administrador", "Master")
)


@router.post(
    "/arquivos",
    response_model=ArquivoResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[ApenasAdministradorOuMaster],
)
def upload(
    arquivo: Annotated[UploadFile, File(description="CSV, GeoJSON, ZIP etc.")],
    pasta: Annotated[str, Query(max_length=200)] = "raw",
):
    try:
        return ArmazenamentoService.upload(arquivo, pasta)
    finally:
        arquivo.file.close()


@router.get(
    "/arquivos",
    response_model=ListaObjetosResponse,
    dependencies=[ApenasAdministradorOuMaster],
)
def listar(
    prefixo: str = Query(default="", max_length=200),
    token: str | None = Query(default=None),
):
    return ArmazenamentoService.listar(prefixo, token)


@router.get(
    "/arquivos/{chave:path}",
    dependencies=[ApenasAdministradorOuMaster],
)
def baixar(chave: str):
    resposta = ArmazenamentoService.obter(chave)
    body = resposta["Body"]

    def stream():
        try:
            for bloco in body.iter_chunks(chunk_size=1024 * 1024):
                if bloco:
                    yield bloco
        finally:
            body.close()

    nome = chave.rsplit("/", 1)[-1]
    headers = {
        "Content-Disposition": f"attachment; filename*=UTF-8''{quote(nome)}",
        "X-Content-Type-Options": "nosniff",
    }
    return StreamingResponse(
        stream(),
        media_type="application/octet-stream",
        headers=headers,
    )


@router.delete(
    "/arquivos/{chave:path}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[ApenasAdministradorOuMaster],
)
def excluir(chave: str):
    ArmazenamentoService.excluir(chave)
