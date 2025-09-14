import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  CommandBus,
  COMMAND_BUS,
} from './shared-kernel/application/cqrs/command.bus';
import {
  QueryBus,
  QUERY_BUS,
} from './shared-kernel/application/cqrs/query.bus';
import { CreateUserCommand } from './commands/create-user.command';
import { GetUserQuery } from './queries/get-user.query';
import { GetAllUsersQuery } from './queries/get-all-users.query';
import { CreateUserDto, UserDto } from './dto/user.dto';

@Controller('users')
export class AppController {
  constructor(
    @Inject(COMMAND_BUS) private readonly commandBus: CommandBus,
    @Inject(QUERY_BUS) private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const command = new CreateUserCommand(createUserDto);
    const result = await this.commandBus.execute(command);

    if (result.isFailure) {
      throw new HttpException(
        {
          message: result.error,
          errorCode: result.errorCode,
        },
        result.errorCode === 'USER_EMAIL_EXISTS'
          ? HttpStatus.CONFLICT
          : HttpStatus.BAD_REQUEST,
      );
    }

    return result.data as UserDto;
  }

  @Get()
  async getAllUsers(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<UserDto[]> {
    const query = new GetAllUsersQuery({
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    const result = await this.queryBus.execute(query);

    if (result.isFailure) {
      throw new HttpException(
        {
          message: result.error,
          errorCode: result.errorCode,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.data as UserDto[];
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    const query = new GetUserQuery({ userId: id });
    const result = await this.queryBus.execute(query);

    if (result.isFailure) {
      throw new HttpException(
        {
          message: result.error,
          errorCode: result.errorCode,
        },
        result.errorCode === 'USER_NOT_FOUND'
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.data as UserDto;
  }

  @Get('by-email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<UserDto> {
    const query = new GetUserQuery({ email });
    const result = await this.queryBus.execute(query);

    if (result.isFailure) {
      throw new HttpException(
        {
          message: result.error,
          errorCode: result.errorCode,
        },
        result.errorCode === 'USER_NOT_FOUND'
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result.data as UserDto;
  }
}
