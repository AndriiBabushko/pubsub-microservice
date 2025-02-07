import { Controller, Post, Param, Body, Sse } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageEvent } from '@nestjs/common';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Post(':topic')
  async publishMessage(
    @Param('topic') topic: string,
    @Body() body: any,
  ) {
    await this.topicsService.publish(topic, body);
    return { success: true };
  }

  @Sse(':topic')
  subscribeTopic(@Param('topic') topic: string): Observable<MessageEvent> {
    return this.topicsService.subscribe(topic).pipe(
      map(data => ({ data }))
    );
  }
}
