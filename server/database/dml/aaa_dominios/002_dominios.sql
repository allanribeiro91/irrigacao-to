/* CONFIGURAÇÃO DO SCHEMA */
SET SEARCH_PATH TO SCPORTALDADOS;

/* CONFIGURAÇÃO DE DATA */
SET DATESTYLE = DMY;

BEGIN;

INSERT INTO TB_DOMINIO (CO_SEQ_DOMINIO, CO_DOMINIO, NO_DOMINIO, DS_DOMINIO, DS_OBSERVACOES)
VALUES
    /* ========================================================
       TIPO DE DADO
       ======================================================== */
    (9, NULL, 'Tipo de Dado', 'Classificação da natureza dos conjuntos de dados.', 'Domínio agrupador.'),
    (10, 9, 'Tabular', 'Dados organizados em linhas e colunas, como tabelas estatísticas e planilhas.', 'Sem observações.'),
    (11, 9, 'Geoespacial vetorial', 'Dados espaciais representados por pontos, linhas ou polígonos.', 'Sem observações.'),
    (12, 9, 'Geoespacial raster', 'Dados espaciais representados por uma grade de células, como imagens de satélite e modelos de elevação.', 'Sem observações.'),
    (13, 9, 'Documental', 'Informações disponibilizadas em documentos, relatórios, estudos ou publicações.', 'Sem observações.'),

    /* ========================================================
       TEMA DO DADO
       ======================================================== */
    (14, NULL, 'Tema do Dado', 'Classificação temática principal dos conjuntos de dados.', 'Domínio agrupador.'),
    (15, 14, 'Recursos hídricos', 'Dados sobre águas superficiais e subterrâneas, bacias, captações, outorgas e disponibilidade hídrica.', 'Sem observações.'),
    (16, 14, 'Agropecuária e irrigação', 'Dados sobre produção agropecuária, áreas irrigadas, produtividade e sistemas de irrigação.', 'Sem observações.'),
    (17, 14, 'Fundiário', 'Dados sobre imóveis rurais, estrutura fundiária, assentamentos e territórios legalmente delimitados.', 'Sem observações.'),
    (18, 14, 'Meio ambiente', 'Dados sobre vegetação, uso e cobertura do solo, clima, conservação e monitoramento ambiental.', 'Sem observações.'),
    (19, 14, 'Infraestrutura', 'Dados sobre transportes, energia, saneamento, armazenamento e outras estruturas de apoio territorial.', 'Sem observações.'),
    (20, 14, 'Socioeconomia e demografia', 'Dados sobre população, renda, trabalho, economia e condições sociais dos territórios.', 'Sem observações.'),

    /* ========================================================
       PERIODICIDADE DO DADO
       ======================================================== */
    (21, NULL, 'Periodicidade do Dado', 'Frequência de atualização dos conjuntos de dados pela fonte.', 'Domínio agrupador. Não representa o agendamento de coleta do portal.'),
    (22, 21, 'Diária', 'Atualização dos dados a cada dia.', 'Sem observações.'),
    (23, 21, 'Semanal', 'Atualização dos dados a cada semana.', 'Sem observações.'),
    (24, 21, 'Mensal', 'Atualização dos dados a cada mês.', 'Sem observações.'),
    (25, 21, 'Trimestral', 'Atualização dos dados a cada três meses.', 'Sem observações.'),
    (26, 21, 'Semestral', 'Atualização dos dados a cada seis meses.', 'Sem observações.'),
    (27, 21, 'Anual', 'Atualização dos dados a cada ano.', 'Sem observações.'),
    (28, 21, 'Decenal', 'Atualização dos dados a cada dez anos.', 'Sem observações.'),
    (29, 21, 'Eventual', 'Atualização dos dados sem intervalo regular, conforme necessidade ou ocorrência de eventos.', 'Sem observações.'),
    (30, 21, 'Não informada', 'Periodicidade de atualização não informada pela fonte.', 'Sem observações.');

/* SINCRONIZAÇÃO DA SEQUÊNCIA */
SELECT SETVAL(
    PG_GET_SERIAL_SEQUENCE(
        'scportaldados.tb_dominio',
        'co_seq_dominio'),
    (SELECT MAX(CO_SEQ_DOMINIO) FROM TB_DOMINIO),
    TRUE
);

COMMIT;