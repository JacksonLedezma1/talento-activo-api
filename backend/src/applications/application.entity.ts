import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { User } from '../users/users.entities';
import { Vacancy } from '../vacancies/vacancy.entity';

@Entity('applications')
@Unique('uq_user_vacancy', ['user', 'vacancy'])
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @RelationId((application: Application) => application.user)
  userId: number;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vacancyId' })
  vacancy: Vacancy;

  @RelationId((application: Application) => application.vacancy)
  vacancyId: number;

  @CreateDateColumn()
  appliedAt: Date;
}
