import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles.interface';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeSeed(){
    return this.seedService.runSeed()
  }

}
