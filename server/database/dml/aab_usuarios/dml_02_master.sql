/* CONFIGURAÇÃO DO SCHEMA */
SET SEARCH_PATH TO SCPORTALDADOS;

/* CONFIGURAÇÃO DE DATA */
SET DATESTYLE = DMY;

/* INSERÇÃO DE USUÁRIOS */
INSERT INTO TB_USUARIO (
    CO_CPF,
    NO_NOME,
    DS_EMAIL,
    DS_CELULAR,
    DS_SENHA,
    CO_STATUS,
    CO_TP_USUARIO
)
VALUES
    /* MASTER BLASTER */
    (
        '00011122233',
        'Master Blaster',
        'akosr91@gmail.com',
        NULL,
        '$argon2id$v=19$m=65536,t=3,p=4$1OPsrU99zpO+eMsr1ZiUXg$jhErT7WF8CQjbZy8IdX9R2pxgBtUq1xxY/OumRPhNP4',
        6, /* Ativo */
        4  /* Master */
    ),

    /* ALLAN RIBEIRO */
    (
        '01694440150',
        'Allan Ribeiro',
        'allan.ribeiro@embrapii.org.br',
        NULL,
        '$argon2id$v=19$m=65536,t=3,p=4$1OPsrU99zpO+eMsr1ZiUXg$jhErT7WF8CQjbZy8IdX9R2pxgBtUq1xxY/OumRPhNP4',
        6, /* Ativo */
        4  /* Master */
    );