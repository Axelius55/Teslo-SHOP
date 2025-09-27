import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { CreateProductDto } from 'src/products/dto/create-product.dto';
import { initialData } from './Data/product.seed';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();
    return "ejecutado"
  }

  private async insertNewProducts() {
    await this.productService.deleteAllProducts();

    const productSeed = initialData.products;
    //const insertPromises: Promise<any>[] = [];
    const insertPromises = [];

    productSeed.map(product => {
      //insertPromises.push(this.productService.create(product))
      this.productService.create(product)
    })
    await Promise.all(insertPromises);
    return true;
  }
}
