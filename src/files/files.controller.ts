import {
  Controller,
  Post,
  UploadedFile,
  ParseFilePipe,
  UseInterceptors,
  MaxFileSizeValidator,
  FileTypeValidator,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { memoryStorage } from 'multer';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,

  ) {}


  @Get('product/:imageName')
  findOneImage(@Res() res: Response, @Param('imageName') imageName: string){

    const path = this.filesService.getStaticProductImage(imageName);


    res.sendFile(path);

/*     res.status(403).json({
      ok: false,
      path: path
    }) */
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: memoryStorage(),
      //storage: diskStorage({ destination: './static/uploads', }),
    }),
  )
  uploadProducImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500 * 1024 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.saveFile(file);
  }
}
