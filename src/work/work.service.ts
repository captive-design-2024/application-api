import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WorkService {
  constructor(private readonly httpService: HttpService) {}

  async generateSubtitle(data: any): Promise<any> {
    const url = 'http://localhost:4000/generate-subtitle';
    try {
      const response = await this.httpService.post(url, data);
      return response;
    } catch (error) {
      throw new Error(`Failed to generate subtitle: ${error.message}`);
    }
  }
}
