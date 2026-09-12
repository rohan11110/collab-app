# CollabDocs backend

## Setup
1. Copy `.env.example` to `.env` and set a local MongoDB URI and JWT secret.
2. `npm install`
3. `npm run dev`

The API and Socket.IO server run on port 5001 by default.

## Collaboration features
- JWT-authenticated Socket.IO connections.
- Project membership checks for document access and socket joins.
- Real-time document updates with debounced MongoDB persistence.
- Version snapshots, restore, comments, chat, presence, member invite/remove.
- Existing users can be invited by email. Email delivery itself is not required for the current invite flow.
