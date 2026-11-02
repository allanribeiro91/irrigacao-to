import re

from pydantic import BaseModel, EmailStr, Field, field_validator


class LoginRequest(BaseModel):
    co_cpf: str
    ds_senha: str = Field(min_length=1, max_length=128)

    @field_validator("co_cpf")
    @classmethod
    def validar_cpf(cls, value: str) -> str:
        cpf = re.sub(r"\D", "", value)

        if len(cpf) != 11:
            raise ValueError("CPF deve possuir 11 dígitos")

        return cpf


class UsuarioAutenticadoResponse(BaseModel):
    co_seq_usuario: int
    no_nome: str
    ds_email: EmailStr
    co_tp_usuario: int
    no_tipo_usuario: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    usuario: UsuarioAutenticadoResponse