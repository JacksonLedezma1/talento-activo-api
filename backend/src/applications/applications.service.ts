import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './application.entity';
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
      .where('application.userId = :userId', { userId: input.userId })
      .andWhere('application.status IN (:...statuses)', {
        statuses: [ApplicationStatus.ACTIVA, ApplicationStatus.EN_PROCESO]
      })
      .getCount();

    if (activeApplicationsCount >= 3) {
      throw new BadRequestException(
        'Ya tienes 3 postulaciones en curso. Debes esperar a que finalice alguna para aplicar a otra.',
      );
    }

    const application = this.applicationsRepository.create({
      user: { id: input.userId } as any,
      vacancy: { id: input.vacancyId } as any,
    });

    return this.applicationsRepository.save(application);
  }

  findAll(input?: { vacancyId?: number; userId?: number }) {
    const query = this.applicationsRepository.createQueryBuilder('application')
      .leftJoinAndSelect('application.user', 'user')
      .leftJoinAndSelect('application.vacancy', 'vacancy')
      .loadRelationCountAndMap('vacancy.applicantsCount', 'vacancy.applications');

    if (input?.vacancyId) {
      query.andWhere('application.vacancyId = :vacancyId', { vacancyId: input.vacancyId });
    }

    if (input?.userId) {
      query.andWhere('application.userId = :userId', { userId: input.userId });
    }

    return query
      .orderBy('application.appliedAt', 'DESC')
      .getMany();
  }
  async updateStatus(id: number, status: ApplicationStatus) {
    const application = await this.applicationsRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Aplicación no encontrada.');
    }

    application.status = status;
    return this.applicationsRepository.save(application);
  }

  async remove(id: number) {
    const application = await this.applicationsRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Aplicación no encontrada.');
    }

    if (application.status !== ApplicationStatus.ACTIVA) {
      throw new BadRequestException(
        'Solo se pueden eliminar postulaciones que no hayan iniciado el proceso (estado "Activa").',
      );
    }

    return this.applicationsRepository.remove(application);
  }
}
