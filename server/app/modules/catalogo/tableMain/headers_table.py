def get_catalogo_headers_table():
    return [
        {"key": "id", "fieldType": "number"},
        {"key": "status", "fieldType": "select"},
        {"key": "substatus", "fieldType": "select"},
        {"key": "macrocontrato", "fieldType": "select"},
        {"key": "nome", "fieldType": "text"},
        {"key": "data_assinatura", "fieldType": "date"},
        {"key": "data_vigencia", "fieldType": "date"},
    ]