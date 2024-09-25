import { Injectable } from '@nestjs/common';
import { ProjectDto } from './dto/project.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}

  saveProject(projectDto: ProjectDto, userId: string) {
    const video_link = this.extractVideoId(projectDto.project_url);

    this.prismaService.project.create({
      data: {
        userId: userId,
        link: video_link,
        name: projectDto.project_name,
      },
    });
  }

  extractVideoId(url: string) {
    // 정규 표현식으로 유튜브 비디오 ID 추출
    const regex =
      /(?:youtube\.com\/(?:.*v=|v\/|embed\/|.*\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    // 정규 표현식으로 ID 추출 시도
    const match = url.match(regex);

    // 추출된 ID 반환 또는 null 반환
    return match ? match[1] : null;
  }
}
