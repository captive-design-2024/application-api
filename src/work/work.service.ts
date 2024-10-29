import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { insertPathDto, ContentFormat, ContentLanguage } from './dto/work.dto';
import axios from 'axios';

@Injectable()
export class WorkService {
  constructor(private prismaService: PrismaService) {}

  async generateSubtitle(project_id: string): Promise<string> {
    const workerURL = 'http://host.docker.internal:4000/generate-subtitle';

    const record = await this.prismaService.project.findUnique({
      where: { id: project_id },
    });

    if (!record) {
      throw new NotFoundException(`Project with ID ${project_id} not found.`);
    }

    try {
      const response = await axios.post(
        workerURL,
        { url: record.link },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const insertDto: insertPathDto = {
        content_projectID: project_id,
        content_format: ContentFormat.caption,
        content_language: ContentLanguage.kr,
        content_path: response.data,
      };

      await this.insertPath(insertDto);

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Failed to generateSubtitle: ${errorMessage}`);
    }
  }

  async insertPath(dto: insertPathDto) {
    const {
      content_projectID,
      content_format,
      content_language,
      content_path,
    } = dto;
    let model;
    const data: { [key: string]: string } = {};

    switch (content_format) {
      case ContentFormat.caption:
        model = this.prismaService.caption;
        data[content_language] = content_path;
        break;

      case ContentFormat.voice:
        model = this.prismaService.voice;
        data[content_language] = content_path;
        break;

      default:
        throw new Error(`Unsupported format: ${content_format}`);
    }

    try {
      const record = await model.upsert({
        where: { urlId: content_projectID },
        update: data,
        create: {
          urlId: content_projectID,
          en: data.en || '',
          kr: data.kr || '',
          ...data,
        },
      });

      return record;
    } catch (error) {
      throw new Error(`insertPath error: ${error.message}`);
    }
  }

  async generateDubbing(id: string) {
    const workerURL = 'http://host.docker.internal:4000/generate-dubbing';
    const record = await this.prismaService.caption.findUnique({
      where: { urlId: id },
    });
    try {
      const response = await axios.post(workerURL, { srtFilePath: record.en });

      const voiceData: any = {
        urlId: id,
        en: response.data,
      };

      const existingVoice = await this.prismaService.voice.findUnique({
        where: { urlId: id },
      });

      if (existingVoice) {
        await this.prismaService.voice.update({
          where: { urlId: id },
          data: voiceData,
        });
      } else {
        await this.prismaService.voice.create({
          data: voiceData,
        });
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async generateVCDubbing(id: string) {
    const workerURL = 'http://host.docker.internal:4000/generate-vc-dubbing';
    const record = await this.prismaService.caption.findUnique({
      where: { urlId: id },
    });
    try {
      const response = await axios.post(workerURL, { srtFilePath: record.en });

      const voiceData: any = {
        urlId: id,
        en: response.data,
      };

      const existingVoice = await this.prismaService.voice.findUnique({
        where: { urlId: id },
      });

      if (existingVoice) {
        await this.prismaService.voice.update({
          where: { urlId: id },
          data: voiceData,
        });
      } else {
        await this.prismaService.voice.create({
          data: voiceData,
        });
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async llm_check(project_id: string, language: string, content: string) {
    const workerURL = 'http://host.docker.internal:4000/llm/check';
    const n_lang = await this.normalize_lang(language);
    const record = await this.prismaService.caption.findUnique({
      where: { urlId: project_id },
    });
    const response = await axios.post(workerURL, {
      content: content,
      language: n_lang,
      filename: record.kr,
    });
    const insertDto: insertPathDto = {
      content_projectID: project_id,
      content_format: ContentFormat.caption,
      content_language: ContentLanguage.kr,
      content_path: response.data,
    };
    await this.insertPath(insertDto);
    return response.data;
  }

  async llm_recommend(content: string, language: string) {
    const workerURL = 'http://host.docker.internal:4000/llm/recommend';
    const n_lang = await this.normalize_lang(language);
    const response = await axios.post(workerURL, {
      content: content,
      language: n_lang,
    });
    return response.data;
  }

  async llm_translate(project_id: string, language: string, content: string) {
    const workerURL = 'http://host.docker.internal:4000/llm/translate';
    const n_lang = await this.normalize_lang(language);
    const record = await this.prismaService.caption.findUnique({
      where: { urlId: project_id },
    });
    const response = await axios.post(workerURL, {
      content: content,
      language: n_lang,
      filename: record.kr,
    });
    const insertDto: insertPathDto = {
      content_projectID: project_id,
      content_format: ContentFormat.caption,
      content_language: language as ContentLanguage,
      content_path: response.data,
    };
    await this.insertPath(insertDto);
    return response.data;
  }

  async generateljs(modelname: string, modelurl: string[], login_id: string) {
    const workerURL = 'http://host.docker.internal:4000/generate-ljs-links';
    try {
      const response = await axios.post(workerURL, { links: modelurl });

      const findUser = await this.prismaService.user.findUnique({
        where: { login_id: login_id },
      });

      await this.prismaService.tTS.create({
        data: {
          name: modelname,
          model_link: modelurl,
          dataset: response.data,
          userId: findUser.id,
        },
      });
      return 'success';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async normalize_lang(language: string): Promise<string> {
    switch (language) {
      case 'en':
        return 'english';
      case 'ko':
        return 'korean';
      case 'kr':
        return 'korean';
      case 'es':
        return 'espanol';
      case 'fr':
        return 'french';
      case 'de':
        return 'deutch';
      case 'ja':
        return 'japanese';
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  async test(modelname: string, modelurl: string[], login_id: string) {
    try {
      const findUser = await this.prismaService.user.findUnique({
        where: { login_id: login_id },
      });

      await this.prismaService.tTS.create({
        data: {
          name: modelname,
          model_link: modelurl,
          dataset: 'akgohaijweofisjl/oawhag',
          userId: findUser.id,
        },
      });
      return 'success';
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
