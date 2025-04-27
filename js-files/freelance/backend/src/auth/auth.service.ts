import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ClientService } from '../client/client.service';
import { FreelancerService } from '../freelancer/freelancer.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private clientService: ClientService,
    private freelancerService: FreelancerService,
  ) {}

  // JWT configuration
  private jwtConstants = {
    accessSecret: 'your_access_secret_key', 
    refreshSecret: 'your_refresh_secret_key',
    accessExpiresIn: '5hr',
    refreshExpiresIn: '7d',
  };

  async validateClient(email: string, password: string) {
    console.log('Password provided:', password); 
    const client = await this.clientService.findByEmail(email, true); // Include passwordHash
    if (!client) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log('Client passwordHash:', client.passwordHash);
    const isPasswordValid = await bcrypt.compare(password, client.passwordHash); // Use passwordHash
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
      role: 'client',
    };
    
    return this.generateTokens(payload);
  }

  async loginFreelancer(freelancer: any) {
    const payload = { 
      sub: freelancer.id,
      email: freelancer.email,
      role: 'freelancer',
    };
    
    return this.generateTokens(payload);
  }

  async refreshTokens(userId: string, role: string, refreshToken: string) {
    let user;
    
    if (role === 'client') {
      user = await this.clientService.findOne(userId);
    } else if (role === 'freelancer') {
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

    // In a real app, you would save the hashed refresh token in the database
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    
    if (payload.role === 'client') {
      await this.clientService.updateRefreshToken(payload.sub, hashedRefreshToken);
    } else if (payload.role === 'freelancer') {
      await this.freelancerService.updateRefreshToken(payload.sub, hashedRefreshToken);
    }
    
    return {
      accessToken,
      refreshToken,
    };
  }

  async removeRefreshToken(userId: string, role: string) {
    if (role === 'client') {
      return this.clientService.updateRefreshToken(userId, "null");
    } else if (role === 'freelancer') {
      return this.freelancerService.updateRefreshToken(userId, null);
    }
  }
}