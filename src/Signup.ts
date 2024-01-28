import { v4 } from "uuid";
import { validateCpf } from "./validateCpf";
import AccountDAO from "./AccountDAO";

type SignupInput = {
	name: string;
	email: string;
	cpf: string;
	carPlate?: string;
	isPassenger: boolean;
	isDriver: boolean;
}

export default class Signup {
	constructor(readonly accountDAO: AccountDAO){}

	async execute(input: SignupInput): Promise<any> {
		const existingAccount = await this.accountDAO.getByEmail(input.email);
		if (existingAccount) throw new Error("Email already in use");
		if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
		if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
		if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
		if (input.isDriver && !input.carPlate?.match(/^[A-Z]{3}\d{4}$/)) throw new Error("Invalid car plate");
		const accountId = v4();
		Object.assign(input, { accountId });
		await this.accountDAO.save(input)
		return {
			accountId,
			name: input.name,
			email: input.email,
			cpf: input.cpf,
			carPlate: input.carPlate,
			isPassenger: input.isPassenger,
			isDriver: input.isDriver,
		};
	}
}