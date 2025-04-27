import { IsNumber, IsString, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  project_id: number;

  @IsNumber()
  reviewer_id: number;

  @IsNumber()
  reviewee_id: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}

export class UpdateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}