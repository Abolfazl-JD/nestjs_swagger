import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { BadReqErrorResponse } from 'src/common/types/errors/badReq-error.response';
import { UnauthorizedErrorResponse } from 'src/common/types/errors/unauthorized-error.response';
import { AuthorizationGuard } from 'src/users/guards/authorization.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './todo.entity';
import { TodosService } from './todos.service';

@ApiUnauthorizedResponse({ description: 'No cookies were found', type: UnauthorizedErrorResponse })
@ApiBadRequestResponse({ description: 'Unable to verify the token', type: BadReqErrorResponse })
@ApiTags('Todos')
@UseGuards(AuthorizationGuard)
@Controller('todos')
export class TodosController {

    constructor(private readonly todosService: TodosService){}

    /**
     * Get all todos
    */
    @ApiQuery({
        name: 'task_name',
        description: 'write the task name you wish to find',
        example: 'shop',
        allowEmptyValue: true,
        required: false
    })
    @ApiOkResponse({ description: 'An array of todos were successfully fetched', isArray: true, type: Todo })
    @Get()
    getTodos(@Query('task_name') task_name: string){
        return this.todosService.findTodos(task_name)
    }
    

    /**
     * Create new todo
    */
    @ApiCreatedResponse({ description: 'New work to do was successfully added', type: Todo })
    @Post()
    addTodo(@Body() todoDetails: CreateTodoDto){
        return this.todosService.createTodo(todoDetails)
    }

    /**
     * Update todo by given id
    */
    @ApiParam({
        name: 'id',
        description: 'Id of todo you are willing to update',
        example: '7ha1fo3qbk1045hdn4f'
    })
    @ApiOkResponse({ description: 'task was updated successfully', type: Todo })
    @Patch(':id')
    updateTodo(
        @Param('id') id: string,
        @Body() updateTodoDto: UpdateTodoDto
    ){
        return this.todosService.updateTodo(id, updateTodoDto)
    }

    /**
     * Delete todo by given id
    */
    @ApiParam({
        name: 'id',
        description: 'Id of todo you are willing to delete',
        example: '7ha1fo3qbk1045hdn4f'
    })
    @ApiOkResponse({ description: 'task was deleted successfully', type: String })
    @Delete(':id')
    deleteTodo(@Param('id') id: string){
        return this.todosService.deleteTodo(id)
    }
}
