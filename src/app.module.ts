import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TopicsModule } from './topics/topics.module';

@Module({
  imports: [TopicsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
