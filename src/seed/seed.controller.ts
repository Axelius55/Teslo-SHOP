import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { CreateProductDto } from 'src/products/dto/create-product.dto';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeSeed(){
    return this.seedService.runSeed()
  }

}
