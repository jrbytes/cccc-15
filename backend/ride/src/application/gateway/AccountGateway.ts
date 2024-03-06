export default interface AccountGateway {
  getById: (accountId: string) => Promise<any>
}
