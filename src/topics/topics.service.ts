import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { Observable } from 'rxjs';

@Injectable()
export class TopicsService implements OnModuleDestroy {
  private publisher: RedisClientType;

  constructor() {
    this.publisher = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    this.publisher.connect().catch(console.error);
  }

  async publish(topic: string, data: any): Promise<void> {
    await this.publisher.publish(topic, JSON.stringify(data));
  }

  subscribe(topic: string): Observable<any> {
    return new Observable(observer => {
      const subscriber = this.publisher.duplicate();

      subscriber.connect()
        .then(() => {
          // Підписка на канал (топік)
          subscriber.subscribe(topic, (message) => {
            try {
              observer.next(JSON.parse(message));
            } catch (e) {
              observer.next(message);
            }
          }).catch(err => observer.error(err));
        })
        .catch(err => observer.error(err));

      return () => {
        subscriber.unsubscribe(topic)
          .then(() => subscriber.quit())
          .catch(console.error);
      };
    });
  }

  async onModuleDestroy() {
    await this.publisher.quit();
  }
}
