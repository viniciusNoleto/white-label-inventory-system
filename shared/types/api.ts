
export type ApiReponse<T> = {
  data: T,
  message: string
}

export type PaginatedResponse<T> = {
  items: T[];
  meta: PaginatedMeta;
}

export type PaginatedMeta = {
  page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export type PayloadBody<T extends FormData | object> = {
  body: T
}

export type PayloadQuery<T extends object> = {
  query?: T
}