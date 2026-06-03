import { PrismaClient, Role, BloodGroup } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { encryptField } from '../src/utils/encryption';

const prisma = new PrismaClient();

async function main() {
  console.log('Initiating database seeding...');

  // Clean existing tables safely
  await prisma.auditLog.deleteMany();
  await prisma.systemLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.priorityCase.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.bloodRequest.deleteMany();
  await prisma.extractedParameter.deleteMany();
  await prisma.aIResult.deleteMany();
  await prisma.medicalReport.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.bloodBank.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.donor.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleaned database tables successfully.');

  const adminHash = await bcrypt.hash('SecurePassword123!', 10);
  const hospitalHash = await bcrypt.hash('HospitalAccess123!', 10);
  const patientHash = await bcrypt.hash('PatientPassword123!', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@hemoi.com',
      fullName: 'Super Admin',
      role: Role.ADMIN,
      passwordHash: adminHash,
    },
  });

  const hospitalUser = await prisma.user.create({
    data: {
      email: 'dispatch@svtc.org',
      fullName: 'Valley Trauma User',
      role: Role.HOSPITAL,
      passwordHash: hospitalHash,
    },
  });

  const patientUser = await prisma.user.create({
    data: {
      email: 'john.doe@mail.com',
      fullName: 'John Doe',
      role: Role.PATIENT,
      passwordHash: patientHash,
    },
  });

  console.log('Seeded Users.');

  const hospital = await prisma.hospital.create({
    data: {
      userId: hospitalUser.id,
      name: 'Silicon Valley Trauma Center',
      licenseNo: 'SVTC-999-XYZ',
      locationLat: 37.3382,
      locationLng: -121.8863,
    },
  });

  console.log('Seeded Hospital.');

  const patient = await prisma.patient.create({
    data: {
      hospitalId: hospital.id,
      name: encryptField('John Doe'),
      age: 45,
      gender: 'Male',
      bloodGroup: BloodGroup.O_NEG,
      chronicConditions: encryptField('None'),
    },
  });

  console.log('Seeded Patient.');

  const regionalBank = await prisma.bloodBank.create({
    data: {
      userId: adminUser.id,
      name: 'Regional Distro Hub',
      locationLat: 37.3600,
      locationLng: -121.9400,
    },
  });

  console.log('Seeded Blood Bank.');

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30);

  const inventoryGroups = [BloodGroup.O_NEG, BloodGroup.O_POS, BloodGroup.A_POS];

  for (const group of inventoryGroups) {
    await prisma.inventory.create({
      data: {
        bloodBankId: regionalBank.id,
        bloodGroup: group,
        units: 50,
        expiryDate: expiryDate,
      },
    });
  }

  console.log('Seeded Inventory.');
  console.log('Database successfully seeded with Production default parameters.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
