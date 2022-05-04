import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,

  getModelSchemaRef, param,




  patch, post,






  put,

  requestBody
} from '@loopback/rest';
import {Banco} from '../models';
import {BancoRepository} from '../repositories';

export class BancoController {
  constructor(
    @repository(BancoRepository)
    public BancoRepository: BancoRepository,
  ) {}

  @post('/Bancos', {
    responses: {
      '200': {
        description: 'Banco model instance',
        content: {'application/json': {schema: getModelSchemaRef(Banco)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Banco, {
            title: 'NewBanco',
            exclude: ['id'],
          }),
        },
      },
    })
    Banco: Omit<Banco, 'id'>,
  ): Promise<Banco> {
    return this.BancoRepository.create(Banco);
  }

  @get('/Bancos/count', {
    responses: {
      '200': {
        description: 'Banco model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Banco) where?: Where<Banco>,
  ): Promise<Count> {
    return this.BancoRepository.count(where);
  }

  @get('/Bancos', {
    responses: {
      '200': {
        description: 'Array of Banco model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Banco, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Banco) filter?: Filter<Banco>,
  ): Promise<Banco[]> {
    return this.BancoRepository.find(filter);
  }

  @patch('/Bancos', {
    responses: {
      '200': {
        description: 'Banco PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Banco, {partial: true}),
        },
      },
    })
    Banco: Banco,
    @param.where(Banco) where?: Where<Banco>,
  ): Promise<Count> {
    return this.BancoRepository.updateAll(Banco, where);
  }

  @get('/Bancos/{id}', {
    responses: {
      '200': {
        description: 'Banco model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Banco, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Banco, {exclude: 'where'}) filter?: FilterExcludingWhere<Banco>
  ): Promise<Banco> {
    return this.BancoRepository.findById(id, filter);
  }

  @patch('/Bancos/{id}', {
    responses: {
      '204': {
        description: 'Banco PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Banco, {partial: true}),
        },
      },
    })
    Banco: Banco,
  ): Promise<void> {
    await this.BancoRepository.updateById(id, Banco);
  }

  @put('/Bancos/{id}', {
    responses: {
      '204': {
        description: 'Banco PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() Banco: Banco,
  ): Promise<void> {
    await this.BancoRepository.replaceById(id, Banco);
  }

  @del('/Bancos/{id}', {
    responses: {
      '204': {
        description: 'Banco DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.BancoRepository.deleteById(id);
  }
}
