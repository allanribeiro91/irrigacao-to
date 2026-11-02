from enum import IntEnum


class TipoUsuario(IntEnum):
    USUARIO_COMUM = 2
    ADMINISTRADOR = 3
    MASTER = 4


class StatusAtivoInativoBloqueado(IntEnum):
    ATIVO = 6
    INATIVO = 7
    BLOQUEADO = 8


class TipoDado(IntEnum):
    TABULAR = 10
    GEOESPACIAL_VETORIAL = 11
    GEOESPACIAL_RASTER = 12
    DOCUMENTAL = 13


class TemaDado(IntEnum):
    RECURSOS_HIDRICOS = 15
    AGROPECUARIA_IRRIGACAO = 16
    FUNDIARIO = 17
    MEIO_AMBIENTE = 18
    INFRAESTRUTURA = 19
    SOCIOECONOMIA_DEMOGRAFIA = 20


class PeriodicidadeDado(IntEnum):
    DIARIA = 22
    SEMANAL = 23
    MENSAL = 24
    TRIMESTRAL = 25
    SEMESTRAL = 26
    ANUAL = 27
    DECENAL = 28
    EVENTUAL = 29
    NAO_INFORMADA = 30