# Portal de Dados — Inteligência Territorial do Tocantins

Frontend do Portal de Dados voltado à consulta, visualização e exploração de informações territoriais, produtivas, socioeconômicas e ambientais do estado do Tocantins.

O portal está sendo desenvolvido como uma interface integrada para acesso a mapas, camadas geográficas, indicadores, painéis analíticos, catálogo de dados e relatórios executivos.

> Este repositório contém somente o **frontend** da solução. O backend será mantido em outra aplicação e desenvolvido com **FastAPI**.

## Visão geral

A aplicação busca transformar bases de dados dispersas em uma experiência de consulta territorial simples e executiva. Nesta primeira etapa, está sendo construída a fundação visual e arquitetural do frontend, preparando a integração posterior com serviços geográficos e APIs.

As principais áreas previstas são:

- **Geo:** visualização do território e seleção de camadas geográficas;
- **Painéis:** acesso a dashboards e análises interativas;
- **Indicadores:** consulta de indicadores e séries históricas;
- **Catálogo:** inventário de bases, variáveis, fontes e metadados;
- **Relatórios:** acesso a diagnósticos, estudos e publicações;
- **Perfil do usuário:** consulta e atualização dos dados pessoais, segurança e histórico de atividades.

## Estado atual

O projeto encontra-se em desenvolvimento inicial. A estrutura implementada inclui:

- página de login;
- layout principal do portal;
- barra superior e menu lateral responsivo;
- navegação entre as áreas da aplicação;
- página geográfica com foco inicial no Tocantins;
- mapa interativo com Leaflet;
- mapas-base rodoviário, de relevo e de satélite;
- mapa de satélite selecionado por padrão;
- painel lateral expansível de ferramentas geográficas;
- estrutura visual para seleção de camadas;
- esqueletos das páginas de painéis, indicadores, catálogo e relatórios;
- página de perfil do usuário;
- fluxo provisório de entrada e saída da aplicação.

As informações de usuário, camadas e atividades ainda são simuladas no frontend. A autenticação e a persistência serão implementadas durante a integração com o backend.

## Tecnologias

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Leaflet](https://leafletjs.com/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Lucide React](https://lucide.dev/)
- CSS

## Mapas-base

A versão inicial utiliza os seguintes serviços:

| Modo       | Fonte              | Finalidade                                      |
| ---------- | ------------------ | ----------------------------------------------- |
| Satélite   | Esri World Imagery | Imagens orbitais e leitura visual do território |
| Rodoviário | OpenStreetMap      | Vias, localidades e referências urbanas         |
| Relevo     | OpenTopoMap        | Topografia e representação do relevo            |

Os mapas-base são utilizados com suas respectivas atribuições. Os servidores públicos são adequados para desenvolvimento e prototipação, mas suas políticas de uso e capacidade deverão ser reavaliadas antes da publicação em produção.

## Arquitetura da solução

Este repositório representa exclusivamente a aplicação cliente:

```text
Usuário
   ↓
Frontend React
   ↓
API REST — FastAPI
   ↓
PostgreSQL / PostGIS
```

### Responsabilidades do frontend

- apresentar mapas, indicadores, painéis e relatórios;
- oferecer navegação e interação com os dados;
- controlar o estado visual da aplicação;
- consumir os endpoints disponibilizados pelo backend;
- apresentar autenticação, perfil e permissões recebidas da API.

### Responsabilidades do backend

O backend será desenvolvido em um projeto separado e deverá concentrar:

- autenticação e autorização;
- gestão de usuários e sessões;
- persistência dos dados;
- gestão do catálogo e das camadas geográficas;
- disponibilização de dados espaciais;
- regras de negócio;
- registro de logs e auditoria;
- integração com PostgreSQL e PostGIS;
- exposição de endpoints REST para o frontend.

## Estrutura principal

```text
src/
├── components/
│   ├── layout/
│   └── map/
├── layouts/
├── pages/
│   ├── auth/
│   └── portal/
├── styles/
├── App.tsx
└── main.tsx
```

O projeto adota o padrão de arquivos `index.tsx` e `index.css` dentro da pasta de cada componente ou página.

## Rotas atuais

| Rota                  | Página                         |
| --------------------- | ------------------------------ |
| `/login`              | Acesso à aplicação             |
| `/portal/geografico`  | Mapa e ferramentas geográficas |
| `/portal/paineis`     | Painéis analíticos             |
| `/portal/indicadores` | Indicadores territoriais       |
| `/portal/catalogo`    | Catálogo de dados              |
| `/portal/relatorios`  | Relatórios e estudos           |
| `/portal/usuario`     | Perfil do usuário              |

## Executando localmente

### Pré-requisitos

- Node.js 20 ou superior;
- npm 10 ou superior.

### Instalação

Clone o repositório:

```bash
git clone https://github.com/allanribeiro91/portal-dados.git
cd portal-dados
```

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

O Vite informará no terminal o endereço local da aplicação, normalmente:

```text
http://localhost:5173
```

## Comandos disponíveis

```bash
# Ambiente de desenvolvimento
npm run dev

# Verificação de qualidade
npm run lint

# Build de produção
npm run build

# Visualização local do build
npm run preview
```

## Variáveis de ambiente

Quando a integração com o backend for iniciada, a URL da API deverá ser configurada por variável de ambiente.

Exemplo de `.env.example`:

```env
VITE_API_URL=http://localhost:8000
```

Arquivos `.env` locais não devem ser versionados. Apenas o `.env.example`, sem credenciais ou informações sensíveis, deve ser mantido no repositório.

## Próximas etapas

- criar o projeto separado do backend com FastAPI;
- estruturar PostgreSQL e PostGIS;
- definir o contrato inicial da API;
- implementar autenticação e autorização reais;
- integrar o perfil do usuário com a API;
- cadastrar e disponibilizar camadas geográficas;
- conectar a seleção de camadas ao mapa;
- implementar filtros e ferramentas de medição;
- estruturar catálogo e metadados;
- conectar painéis, indicadores e relatórios;
- adicionar testes automatizados;
- definir a estratégia de implantação.

## Boas práticas de contribuição

Antes de enviar alterações:

```bash
npm run lint
npm run build
```

As mensagens de commit devem ser objetivas e descrever a alteração realizada. Exemplos:

```text
feat: adiciona painel lateral de ferramentas do mapa
fix: corrige dimensionamento do mapa no workspace
docs: atualiza instruções de execução do projeto
```

## Repositório

[github.com/allanribeiro91/portal-dados](https://github.com/allanribeiro91/portal-dados)

## Licença

A licença do projeto ainda não foi definida.
