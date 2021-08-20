type ConsentType = 'email' | 'sms';
type Iso8601TimeStamp = string;
type Uuid = string;
type UserId = Uuid;

// interface IConsent {
//   id: Uuid;
//   active: boolean;
//   email: boolean;
//   sms: boolean;
//   dateTime: Iso8601TimeStamp;
//   userId: UserId;
// }

interface IConsent {
  id: ConsentType;
  enabled: boolean;
}

interface IEvent {
  user: {
    id: UserId;
  };
  consents: IConsent[];
}

interface IUser {
  // Do not tie `id` and `email` in case user wants to change email
  id: UserId;
  email: string;
  consents: IConsent[]
}

// Relationships:
// - a Consent has 1 User
// - a User can havy many Consents, but only one active

// Querying
// - User -> often
// - Consent (active for user) -> often, index on userId and active
// - Consent (history for user) -> not often
