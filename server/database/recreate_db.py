
"""
Inicialização e recriação do banco de dados do Portal de Dados.

- Carrega as configurações de server/.env.
- Cria o banco de dados, caso não exista.
- Recria o schema configurado em DB_SCHEMA.
- Executa todos os scripts DDL, depois todos os DML.
- Respeita a ordem alfabética dos arquivos.
- Utiliza transação para alterações no schema.
"""

import argparse
import os
import sys
from pathlib import Path

import psycopg
from psycopg import sql
from dotenv import load_dotenv


# ==========================================================
# 1. CONFIGURAÇÕES
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent
SERVER_DIR = BASE_DIR.parent
DATABASE_DIR = BASE_DIR

DDL_DIR = DATABASE_DIR / "ddl"
DML_DIR = DATABASE_DIR / "dml"

load_dotenv(SERVER_DIR / ".env")

DB_HOST = os.environ["DB_HOST"]
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_USER = os.environ["DB_USERNAME"]
DB_PASSWORD = os.environ["DB_PASSWORD"]
DB_NAME = os.environ["DB_DATABASE"]
DB_SCHEMA = os.environ["DB_SCHEMA"]


# ==========================================================
# 2. CONEXÃO
# ==========================================================

def get_connection(database=None, autocommit=False):
    return psycopg.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=database or DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        autocommit=autocommit,
    )


# ==========================================================
# 3. CRIAÇÃO DO BANCO
# ==========================================================

def criar_banco_se_necessario():
    """
    Conecta ao banco administrativo postgres e cria
    DB_DATABASE caso ainda não exista.
    """

    with get_connection(
        database="postgres",
        autocommit=True,
    ) as conn:

        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT 1 FROM pg_database WHERE datname = %s",
                (DB_NAME,),
            )

            if cursor.fetchone():
                print(f"[OK] Banco existente: {DB_NAME}")
                return False

            cursor.execute(
                sql.SQL("CREATE DATABASE {}").format(
                    sql.Identifier(DB_NAME)
                )
            )

            print(f"[OK] Banco criado: {DB_NAME}")
            return True


# ==========================================================
# 4. IDENTIFICAÇÃO DOS SCRIPTS
# ==========================================================

def listar_scripts():
    """
    Executa todos os DDLs antes dos DMLs.

    Ordem de execução:
    1. DDLs em ordem alfabética.
    2. DMLs agrupados por subpastas em ordem alfabética.
    3. Arquivos SQL de cada subpasta em ordem alfabética.
    """

    scripts = []

    for tipo, pasta in (
        ("DDL", DDL_DIR),
        ("DML", DML_DIR),
    ):
        if not pasta.is_dir():
            raise FileNotFoundError(
                f"Diretório não encontrado: {pasta}"
            )

        arquivos = sorted(
            pasta.rglob("*.sql"),
            key=lambda arquivo: arquivo.relative_to(pasta).parts,
        )

        for arquivo in arquivos:
            scripts.append((tipo, arquivo))

    if not scripts:
        raise RuntimeError(
            "Nenhum arquivo SQL encontrado."
        )

    return scripts


# ==========================================================
# 5. SCHEMA
# ==========================================================

def schema_existe(conn):
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT 1
            FROM pg_namespace
            WHERE nspname = %s
            """,
            (DB_SCHEMA,),
        )

        return cursor.fetchone() is not None


def excluir_schema(conn):
    with conn.cursor() as cursor:
        cursor.execute(
            sql.SQL("DROP SCHEMA IF EXISTS {} CASCADE").format(
                sql.Identifier(DB_SCHEMA)
            )
        )

    print(f"[OK] Schema excluído: {DB_SCHEMA}")


def criar_schema(conn):
    with conn.cursor() as cursor:
        cursor.execute(
            sql.SQL("CREATE SCHEMA IF NOT EXISTS {}").format(
                sql.Identifier(DB_SCHEMA)
            )
        )

    print(f"[OK] Schema disponível: {DB_SCHEMA}")


def configurar_schema(conn):
    with conn.cursor() as cursor:
        cursor.execute(
            sql.SQL("SET search_path TO {}, public").format(
                sql.Identifier(DB_SCHEMA)
            )
        )


# ==========================================================
# 6. EXECUÇÃO DOS SCRIPTS
# ==========================================================

def executar_script(conn, tipo, arquivo):
    conteudo = arquivo.read_text(encoding="utf-8-sig")

    if not conteudo.strip():
        print(f"[IGNORADO] {arquivo.name}")
        return

    print(
        f"[{tipo}] Executando: "
        f"{arquivo.relative_to(DATABASE_DIR)}"
    )

    with conn.cursor() as cursor:
        cursor.execute(conteudo, prepare=False)

    print(f"[OK] {arquivo.name}")


# ==========================================================
# 7. EXECUÇÃO PRINCIPAL
# ==========================================================

def main():
    parser = argparse.ArgumentParser(
        description="Recria o banco de dados do Portal de Dados."
    )

    parser.add_argument(
        "--yes",
        action="store_true",
        help="Confirma a recriação sem solicitar interação.",
    )

    args = parser.parse_args()

    scripts = listar_scripts()

    print("\n" + "=" * 60)
    print("PORTAL DE DADOS - RECRIAÇÃO DO BANCO")
    print("=" * 60)
    print(f"Host:    {DB_HOST}:{DB_PORT}")
    print(f"Banco:   {DB_NAME}")
    print(f"Schema:  {DB_SCHEMA}")
    print(f"Scripts: {len(scripts)}")
    print("=" * 60)

    # Conexão de verificação sem modificar dados.
    # Se o banco ainda não existir, será criado após
    # a confirmação.
    banco_existe = False

    with get_connection(
        database="postgres",
        autocommit=True,
    ) as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT 1 FROM pg_database WHERE datname = %s",
                (DB_NAME,),
            )
            banco_existe = cursor.fetchone() is not None

    schema_atual_existe = False

    if banco_existe:
        with get_connection() as conn:
            schema_atual_existe = schema_existe(conn)

    if schema_atual_existe and not args.yes:
        print(
            f"\nATENÇÃO: o schema '{DB_SCHEMA}' e todos "
            "os seus objetos serão excluídos."
        )

        confirmacao = input(
            "Digite RECRIAR para continuar: "
        )

        if confirmacao != "RECRIAR":
            print("Operação cancelada.")
            return

    try:
        criar_banco_se_necessario()

        # Uma única transação para schema, DDL e DML.
        with get_connection() as conn:
            try:
                if schema_atual_existe:
                    print("\nRecriando schema...")
                    excluir_schema(conn)

                criar_schema(conn)
                configurar_schema(conn)

                print("\nExecutando scripts SQL...\n")

                for tipo, arquivo in scripts:
                    executar_script(conn, tipo, arquivo)

                conn.commit()

            except Exception:
                conn.rollback()
                raise

        print("\n" + "=" * 60)
        print("BANCO PREPARADO COM SUCESSO!")
        print("=" * 60)

    except Exception as exc:
        print(f"\n[ERRO] {exc}")
        print(
            "As alterações transacionais no schema "
            "foram revertidas."
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
