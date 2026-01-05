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

  findAll() {
    return this.vacanciesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  findActive() {
    return this.vacanciesRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number) {
    const vacancy = await this.vacanciesRepository.findOne({ where: { id } });
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
