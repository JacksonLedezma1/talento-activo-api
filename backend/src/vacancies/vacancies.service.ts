import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../applications/application.entity';
import { Vacancy } from './vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacanciesRepository: Repository<Vacancy>,

    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
  ) { }

  create(dto: CreateVacancyDto) {
    const vacancy = this.vacanciesRepository.create({
      ...dto,
      isActive: true,
    });

    return this.vacanciesRepository.save(vacancy);
  }

  async findAll(userId?: number) {
    const vacancies = await this.vacanciesRepository
      .createQueryBuilder('vacancy')
      .loadRelationCountAndMap('vacancy.applicantsCount', 'vacancy.applications')
      .orderBy('vacancy.createdAt', 'DESC')
      .getMany();

    if (userId) {
      for (const vacancy of vacancies) {
        const application = await this.applicationsRepository.findOne({
          where: { vacancy: { id: vacancy.id }, user: { id: userId } },
        });
        vacancy.hasApplied = !!application;
        vacancy.applicationStatus = application?.status;
      }
    }

    return vacancies;
  }

  async findActive(userId?: number) {
    const vacancies = await this.vacanciesRepository
      .createQueryBuilder('vacancy')
      .loadRelationCountAndMap('vacancy.applicantsCount', 'vacancy.applications')
      .where('vacancy.isActive = :isActive', { isActive: true })
      .orderBy('vacancy.createdAt', 'DESC')
      .getMany();

    if (userId) {
      for (const vacancy of vacancies) {
        const application = await this.applicationsRepository.findOne({
          where: { vacancy: { id: vacancy.id }, user: { id: userId } },
        });
        vacancy.hasApplied = !!application;
        vacancy.applicationStatus = application?.status;
      }
    }

    return vacancies;
  }

  async findById(id: number) {
    const vacancy = await this.vacanciesRepository
      .createQueryBuilder('vacancy')
      .loadRelationCountAndMap('vacancy.applicantsCount', 'vacancy.applications')
      .where('vacancy.id = :id', { id })
      .getOne();

    if (!vacancy) {
      throw new NotFoundException('Vacante no encontrada.');
    }
    return vacancy;
  }

  async update(id: number, dto: UpdateVacancyDto) {
    const vacancy = await this.findById(id);

    if (dto.maxApplicants !== undefined) {
      const currentApplicants = await this.applicationsRepository.count({
        where: { vacancy: { id } },
      });

      if (dto.maxApplicants < currentApplicants) {
        throw new BadRequestException(
          `No puedes establecer un cupo menor que las postulaciones actuales (${currentApplicants}).`,
        );
      }
    }

    Object.assign(vacancy, dto);
    return this.vacanciesRepository.save(vacancy);
  }
}
