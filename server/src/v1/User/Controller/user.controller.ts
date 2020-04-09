// Nest dependencies
import { Get, Param, Controller, Body, Patch, UseGuards, Headers, BadRequestException, HttpException, Post, Query } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

// Local files
import { jwtManipulationService } from 'src/shared/Services/jwt.manipulation.service'
import { UserService } from '../Service/user.service'
import { UpdateUserDto } from '../Dto/update-user.dto'
import { ActivateUserDto } from '../Dto/activate-user.dto'
import { ISerializeResponse } from 'src/shared/Services/serializer.service'

@ApiTags('v1/user')
@Controller()
export class UsersController {
    constructor(private readonly usersService: UserService) {}

    @Get(':username')
    getUser(@Param('username') username): Promise<ISerializeResponse> {
        return this.usersService.getUser(username)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':username')
    updateUser(
        @Param('username') username: string,
        @Body() dto: UpdateUserDto,
        @Headers('authorization') bearer: string,
    ): Promise<ISerializeResponse> {
        if (username !== jwtManipulationService.decodeJwtToken(bearer, 'username')) throw new BadRequestException()

        return this.usersService.updateUser(username, dto)
    }

    @Get('verfiy-update-email')
    async verifyUpdateEmail(@Query('token') token: string): Promise<HttpException> {
        return this.usersService.verifyUpdateEmail(token)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch('disable/:username')
    disableUser(
        @Param('username') username: string,
        @Headers('authorization') bearer: string,
    ): Promise<HttpException> {
        if (username !== jwtManipulationService.decodeJwtToken(bearer, 'username')) {
            throw new BadRequestException()
        }

        return this.usersService.disableUser(username)
    }

    @Post('send-activation-mail')
    async sendActivationMail(@Body() dto: ActivateUserDto): Promise<HttpException> {
        return this.usersService.sendActivationMail(dto)
    }

    @Get('activate-user')
    async activateUser(@Query('token') token: string): Promise<HttpException> {
        return this.usersService.activateUser(token)
    }
}
