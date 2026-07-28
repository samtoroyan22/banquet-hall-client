export interface IKeyDate {
  id: string;
  date: string;
  description: string | null;
}

export interface ITypeHistory {
  id: string;
  name: string;
}

export interface IHistory {
  id: string;
  date: string;
  description: string | null;
  type_history: ITypeHistory;
}

export interface HistoryBody {
  clientId: string;
  typeHistoryId: string;
  date: string;
  description?: string;
}

export interface IClientContact {
  id: string;
  name: string;
  position: string | null;
  email: string | null;
  phone: string | null;
}

export interface IClientDetail {
  id: string;
  name: string;
  type: "legal" | "physical";
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  actualAddress: string | null;
  legalAddress: string | null;
  inn: string | null;
  ogrn: string | null;
  passportSerial: string | null;
  passportNumber: string | null;
  passportDate: string | null;
  passportSubdivision: string | null;
  description: string | null;
  keyDates: IKeyDate[] | null;
  histories: IHistory[] | null;
  contacts: IClientContact[] | null;
}

export interface IClientContactsDetail {
  id: string;
  name: string;
  phone: string;
}

export interface IClientSummary {
  id: string;
  name: string;
  type: "legal" | "physical";
  inn: string | null;
  contacts: IClientContactsDetail[];
}
