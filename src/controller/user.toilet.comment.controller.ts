import { Controller } from '@nestjs/common';
import { UserToiletCommentService } from '../service/user.toilet.comment.service';

@Controller('user.toilet.comment')
export class UserToiletCommentController {
  constructor(
    private readonly userToiletCommentService: UserToiletCommentService,
  ) {}
}
