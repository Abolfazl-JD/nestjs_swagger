import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/common/abstract.repository';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Todo } from './todo.entity';

@Injectable()
export class TodosRepository extends AbstractRepository<Todo> {

  constructor(
    @InjectModel(Todo.name) todoModel: Model<Todo>,
    @InjectConnection() connection: Connection,
  ) {
    super(todoModel, connection);
  }
}