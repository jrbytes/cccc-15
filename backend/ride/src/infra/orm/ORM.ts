import type DatabaseConnection from '../database/DatabaseConnection'

export default class ORM {
  constructor(readonly connection: DatabaseConnection) {}

  async save(model: any) {
    const columns = model.columns.map((column: any) => column.column).join(', ')
    const params = model.columns
      .map((column: any, index: number) => `$${index + 1}`)
      .join(', ')
    const values = model.columns.map((column: any) => model[column.property])
    const query = `INSERT INTO ${model.schema}.${model.table} (${columns}) VALUES (${params})`
    await this.connection.query(query, values)
  }

  async findBy(model: any, field: string, value: string) {
    const query = `SELECT * FROM ${model.prototype.schema}.${model.prototype.table} WHERE ${field} = $1`
    const [data] = await this.connection.query(query, [value])
    if (!data) return
    // eslint-disable-next-line new-cap
    const obj = new model()
    for (const column of model.prototype.columns) {
      obj[column.property] = data[column.column]
    }
    return obj
  }
}

export class Model {
  declare schema: string
  declare table: string
  declare columns: {
    property: string
    column: string
    pk: boolean
  };

  [key: string]: any
}

export function model(schema: string, table: string): ClassDecorator {
  return function (constructor: any) {
    constructor.prototype.schema = schema
    constructor.prototype.table = table
  }
}

export function column(name: string, pk = false) {
  return function (target: any, propertyKey: string) {
    target.columns = target.columns || []
    target.columns.push({ property: propertyKey, column: name, pk })
  }
}
