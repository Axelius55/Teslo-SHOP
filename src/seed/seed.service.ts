import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './Data/product.seed';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();

    const firstUser = await this.insertUsers();

    await this.insertNewProducts(firstUser);
    return 'ejecutado';
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });
    const dbUsers = await this.userRepository.save(seedUsers);

    return dbUsers[0];

  }

  private async deleteTables() {
    await this.productService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertNewProducts(user: User) {
    await this.productService.deleteAllProducts();

    const productSeed = initialData.products;
    //const insertPromises: Promise<any>[] = [];
    const insertPromises = [];

    productSeed.map((product) => {
      this.productService.create(product, user);
    });
    await Promise.all(insertPromises);
    return true;
  }
}
