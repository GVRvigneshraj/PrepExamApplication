import { ExamDto } from '../dto/exam.dto';

export function mapExamDtoToModel(dto: ExamDto): ExamDto {
  return {
    id: dto.id,
    name: dto.name,
    logo: dto.logo,
    color: dto.color,
    description: dto.description,
    isActive: dto.isActive,
  };
}

export function mapExamListToModel(dtos: ExamDto[]): ExamDto[] {
  return dtos.map(mapExamDtoToModel);
}
