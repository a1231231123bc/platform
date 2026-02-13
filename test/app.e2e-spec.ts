import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import session from 'express-session';
import passport from 'passport';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('App (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    job: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    contractor: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    invite: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(
      session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('POST /auth/register — should validate input', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'not-email', password: '12' })
        .expect(400);
    });

    it('POST /auth/register — should register with valid data', async () => {
      const user = {
        id: 'uuid-1',
        email: 'test@test.com',
        password: '$2b$10$hash',
        name: 'Test',
        createdAt: new Date(),
      };
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(user);

      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'test@test.com', password: '123456', name: 'Test' })
        .expect(201);

      expect(res.body.email).toBe('test@test.com');
      expect(res.body).not.toHaveProperty('password');
    });
  });

  describe('Protected routes', () => {
    it('GET /jobs — should return 403 without auth', () => {
      return request(app.getHttpServer()).get('/jobs').expect(403);
    });

    it('POST /jobs — should return 403 without auth', () => {
      return request(app.getHttpServer())
        .post('/jobs')
        .send({ title: 'Test', region: 'Moscow', price: 1000 })
        .expect(403);
    });
  });

  describe('Contractors (public)', () => {
    it('GET /contractors — should be accessible without auth', () => {
      mockPrisma.contractor.findMany.mockResolvedValue([]);

      return request(app.getHttpServer()).get('/contractors').expect(200);
    });

    it('POST /contractors — should validate input', () => {
      return request(app.getHttpServer())
        .post('/contractors')
        .send({ name: '' })
        .expect(400);
    });
  });
});
