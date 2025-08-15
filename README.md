# Pigeon Delivery - Projeto para Teste Técnico

**O que tem aqui**
- `backend/` - NestJS (TypeScript) + TypeORM + SQLite (API REST)
- `frontend/` - React + Vite (JavaScript)
- `docker-compose.yml` - para subir backend e frontend

## Observações importantes
- Optei por **backend em NestJS (TypeScript)** porque o framework é TypeScript-first; isso mantém o projeto idiomático e mais próximo do esperado em testes que pedem NestJS.
- O frontend está em **JavaScript (React)** como você pediu.
- Se você quiser **converter o backend para JavaScript**, me avise que eu converto.

## Como rodar localmente (sem Docker)
### Backend
1. Abra um terminal em `backend/`.
2. `npm install`
3. `npm run start:dev`
4. API estará em http://localhost:3000

### Frontend
1. Abra outro terminal em `frontend/`.
2. `npm install`
3. `npm run dev`
4. Frontend estará em http://localhost:5173

## Como rodar com Docker (recomendado)
1. Tenha Docker e docker-compose instalados.
2. Na raiz do projeto rode `docker-compose up --build`
3. Backend estará em http://localhost:3000 e frontend em http://localhost:5173

## Regras de negócio implementadas
- Cadastro/edição de pombos, clientes e cartas.
- Pombos podem ser **aposentados** (`PATCH /pigeons/:id/retire`) — não são removidos do banco, apenas marcados como `retired`.
- Ao criar ou atualizar uma carta, **não é possível escolher um pombo aposentado**.
- Se uma carta estiver com status `ENTREGUE`, seu status **não pode ser alterado**.
- Upload de foto do pombo: `POST /pigeons/:id/photo` (form-data `file`).

## Entrega (o que enviar)
- Compacte este projeto e submeta o repositório (ou o zip). Aqui já deixei um `pigeon-delivery.zip` pronto para download.
