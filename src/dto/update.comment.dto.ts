import { IsInt } from 'class-validator';
import { CreateCommentDto } from './create.comment.dto';

export class UpdateCommentDto extends CreateCommentDto {
  @IsInt()
  commentId: number;
}
