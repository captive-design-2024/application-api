import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async saveData(@Body() projectDto: ProjectDto, @Req() req) {
    const userId = req.User.id;
    this.projectService.saveProject(projectDto, userId);
  }

  @Post('test')
  @UseGuards(JwtAuthGuard)
  async test(@Req() req) {
    const userId = req.User.id;
    return userId;
  }
}
