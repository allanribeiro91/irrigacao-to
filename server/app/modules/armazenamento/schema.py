from datetime import datetime
from pydantic import BaseModel, Field


class ArquivoResponse(BaseModel):
    chave: str
    nome_original: str
    tamanho_bytes: int
    tipo_conteudo: str
    bucket: str


class ObjetoResponse(BaseModel):
    chave: str
    tamanho_bytes: int
    ultima_modificacao: datetime | None = None


class ListaObjetosResponse(BaseModel):
    objetos: list[ObjetoResponse]
    proximo_token: str | None = None


class ExcluirArquivoResponse(BaseModel):
    mensagem: str = Field(default="Arquivo excluído com sucesso.")
