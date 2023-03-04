import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { Todo, TodoSchema } from './todo.entity';
import { TodosRepository } from './todo.repository';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    UsersModule
  ],
  controllers: [TodosController],
  providers: [TodosService, TodosRepository]
})
export class TodosModule {}
