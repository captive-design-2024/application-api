import {
  Controller,
  Post,
  Req,
  UseGuards,
  Body,
  Get,
  Delete, Param
} from "@nestjs/common";
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
    const projectNames = findProjects.map((project) => project.name);
    const projectIDs = findProjects.map((project) => project.id);
    return { number, projectNames, projectIDs };
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteProject(@Body('title') title: string, @Req() req) {
    await this.projectService.deleteProject(title, req.user.id);
  }
}

@Controller()
export class ProjectController2 {
  constructor(private readonly projectService: ProjectService) {}

  @Get('Edit/:id')
  @UseGuards(JwtAuthGuard)
  async getLink(@Param('id') id: string) {
    const response = await this.projectService.findLinkByProjectId(id);
    const videoId = this.projectService.extractVideoId(response);
    return 'www.youtube.com/embed/' + videoId;
  }
}