import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transaction: {
      id: string
      description: string
      amount: number
      sessionId?: string
      createdAt: string
    }
  }
}
