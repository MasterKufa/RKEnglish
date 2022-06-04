import { Controller, Get, Post, Req } from '@nestjs/common';
import { ReqWithUser } from 'src/auth/types';
import { ROUTES } from 'src/routes.constants';
import { WordPayload, WordToLearn } from './types';
import { WordsService } from './wordsToLearn.service';

@Controller(ROUTES.API.WORDS.BASE)
export class WordsController {
  constructor(private wordsService: WordsService) {}

  @Post(ROUTES.API.WORDS.ADD_ONE)
  addWord(@Req() request: ReqWithUser<WordPayload>): Promise<void> {
    return this.wordsService.addOne({
      ...request.body,
      user: request.user,
    });
  }

  @Get(ROUTES.API.WORDS.ALL)
  findByFilters(): Promise<WordToLearn[]> {
    return this.wordsService.findByFilters();
  }
}