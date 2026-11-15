
export interface ResponsePaginator<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}