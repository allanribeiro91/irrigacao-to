# RustFS local — Portal de Dados

## Pré-requisitos
Docker Desktop em execução (Windows + WSL2).

## Inicialização

1. Copie `.env.example` para `.env` e substitua os valores por credenciais únicas e seguras.
2. Execute nesta pasta:

```powershell
docker compose config
docker compose up -d
docker compose ps
```

## Acessos
- Console: http://localhost:9001
- API S3: http://localhost:9000
- Saúde: http://localhost:9000/health

Crie o bucket `portal-dados-dev` pelo console.

## Comandos

```powershell
docker compose logs -f rustfs
docker compose down
docker compose up -d
```

**Atenção:** `docker compose down -v` remove o volume e apaga os objetos armazenados. O volume nomeado não é backup. O serviço de desenvolvimento não está configurado para uso público.
