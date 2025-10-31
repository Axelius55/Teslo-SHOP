import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    // Aquí indicamos el tipo explícitamente
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),                 //Dice donde encontrar el JWT
      ignoreExpiration: false,                                                  //Estara atento a la expiración 
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',  //Que llave usará si no hay usara el default
    };

    super(options);
  }

  async validate(payload: any): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
        throw new UnauthorizedException('Token not valid');
    }

    if(!user.isActive){
        throw new UnauthorizedException('User is inactive, talk with an admin');
    }

    return user; // se inyecta en req.user
  }
}
