import {
  Controller,
  Post,
  Req,
  UseGuards,
  Body,
  Get,
  Delete,
} from '@nestjs/common';
import { ProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async saveData(@Body() projectDto: ProjectDto, @Req() req) {
    const userId = req.user.id;
    this.projectService.saveProject(projectDto, userId);
  }

  @Get('title')
  @UseGuards(JwtAuthGuard)
  async sendTitles(@Req() req) {
    const findProjects = await this.projectService.findProjects(req.user.id);
    const number = findProjects.length;
    const projectNames = findProjects.map( project => project.name );
    return { number, projectNames };
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteProject(@Body('title') title: string, @Req() req) {
    await this.projectService.deleteProject(title, req.user.id);
  }
}
