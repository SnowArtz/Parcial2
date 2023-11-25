import { Controller, UseInterceptors, Get, Post, Param, Body} from '@nestjs/common';
import { PerformerService } from './performer.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PerformerDto } from './performer.dto';
import { PerformerEntity } from './performer.entity';
import { plainToInstance } from 'class-transformer';

@Controller('performers')
@UseInterceptors(BusinessErrorsInterceptor)
export class PerformerController {
    constructor(private readonly performerService: PerformerService) {}

    @Get()
    async findAll() {
        return await this.performerService.findAll();
    }

    @Get(':performerId')
    async findOne(@Param('performerId') performerId: string) {
        return await this.performerService.findOne(performerId);
    }

    @Post()
    async create(@Body() performerDto: PerformerDto) {
        const performer: PerformerEntity = plainToInstance(PerformerEntity, performerDto);
        return await this.performerService.create(performer);
    }

}
