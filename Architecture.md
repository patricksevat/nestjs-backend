# Architecture

### Tools

#### NestJS

Was on my list to learn! When I heard Didomi uses it, great opportunity for me to learn.
Nice framework for NodeJS based development, like the complementary tooling it brings (TypeScript, Jest, es-lint, prettier).
I have chosen to stick with Express for the assignment. In a production env I would consider Fastify

#### PostgreSQL

Battle-tested, nice ecosystem, JSON support. Used before. Didn't know of the `@nestjs/typeorm` package yet, but that makes my 
configuration easier 👍 

#### TypeORM

Nice ORM that plays well with TypeScript. The Active Record pattern feels quite natural. Makes working with relations quite easy

### Modules

- App module
    - versioning of API
- Users
- Events

### Providers

- UsersService
- EventsService

### Middleware

- Helmet (global)
- Auth (should really do anything, perhaps check for existence of an auth header)
- Logging
    - Request
    - Response => perhaps interceptor better suited?

## Possible extensions (out of scope)

- Caching layer in front of API, caching the active Event for each user
    - Could be implemented using interceptors as well, just for the fun of it
- Better auth
