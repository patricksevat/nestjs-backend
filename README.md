## Consent Node App

### Prerequisites

- Node 12 or higher
- Docker (with [`postgres` image](https://hub.docker.com/_/postgres)) 

### Installation 

`yarn install`

### Run

First time: 
`yarn db:create && yarn start:dev`

Subsequent times:
`yarn db:start && yarn start:dev`

### Useful

- pgAdmin

### Remarks

Could have made a shared module with stuff like interceptors, exception filters and pipes. Would've made it a bit cleaner

## The challenge

You're building a Preference Center for your users where they can manage their choice regarding the channel they want to get notified on. They can choose between getting notified by email, SMS, neither, or both. To do this you need to provide an API to manage your users and their consents.

A user will be identified by an email and can have multiple consent change events that modify the user consent status. Each choice made by a user generates a consent change event. A consent change event belongs to one user.

For audit purposes, it is expected to always have a full history of the events that led to the user's current consent status, as the user can make changes to their consent at any point in time.

The goal of this challenge is to build the simplest possible consent and user storage API. If you believe there are edge cases that are worth discussing and too complex to implement for the challenge feel free to create a list of them and we will discuss them during the interview.

## Product specification

The API you are building supports CRUD operations on `user` and `event` entities with the following rules:

- A user can have multiple events that, ✅
    - when applied in the order of their creation, will generate the current user consent status. ✅ (sort of, no applying in order of creation, but keeping active state)
- A user accepts only one required field (`email`) 
    - that must be a valid email address ✅
    - and unique. ✅ 
    - If any of the requirements are not satisfied, the API must return a 422 response. ✅
- Consent IDs can be one of the following: `email_notifications` or `sms_notifications`. ✅
- Consent change events can only be 
    - read and  ✅
    - created, ✅ 
    - not update or deleted. ✅
- A consent change event belongs to a single user. ✅

To keep the challenge as short as possible the mandatory routes and methods are the following:

- `/users` [`GET`, `POST`, `DELETE`]
- `/events` [`POST`]

### Example

After creating a user, the request will return:

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "email": "valid@email.com",
  "consents": []
}
```

If two events are created in this order:

```json
{
  "user": {
    "id": "00000000-0000-0000-0000-000000000000"
  },
  "consents": [
    {
      "id": "email_notifications",
      "enabled": true
    }
  ]
}
```

```json
{
  "user": {
    "id": "00000000-0000-0000-0000-000000000000"
  },
  "consents": [
    {
      "id": "email_notifications",
      "enabled": false
    },
    {
      "id": "sms_notifications",
      "enabled": true
    }
  ]
}
```

The resulting user (GET request) will be:

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "email": "valid@email.com",
  "consents": [
    {
      "id": "email_notifications",
      "enabled": false
    },
    {
      "id": "sms_notifications",
      "enabled": true
    }
  ]
}
```

## Review session

After receiving your code challenge, we organize a review session with you and a few engineers from Didomi. During the review session, we will:

- Ask you to share you screen and do a quick demo of the app you built
- Ask you to present your project structure and walk us through the code (the different components, the state management, etc.)
- Ask you general technical questions related to your project and backend architecture
- Do an architecture exercise where you will sketch out an architecture (think about APIs, clients, queues, jobs, etc) using <http://draw.io/>, <http://miro.com/> or a similar tool of your choice

A few examples of the topic that we like to discuss in more details:

- API formats and documentation
- Schema management and migrations
- Microservices and loose coupling
- Secrets and encryption
- Queues and event-driven architecture
- Testing
