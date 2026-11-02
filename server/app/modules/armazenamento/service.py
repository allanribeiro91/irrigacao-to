import logging
import os
import re
from functools import lru_cache
from pathlib import PurePosixPath
from uuid import uuid4

import boto3
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import HTTPException, UploadFile, status

from .schema import ArquivoResponse, ListaObjetosResponse, ObjetoResponse

logger = logging.getLogger(__name__)

# Lista inicial deliberadamente restrita. Ajuste conforme o catálogo evoluir.
EXTENSOES_PERMITIDAS = {
    ".csv", ".geojson", ".json", ".kml", ".zip",
    ".xlsx", ".parquet", ".gpkg", ".tif", ".tiff",
}
MAX_UPLOAD_BYTES = 100 * 1024 * 1024  # 100 MiB, limite inicial de desenvolvimento


def _configuracao() -> tuple[str, str, str, str, str]:
    nomes = ("S3_ENDPOINT", "S3_ACCESS_KEY", "S3_SECRET_KEY", "S3_BUCKET")
    faltando = [nome for nome in nomes if not os.getenv(nome)]
    if faltando:
        raise RuntimeError(f"Variáveis S3 ausentes: {', '.join(faltando)}")
    return (
        os.environ["S3_ENDPOINT"],
        os.environ["S3_ACCESS_KEY"],
        os.environ["S3_SECRET_KEY"],
        os.environ["S3_BUCKET"],
        os.getenv("S3_REGION", "us-east-1"),
    )


@lru_cache(maxsize=1)
def get_s3_client():
    endpoint, access, secret, _, region = _configuracao()
    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=access,
        aws_secret_access_key=secret,
        region_name=region,
        config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),
    )


def _bucket() -> str:
    return _configuracao()[3]


def _validar_chave(chave: str) -> str:
    # Chaves S3 não são caminhos locais, mas impedimos nomes ambíguos.
    if (
        not chave or len(chave) > 1024 or chave.startswith("/")
        or "\\" in chave or any(p in (".", "..", "") for p in chave.split("/"))
        or any(ord(c) < 32 for c in chave)
    ):
        raise HTTPException(status_code=400, detail="Chave de objeto inválida.")
    return chave


def _validar_prefixo(prefixo: str) -> str:
    if not prefixo:
        return ""
    texto = prefixo.rstrip("/")
    return _validar_chave(texto) + "/"


def _erro_storage(exc: Exception) -> HTTPException:
    if isinstance(exc, ClientError):
        codigo = exc.response.get("Error", {}).get("Code", "")
        if codigo in ("NoSuchKey", "404", "NotFound"):
            return HTTPException(status_code=404, detail="Arquivo não encontrado.")
        if codigo in ("AccessDenied", "InvalidAccessKeyId", "SignatureDoesNotMatch"):
            logger.error("Acesso ao storage negado: %s", codigo)
            return HTTPException(status_code=502, detail="Falha de autorização no armazenamento.")
    logger.exception("Erro de comunicação com o armazenamento: %s", type(exc).__name__)
    return HTTPException(status_code=502, detail="Serviço de armazenamento indisponível.")


class ArmazenamentoService:
    @staticmethod
    def upload(arquivo: UploadFile, pasta: str = "raw") -> ArquivoResponse:
        nome = PurePosixPath((arquivo.filename or "").replace("\\", "/")).name
        if not nome or nome in (".", ".."):
            raise HTTPException(status_code=400, detail="Nome de arquivo inválido.")
        extensao = PurePosixPath(nome).suffix.lower()
        if extensao not in EXTENSOES_PERMITIDAS:
            raise HTTPException(status_code=415, detail="Formato de arquivo não permitido.")

        pasta_normalizada = _validar_prefixo(pasta)
        arquivo.file.seek(0, os.SEEK_END)
        tamanho = arquivo.file.tell()
        arquivo.file.seek(0)
        if tamanho == 0:
            raise HTTPException(status_code=400, detail="Arquivo vazio.")
        if tamanho > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="Arquivo excede o limite de 100 MiB.")

        # Não utilizar o nome enviado pelo usuário como caminho no bucket.
        chave = f"{pasta_normalizada}{uuid4().hex}{extensao}"
        tipo = arquivo.content_type or "application/octet-stream"
        try:
            get_s3_client().upload_fileobj(
                arquivo.file,
                _bucket(),
                chave,
                ExtraArgs={"ContentType": tipo, "Metadata": {"nome-original": nome[:250]}},
            )
        except (ClientError, BotoCoreError, OSError) as exc:
            raise _erro_storage(exc) from exc
        return ArquivoResponse(
            chave=chave,
            nome_original=nome,
            tamanho_bytes=tamanho,
            tipo_conteudo=tipo,
            bucket=_bucket(),
        )

    @staticmethod
    def listar(prefixo: str = "", token: str | None = None) -> ListaObjetosResponse:
        params = {"Bucket": _bucket(), "MaxKeys": 100}
        if prefixo:
            params["Prefix"] = _validar_prefixo(prefixo)
        if token:
            params["ContinuationToken"] = token
        try:
            resposta = get_s3_client().list_objects_v2(**params)
        except (ClientError, BotoCoreError) as exc:
            raise _erro_storage(exc) from exc
        return ListaObjetosResponse(
            objetos=[
                ObjetoResponse(
                    chave=item["Key"],
                    tamanho_bytes=item["Size"],
                    ultima_modificacao=item.get("LastModified"),
                )
                for item in resposta.get("Contents", [])
            ],
            proximo_token=resposta.get("NextContinuationToken"),
        )

    @staticmethod
    def obter(chave: str):
        _validar_chave(chave)
        try:
            return get_s3_client().get_object(Bucket=_bucket(), Key=chave)
        except (ClientError, BotoCoreError) as exc:
            raise _erro_storage(exc) from exc

    @staticmethod
    def excluir(chave: str) -> None:
        _validar_chave(chave)
        try:
            # delete_object é idempotente: confirmamos que existia antes.
            get_s3_client().head_object(Bucket=_bucket(), Key=chave)
            get_s3_client().delete_object(Bucket=_bucket(), Key=chave)
        except (ClientError, BotoCoreError) as exc:
            raise _erro_storage(exc) from exc
