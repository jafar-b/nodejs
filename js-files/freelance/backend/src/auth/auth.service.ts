import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ClientService } from '../client/client.service';
import { FreelancerService } from '../freelancer/freelancer.service';
import { UserRole } from 'src/enums/allEnums';
import * as dotenv from 'dotenv';
import { log } from 'console';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private clientService: ClientService,
    private freelancerService: FreelancerService,
  ) {}

  private jwtConstants = {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your_access_secret_key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRATION || '5h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  };

  async validateClient(email: string, password: string) {
    console.log('Password provided:', password); 
    const client = await this.clientService.findByEmail(email, true); // Include passwordHash
    if (!client) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log('Client passwordHash:', client.passwordHash);
    const isPasswordValid = await bcrypt.compare(password, client.passwordHash); 
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    return client; // Directly return the client object without sanitizing
  }

  async validateFreelancer(email: string, password: string) {
    
    const freelancer = await this.freelancerService.findByEmail(email);
    if (!freelancer) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, freelancer.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return freelancer;
  }

  async loginClient(client: any) {
    const payload = { 
      sub: client.id,
      email: client.email,
      role: UserRole.CLIENT,
    };
    
    return this.generateTokens(payload);
  }

  async loginFreelancer(freelancer: any) {
    const payload = { 
      sub: freelancer.id,
      email: freelancer.email,
      role: UserRole.FREELANCER,
    };
    
    return this.generateTokens(payload);
  }

  async refreshTokens(userId: string, role: string, refreshToken: string) {
    let user;
    
    if (role === UserRole.CLIENT) {
      user = await this.clientService.findOne(userId);
    } else if (role === UserRole.FREELANCER) {
      user = await this.freelancerService.findOne(userId);
    } else {
      throw new UnauthorizedException('Invalid role');
    }
    
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    const payload = { sub: user.id, email: user.email, role };
    return this.generateTokens(payload);
  }

  async generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.jwtConstants.accessSecret,
      expiresIn: this.jwtConstants.accessExpiresIn,
    });
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtConstants.refreshSecret,
      expiresIn: this.jwtConstants.refreshExpiresIn,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);    
    if (payload.role === UserRole.CLIENT) {
      await this.clientService.updateRefreshToken(payload.sub, hashedRefreshToken);
    } else if (payload.role === UserRole.FREELANCER) {
      await this.freelancerService.updateRefreshToken(payload.sub, hashedRefreshToken);
    }
    
    return {
      accessToken,
      refreshToken,
    };
  }

  async removeRefreshToken(userId: string, role: string) {
    if (role === UserRole.CLIENT) {
      return this.clientService.updateRefreshToken(userId, "null");
    } else if (role === UserRole.FREELANCER) {
      return this.freelancerService.updateRefreshToken(userId, null);
    }
  }

  async login(email: string, password: string) {
    // Try freelancer login first
    try {
      const freelancer = await this.validateFreelancer(email, password);
      const tokens = await this.loginFreelancer(freelancer);
      log( {token: tokens,
        user: {
          id: freelancer.id,
          email: freelancer.email,
          role: UserRole.FREELANCER,
          firstName: freelancer.firstName,
          lastName: freelancer.lastName,
    }})

      return {
        ...tokens,
        user: {
          id: freelancer.id,
          email: freelancer.email,
          role: UserRole.FREELANCER,
          firstName: freelancer.firstName,
          lastName: freelancer.lastName,
        }
      };
    } catch (error) {
      // If freelancer login fails, try client login
      try {
        const client = await this.validateClient(email, password);
        const tokens = await this.loginClient(client);
        log( {token: tokens,
          user: {
            id: client.id,
            email: client.email,
            role: UserRole.CLIENT,
            firstName: client.firstName,
            lastName: client.lastName,
      }})

        return {
          ...tokens,
          user: {
            id: client.id,
            email: client.email,
            role: UserRole.CLIENT,
            firstName: client.firstName,
            lastName: client.lastName,
          }
        };
      } catch (error) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }
  }
}