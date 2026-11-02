from apps.core.domain.enums import Macrocontrato, StatusContratoPatrocinador, SubstatusContratoPatrocinador
from apps.core.utils.enum_select import enum_to_select

def get_ctpat_contrato_selects():
    return {
        "status": enum_to_select(StatusContratoPatrocinador),
        "substatus": enum_to_select(SubstatusContratoPatrocinador),
        "macrocontrato": enum_to_select(Macrocontrato),
    }