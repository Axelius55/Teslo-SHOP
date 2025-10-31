import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService
  ){}

  getStaticProductImage(imageName: string) {
    
    const path = join(__dirname, '../../static/uploads', imageName)

    if(!existsSync(path)){
        throw new BadRequestException(`No product found with image: ${imageName}`)
    }
    return path;

  }

  saveFile(file: Express.Multer.File) {
    const fs = require('fs');
    const path = require('path');

    const ext = file.mimetype.split('/')[1]; // 'jpeg', 'png', etc.
    const fileName = `${uuid()}.${ext}`; // uuid + extensión
    const uploadPath = path.join('./static/uploads', fileName); // Ruta completa

    // Escribe el archivo
    fs.writeFileSync(uploadPath, file.buffer);
    // Retorna la URL segura
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${fileName}`
    return secureUrl;
  }
}
