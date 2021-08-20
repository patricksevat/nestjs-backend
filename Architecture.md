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

## Data structure

I have chosen to use a different data structure than the API returns.
If you would have an `Event` entity which looks like this:
```typescript
class Event {
  user: {
    id: string
  }
  consents: {
    id: ConsentType,
    enabled: boolean,
  }[]
}
```

You would have to query all Events for the given user, map over all Events to get to the current state of consents.

By adding an `active` property, we could fetch the latest source of truth, apply changes, 
save the old Event as inactive and save a new Event as active.

This makes for faster querying (because we can create a composite index consisting of userId and active)
And faster processing, because we have to process O(1) records, rather than O(n) records to get to the current source of truth 
