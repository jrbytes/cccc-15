import Cpf from '../../src/domain/Cpf'

test.each(['97456321558', '71428793860', '87748248800'])(
  'Deve testar se o cpf é válido: %s',
  function (cpf: string) {
    expect(new Cpf(cpf)).toBeDefined()
  },
)

test.each(['8774824880', null, undefined, '11111111111'])(
  'Deve testar se o cpf é inválido: %s',
  function (cpf: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => new Cpf(cpf)).toThrowError('Invalid cpf')
  },
)
