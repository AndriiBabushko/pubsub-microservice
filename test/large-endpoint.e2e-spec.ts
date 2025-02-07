import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Pub/Sub Microservice - Large Payload (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should accept and process a large JSON payload (100+ KB)', async () => {
    const largeArray: any[] = [];

    for (let i = 0; i < 150; i++) {
      largeArray.push({
        id: i,
        name: `Test Name ${i}`,
        email: `test${i}@example.com`,
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10),
      });
    }

    const largePayload = {
      data: largeArray,
    };

    const jsonString = JSON.stringify(largePayload);
    console.log('Payload size in bytes:', Buffer.byteLength(jsonString, 'utf8'));

    const response = await request(app.getHttpServer())
      .post('/topics/large')
      .set('Content-Type', 'application/json')
      .send(largePayload);

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
    expect(response.body).toEqual({ success: true });
  });
});
