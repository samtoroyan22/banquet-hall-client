export interface IReserve {
  id: string;
  number: string;
  reserveStatus: IReserveStatus;
  date: string;
  fromTime: string | null;
  toTime: string | null;
}

export interface IReserveStatus {
  index: number;
  name: string;
}

export interface IDiscoverySource {
  id: string;
  name: string;
}

export interface IPlace {
  id: string;
  name: string;
  reserves: IReserve[];
}

export interface IRestaurant {
  id: string;
  name: string;
  places: IPlace[];
}

export interface IReservationResponse {
  date: string;
  restaurants: IRestaurant[];
}

export interface IReserveStatus {
  id: string;
  name: string;
}

export interface IReserveDetail {
  id: string;
  number: string;
  date: string;
  fromTime: string | null;
  toTime: string | null;
  person: number;
  reserveStatus: IReserveStatus;
  discoverySource?: IDiscoverySource | null;
  advancePayment: string;
  amountPayment: string;
  isFinished: boolean;
  prepaymentDate: string;
  comment: string;
  client: {
    name: string;
  };
  place: {
    name: string;
  };
}

export type TCreateReserveBody = {
  date: string;
  fromTime: string;
  toTime: string | null;
  person: number;
  advancePayment: string | null;
  amountPayment: string | null;
  prepaymentDate: string | null;
  comment: string | null;
  clientId: string;
  placeId: string;
  discoverySourceId?: string;
};

export type TUpdateData = {
  prepaymentDate?: string | null;
  fromTime?: string;
  toTime?: string | null;
  person?: number;
  discoverySourceId?: string | null;
  advancePayment?: string | null;
  amountPayment?: string | null;
  comment?: string | null;
  reserveStatusId?: string;
  isFinished?: boolean;
};
