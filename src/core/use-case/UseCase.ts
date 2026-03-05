export interface UseCase<Result = unknown, Params = unknown> {
  call(params?: Params): Promise<Result>;
}
