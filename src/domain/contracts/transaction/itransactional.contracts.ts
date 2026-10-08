export interface ITransactionalDb<TTransaction = unknown> {
  transaction<T>(callback: (tx: TTransaction) => Promise<T>): Promise<T>
}
