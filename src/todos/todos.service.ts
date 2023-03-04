import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.entity';
import { TodosRepository } from './todo.repository';

@Injectable()
export class TodosService {
    constructor(private readonly todosRepo: TodosRepository){}

    async findTodos(task_name: string){
        const todos: Todo[] = await this.todosRepo.find({
            task: { $regex: task_name, $options: 'i' }
        })
        return todos
    }

    createTodo(todoDetails: CreateTodoDto){
        return this.todosRepo.create({
            ...todoDetails,
            done: false
        })
    }

    async updateTodo(id: string,updateTodoDto: UpdateTodoDto){
        const newDocument: Todo = await this.todosRepo.findOneAndUpdate(
            { _id: id },
            updateTodoDto
        )
        return newDocument
    }

    async deleteTodo(id: string){
        await this.todosRepo.findOneAndDelete({ _id: id })
        return { msg: `document with id of ${id} was deleted successfully` }
    }
}
