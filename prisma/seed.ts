import { PrismaClient, ContractorType, JobStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Contractors
  const contractors = await Promise.all([
    prisma.contractor.create({
      data: {
        name: 'Иванов Алексей',
        phone: '+79001234501',
        type: ContractorType.INDIVIDUAL,
        region: 'Москва',
      },
    }),
    prisma.contractor.create({
      data: {
        name: 'ООО "СпецТранс"',
        phone: '+79001234502',
        type: ContractorType.COMPANY,
        region: 'Москва',
      },
    }),
    prisma.contractor.create({
      data: {
        name: 'ИП Петров С.В.',
        phone: '+79001234503',
        type: ContractorType.IP,
        region: 'Санкт-Петербург',
      },
    }),
    prisma.contractor.create({
      data: {
        name: 'Сидоров Дмитрий',
        phone: '+79001234504',
        type: ContractorType.INDIVIDUAL,
        region: 'Казань',
      },
    }),
    prisma.contractor.create({
      data: {
        name: 'ООО "ГрузМастер"',
        phone: '+79001234505',
        type: ContractorType.COMPANY,
        region: 'Санкт-Петербург',
      },
    }),
  ]);

  console.log(`Created ${contractors.length} contractors`);

  // Jobs
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Перевозка щебня 20 тонн',
        description: 'Доставка щебня со склада на объект, расстояние 50 км',
        region: 'Москва',
        price: 45000,
        status: JobStatus.ACTIVE,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Аренда экскаватора на 3 дня',
        description: 'Нужен экскаватор-погрузчик для земляных работ',
        region: 'Санкт-Петербург',
        price: 120000,
        status: JobStatus.ACTIVE,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Вывоз строительного мусора',
        description: 'Контейнер 8 м³, вывоз в течение дня',
        region: 'Москва',
        price: 15000,
        status: JobStatus.DRAFT,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Поставка бетона М300',
        description: '10 кубов бетона на объект, миксер',
        region: 'Казань',
        price: 65000,
        status: JobStatus.ACTIVE,
      },
    }),
  ]);

  console.log(`Created ${jobs.length} jobs`);

  // Invites
  const invites = await Promise.all([
    prisma.invite.create({
      data: {
        jobId: jobs[0].id,
        contractorId: contractors[0].id,
      },
    }),
    prisma.invite.create({
      data: {
        jobId: jobs[0].id,
        contractorId: contractors[1].id,
      },
    }),
    prisma.invite.create({
      data: {
        jobId: jobs[1].id,
        contractorId: contractors[2].id,
      },
    }),
    prisma.invite.create({
      data: {
        jobId: jobs[1].id,
        contractorId: contractors[4].id,
      },
    }),
  ]);

  console.log(`Created ${invites.length} invites`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
