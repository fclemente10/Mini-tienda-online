import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Banco, BancoRelations} from '../models';

export class BancoRepository extends DefaultCrudRepository<
  Banco,
  typeof Banco.prototype.id,
  BancoRelations
  > {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Banco, dataSource);
  }
}
