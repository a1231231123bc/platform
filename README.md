# Platform — поиск и привлечение исполнителей для работ

Платформа для упрощения поиска, коммуникации и привлечения исполнителей
(частники и юрлица) под разовые и регулярные заказы
— в первую очередь для рынка РФ и B2B / гос-подрядов.

---

## Статус проекта

**Active development (MVP stage)**

Реализовано:
- Backend API с аутентификацией (session + cookie)
- CRUD для заказов, исполнителей и приглашений
- Валидация входных данных
- Swagger-документация
- 52 теста (46 unit + 6 e2e)

---

## Проблема, которую решаем

### Со стороны заказчика
- Поиск исполнителей (водители, камазисты, спецтехника, поставщики) занимает много времени
- Коммуникация идёт вручную: звонки, WhatsApp, Excel
- Выгорание сотрудников из-за постоянных однотипных разговоров
- Нет прозрачной картины: кто доступен, кто откликнулся, кто отказался

### Со стороны исполнителя
- Заказы приходят хаотично
- Нет единого канала получения предложений
- Много "пустых" звонков
- Нет прозрачных условий до начала разговора

---

## Ценность платформы

Платформа берёт на себя:
- централизованный учёт исполнителей
- рассылку заказов по подходящим кандидатам
- сбор откликов в структурированном виде
- минимизацию ручных звонков и стресса

**Результат:**
- заказчик быстрее закрывает потребность
- исполнитель получает только релевантные предложения
- коммуникация становится управляемой и масштабируемой

---

## Архитектура

### Стек
- **NestJS 11** — API и бизнес-логика
- **Prisma 6** — ORM, миграции, seed
- **PostgreSQL** — основная база данных
- **Passport + express-session** — аутентификация (session + cookie)
- **bcrypt** — хэширование паролей
- **class-validator** — валидация DTO
- **Swagger** — автогенерируемая документация API
- **Jest + Supertest** — unit и E2E тесты
- **pnpm** — менеджер пакетов

### Доменные сущности

| Модель | Описание |
|--------|----------|
| **User** | Аккаунт заказчика (email, пароль, имя) |
| **Contractor** | Исполнитель (частник / ИП / компания) |
| **Job** | Заказ (заголовок, описание, регион, цена, статус) |
| **Invite** | Приглашение исполнителю на заказ (PENDING / ACCEPTED / DECLINED) |

### MVP-флоу
1. Регистрация / вход заказчика
2. Создание заказа
3. Подбор подходящих исполнителей
4. Отправка приглашений
5. Исполнитель принимает или отклоняет

---

## API-эндпоинты

### Auth
| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| POST | `/auth/register` | публичный | Регистрация |
| POST | `/auth/login` | публичный | Вход (устанавливает cookie) |
| POST | `/auth/logout` | авторизованный | Выход |
| GET | `/auth/me` | авторизованный | Текущий пользователь |

### Contractors
| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/contractors` | публичный | Список (фильтр: `?region=...&type=...`) |
| POST | `/contractors` | публичный | Создать исполнителя |

### Jobs
| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/jobs` | авторизованный | Список (фильтр: `?status=...&region=...`) |
| GET | `/jobs/:id` | авторизованный | Получить заказ по ID |
| POST | `/jobs` | авторизованный | Создать заказ |
| PATCH | `/jobs/:id/status` | авторизованный | Изменить статус (DRAFT -> ACTIVE -> CLOSED) |

### Invites
| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| POST | `/jobs/:jobId/invites` | авторизованный | Отправить приглашение |
| GET | `/jobs/:jobId/invites` | авторизованный | Список приглашений по заказу |
| PATCH | `/invites/:id/status` | авторизованный | Принять / отклонить |

Swagger UI доступен на `http://localhost:3000/api/docs`.

---

## Локальный запуск

### Требования
- Node.js **20.19+**
- pnpm **8+**
- Доступ к PostgreSQL

### Установка и запуск
```bash
pnpm install
npx prisma migrate deploy
npx prisma generate
pnpm start:dev
```

### Переменные окружения (`.env`)
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=public
SESSION_SECRET=your-secret
PORT=3000
```

### Заполнение тестовыми данными
```bash
npx prisma db seed
```

---

## Тесты

### Unit-тесты (46 тестов)

```bash
pnpm test
```

| Файл | Тестов | Что проверяется |
|------|--------|-----------------|
| `auth.service.spec.ts` | 6 | Регистрация (успех, дубль email), валидация пароля (верный, неверный, юзер не найден), поиск по ID |
| `auth.controller.spec.ts` | 4 | register, login, logout, me — делегирование в сервис |
| `jobs.service.spec.ts` | 8 | Создание с ACTIVE статусом, фильтрация, findOne, 404, переходы статусов (DRAFT->ACTIVE, ACTIVE->CLOSED, запрет обратных) |
| `jobs.controller.spec.ts` | 4 | create, findAll, findOne, updateStatus — делегирование |
| `contractors.service.spec.ts` | 5 | Создание, фильтрация по region, type, комбинация фильтров, отображение только активных |
| `contractors.controller.spec.ts` | 3 | create, findAll — делегирование |
| `invites.service.spec.ts` | 8 | Создание (успех, job not found, contractor not found), список по заказу, принятие, отклонение, повторное изменение статуса, invite not found |
| `invites.controller.spec.ts` | 3 | create, findByJob, updateStatus — делегирование |
| `app.controller.spec.ts` | 1 | Healthcheck |

Подход: каждый сервис тестируется с мок-PrismaService (`jest.fn()`). Контроллеры тестируются с мок-сервисом.

### E2E-тесты (6 тестов)

```bash
pnpm test:e2e
```

| Тест | Что проверяется |
|------|-----------------|
| `POST /auth/register` (невалидные данные) | Возвращает 400 при некорректном email/коротком пароле |
| `POST /auth/register` (валидные данные) | Создаёт пользователя, не возвращает пароль в ответе |
| `GET /jobs` (без авторизации) | Возвращает 403 |
| `POST /jobs` (без авторизации) | Возвращает 403 |
| `GET /contractors` (без авторизации) | Возвращает 200 — публичный эндпоинт |
| `POST /contractors` (невалидные данные) | Возвращает 400 при пустом name |

E2E тесты поднимают полное NestJS-приложение с мок-PrismaService, session и passport middleware.

---

## Структура проекта

```
backend/
  prisma/
    schema.prisma          # Модели: User, Job, Contractor, Invite
    migrations/            # SQL-миграции
    seed.ts                # Тестовые данные
  src/
    main.ts                # Bootstrap: CORS, session, passport, Swagger
    app.module.ts          # Корневой модуль
    logging.middleware.ts   # HTTP логирование
    prisma/                # PrismaService (глобальный)
    auth/                  # Аутентификация (passport-local, session)
      dto/                 # RegisterDto, LoginDto
      auth.service.ts      # register, validateUser, findById
      auth.controller.ts   # /auth/*
      local.strategy.ts    # Passport LocalStrategy
      session.serializer.ts
      authenticated.guard.ts
      local-auth.guard.ts
    jobs/                  # Заказы
      dto/                 # CreateJobDto, FilterJobsDto, UpdateJobStatusDto
      jobs.service.ts      # CRUD + статусные переходы
      jobs.controller.ts   # /jobs/* (защищён AuthenticatedGuard)
    contractors/           # Исполнители
      dto/                 # CreateContractorDto, FilterContractorsDto
      contractors.service.ts
      contractors.controller.ts
    invites/               # Приглашения
      dto/                 # CreateInviteDto, UpdateInviteStatusDto
      invites.service.ts   # create, findByJob, updateStatus
      invites.controller.ts # /jobs/:id/invites, /invites/:id/status
  test/
    app.e2e-spec.ts        # E2E тесты
```
