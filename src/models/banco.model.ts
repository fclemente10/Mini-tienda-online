import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Banco extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  cuenta: string;

  @property({
    type: 'string',
    required: true,
  })
  contrasena: string;

  @property({
    type: 'string',
    required: true,
  })
  saldo?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Banco>) {
    super(data);
  }
}

export interface BancoRelations {
  // describe navigational properties here
}

export type BancoWithRelations = Banco & BancoRelations;
