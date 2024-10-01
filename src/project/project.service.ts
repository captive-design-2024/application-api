import { Injectable } from '@nestjs/common';
import { ProjectDto } from './dto/project.dto';
import { PrismaService } from '../prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ProjectService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async saveProject(dto: ProjectDto, userId: string) {
    //const video_link = this.extractVideoId(projectDto.project_url);
    const findUser = await this.userService.findByLoginId(userId);

    await this.prismaService.project.create({
      data: {
        userId: findUser.id,
        link: dto.project_url,
        name: dto.project_title,
      },
    });
  }

  async findProjects(id: string) {
    const findUser = await this.userService.findByLoginId(id);
    return await this.prismaService.project.findMany({
      where: { userId: findUser.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteProject(title: string, userId: string) {
    const findUser = await this.userService.findByLoginId(userId);
    await this.prismaService.project.deleteMany({
      where: { userId: findUser.id, name: title },
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
