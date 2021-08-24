type ConsentType = 'email_notifications' | 'sms_notifications';

interface IConsent {
  id: ConsentType;
  enabled: boolean;
}

export class CreateEventDto {
  user: {
    id: string;
  };
  consents: IConsent[];
}
