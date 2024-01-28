import { AccountDAODatabase } from "./AccountDAO";

export default class GetAccount {
	constructor(readonly accountDAO: AccountDAODatabase){}

	async execute(accountId: string): Promise<any> {
		const account = await this.accountDAO.getById(accountId);
		// activate under line to pass the test in memory
		// Object.assign(account, { is_passenger: account.isPassenger, is_driver: account.isDriver, car_plate: account.carPlate });
		return account;
	}
}

