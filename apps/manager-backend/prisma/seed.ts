import { PrismaClient, UserRole } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.salaryHistory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.person.deleteMany();
  await prisma.department.deleteMany();

  console.log('📊 Creating departments...');

  // Create departments
  const engineeringDept = await prisma.department.create({
    data: {
      name: 'Engineering',
      description: 'Software development and technical innovation',
    },
  });

  const hrDept = await prisma.department.create({
    data: {
      name: 'Human Resources',
      description: 'Employee relations and organizational development',
    },
  });

  const salesDept = await prisma.department.create({
    data: {
      name: 'Sales',
      description: 'Revenue generation and customer acquisition',
    },
  });

  const marketingDept = await prisma.department.create({
    data: {
      name: 'Marketing',
      description: 'Brand management and market strategy',
    },
  });

  console.log('👥 Creating people and users...');

  // Hash password for all users (same password for demo purposes)
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create HR Admin
  await prisma.person.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@company.com',
      position: 'HR Director',
      salary: 95000.0,
      hireDate: new Date('2020-01-15'),
      departmentId: hrDept.id,
      user: {
        create: {
          email: 'sarah.wilson@company.com',
          password: hashedPassword,
          role: UserRole.HR_ADMIN,
        },
      },
    },
  });

  // Create Engineering Manager
  const engManager = await prisma.person.create({
    data: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      position: 'Engineering Manager',
      salary: 120000.0,
      hireDate: new Date('2019-03-10'),
      departmentId: engineeringDept.id,
      user: {
        create: {
          email: 'john.smith@company.com',
          password: hashedPassword,
          role: UserRole.MANAGER,
        },
      },
    },
  });

  // Update department to set manager
  await prisma.department.update({
    where: { id: engineeringDept.id },
    data: {
      managers: {
        connect: { id: engManager.id },
      },
    },
  });

  // Create Sales Manager
  const salesManager = await prisma.person.create({
    data: {
      firstName: 'Lisa',
      lastName: 'Johnson',
      email: 'lisa.johnson@company.com',
      position: 'Sales Manager',
      salary: 110000.0,
      hireDate: new Date('2020-06-01'),
      departmentId: salesDept.id,
      user: {
        create: {
          email: 'lisa.johnson@company.com',
          password: hashedPassword,
          role: UserRole.MANAGER,
        },
      },
    },
  });

  await prisma.department.update({
    where: { id: salesDept.id },
    data: {
      managers: {
        connect: { id: salesManager.id },
      },
    },
  });

  // Create Marketing Manager
  const marketingManager = await prisma.person.create({
    data: {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@company.com',
      position: 'Marketing Manager',
      salary: 105000.0,
      hireDate: new Date('2020-09-15'),
      departmentId: marketingDept.id,
      user: {
        create: {
          email: 'michael.brown@company.com',
          password: hashedPassword,
          role: UserRole.MANAGER,
        },
      },
    },
  });

  await prisma.department.update({
    where: { id: marketingDept.id },
    data: {
      managers: {
        connect: { id: marketingManager.id },
      },
    },
  });

  // Create Engineering employees
  const engineers = [
    {
      firstName: 'Alice',
      lastName: 'Garcia',
      email: 'alice.garcia@company.com',
      position: 'Senior Software Engineer',
      salary: 95000.0,
      hireDate: new Date('2021-02-01'),
    },
    {
      firstName: 'Bob',
      lastName: 'Martinez',
      email: 'bob.martinez@company.com',
      position: 'Software Engineer',
      salary: 80000.0,
      hireDate: new Date('2022-01-15'),
    },
    {
      firstName: 'Charlie',
      lastName: 'Davis',
      email: 'charlie.davis@company.com',
      position: 'Frontend Developer',
      salary: 75000.0,
      hireDate: new Date('2022-08-01'),
    },
  ];

  for (const engineer of engineers) {
    await prisma.person.create({
      data: {
        ...engineer,
        departmentId: engineeringDept.id,
        managerId: engManager.id,
        user: {
          create: {
            email: engineer.email,
            password: hashedPassword,
            role: UserRole.EMPLOYEE,
          },
        },
      },
    });
  }

  // Create Sales employees
  const salesPeople = [
    {
      firstName: 'Diana',
      lastName: 'Taylor',
      email: 'diana.taylor@company.com',
      position: 'Senior Sales Representative',
      salary: 70000.0,
      hireDate: new Date('2021-05-01'),
    },
    {
      firstName: 'Edward',
      lastName: 'Wilson',
      email: 'edward.wilson@company.com',
      position: 'Sales Representative',
      salary: 55000.0,
      hireDate: new Date('2022-03-15'),
    },
  ];

  for (const salesperson of salesPeople) {
    await prisma.person.create({
      data: {
        ...salesperson,
        departmentId: salesDept.id,
        managerId: salesManager.id,
        user: {
          create: {
            email: salesperson.email,
            password: hashedPassword,
            role: UserRole.EMPLOYEE,
          },
        },
      },
    });
  }

  // Create Marketing employees
  const marketingPeople = [
    {
      firstName: 'Fiona',
      lastName: 'Anderson',
      email: 'fiona.anderson@company.com',
      position: 'Marketing Specialist',
      salary: 60000.0,
      hireDate: new Date('2021-11-01'),
    },
    {
      firstName: 'George',
      lastName: 'Thomas',
      email: 'george.thomas@company.com',
      position: 'Content Creator',
      salary: 50000.0,
      hireDate: new Date('2023-01-15'),
    },
  ];

  for (const marketer of marketingPeople) {
    await prisma.person.create({
      data: {
        ...marketer,
        departmentId: marketingDept.id,
        managerId: marketingManager.id,
        user: {
          create: {
            email: marketer.email,
            password: hashedPassword,
            role: UserRole.EMPLOYEE,
          },
        },
      },
    });
  }

  // Create some salary history records
  console.log('💰 Creating salary history...');

  // Get Alice (Senior Software Engineer) for salary history
  const alice = await prisma.person.findUnique({
    where: { email: 'alice.garcia@company.com' },
  });

  if (alice) {
    await prisma.salaryHistory.createMany({
      data: [
        {
          personId: alice.id,
          salary: 85000.0,
          effectiveDate: new Date('2021-02-01'),
          reason: 'Initial hire',
        },
        {
          personId: alice.id,
          salary: 95000.0,
          effectiveDate: new Date('2022-02-01'),
          reason: 'Annual performance review',
        },
      ],
    });
  }

  // Get Bob (Software Engineer) for salary history
  const bob = await prisma.person.findUnique({
    where: { email: 'bob.martinez@company.com' },
  });

  if (bob) {
    await prisma.salaryHistory.createMany({
      data: [
        {
          personId: bob.id,
          salary: 75000.0,
          effectiveDate: new Date('2022-01-15'),
          reason: 'Initial hire',
        },
        {
          personId: bob.id,
          salary: 80000.0,
          effectiveDate: new Date('2023-01-15'),
          reason: 'Annual performance review',
        },
      ],
    });
  }

  console.log('✅ Database seeding completed successfully!');
  console.log('');
  console.log('📋 Summary:');
  console.log(`   • Created ${await prisma.department.count()} departments`);
  console.log(`   • Created ${await prisma.person.count()} people`);
  console.log(`   • Created ${await prisma.user.count()} user accounts`);
  console.log(
    `   • Created ${await prisma.salaryHistory.count()} salary history records`
  );
  console.log('');
  console.log('🔑 Default login credentials (all users):');
  console.log('   Password: password123');
  console.log('');
  console.log('👑 Admin users:');
  console.log('   • sarah.wilson@company.com (HR_ADMIN)');
  console.log('');
  console.log('👔 Manager users:');
  console.log('   • john.smith@company.com (Engineering Manager)');
  console.log('   • lisa.johnson@company.com (Sales Manager)');
  console.log('   • michael.brown@company.com (Marketing Manager)');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
