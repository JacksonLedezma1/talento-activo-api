import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { Vacancy } from '../vacancies/vacancy.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,

    @InjectRepository(Vacancy)
    private readonly vacanciesRepository: Repository<Vacancy>,
  ) { }

  async createApplication(input: { userId: number; vacancyId: number }) {
    const vacancy = await this.vacanciesRepository.findOne({
      where: { id: input.vacancyId },
    });

    if (!vacancy) {
      throw new NotFoundException('Vacante no encontrada.');
    }

    if (!vacancy.isActive) {
      throw new BadRequestException('La vacante está inactiva.');
    }

    const alreadyApplied = await this.applicationsRepository.findOne({
      where: {
        user: { id: input.userId },
        vacancy: { id: input.vacancyId },
      },
    });

    if (alreadyApplied) {
      throw new BadRequestException(
        'No puedes postularte dos veces a la misma vacante.',
      );
    }

    const currentApplicants = await this.applicationsRepository.count({
      where: { vacancy: { id: input.vacancyId } },
    });

    if (currentApplicants >= vacancy.maxApplicants) {
      throw new BadRequestException(
        'No se permiten postulaciones: cupo completo.',
      );
    }

    const activeApplicationsCount = await this.applicationsRepository
      .createQueryBuilder('application')
      .innerJoin('application.vacancy', 'vacancy')
      .where('application.userId = :userId', { userId: input.userId })
      .andWhere('vacancy.isActive = :active', { active: true })
      .getCount();

    if (activeApplicationsCount >= 3) {
      throw new BadRequestException(
        'No puedes postularte a más de tres vacantes activas.',
      );
    }

    const application = this.applicationsRepository.create({
      user: { id: input.userId } as any,
      vacancy: { id: input.vacancyId } as any,
    });

    return this.applicationsRepository.save(application);
  }

  findAll(input?: { vacancyId?: number; userId?: number }) {
    const where: any = {};

    if (input?.vacancyId) {
      where.vacancy = { id: input.vacancyId };
    }

    if (input?.userId) {
      where.user = { id: input.userId };
    }

    return this.applicationsRepository.find({
      where,
      relations: { user: true, vacancy: true },
      order: { appliedAt: 'DESC' },
    });
  }
}
