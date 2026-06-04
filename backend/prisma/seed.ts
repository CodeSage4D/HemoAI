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
  const bankHash = await bcrypt.hash('BankAccess123!', 10);
  const patientHash = await bcrypt.hash('PatientPassword123!', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@raktava.in',
      fullName: 'Aarav Sharma',
      role: Role.ADMIN,
      passwordHash: adminHash,
    },
  });

  const hospitalUser = await prisma.user.create({
    data: {
      email: 'dispatch@apollo.in',
      fullName: 'Dr. Aditya Patel',
      role: Role.HOSPITAL,
      passwordHash: hospitalHash,
    },
  });

  const stJudeUser = await prisma.user.create({
    data: {
      email: 'aiims@raktava.in',
      fullName: 'Dr. Priya Nair',
      role: Role.HOSPITAL,
      passwordHash: hospitalHash,
    },
  });

  const bankUser = await prisma.user.create({
    data: {
      email: 'bank@raktava.in',
      fullName: 'Rajesh Kumar',
      role: Role.BLOOD_BANK,
      passwordHash: bankHash,
    },
  });

  const patientUser = await prisma.user.create({
    data: {
      email: 'amit.verma@mail.in',
      fullName: 'Amit Verma',
      role: Role.PATIENT,
      passwordHash: patientHash,
    },
  });

  const janeUser = await prisma.user.create({
    data: {
      email: 'deepika.sen@mail.in',
      fullName: 'Deepika Sen',
      role: Role.PATIENT,
      passwordHash: patientHash,
    },
  });

  console.log('Seeded Users.');

  const hospital = await prisma.hospital.create({
    data: {
      userId: hospitalUser.id,
      name: 'Apollo Emergency Hospital, Mumbai',
      licenseNo: 'APOLLO-MUM-400001',
      locationLat: 19.0760,
      locationLng: 72.8777,
    },
  });

  const stJudeHospital = await prisma.hospital.create({
    data: {
      userId: stJudeUser.id,
      name: 'AIIMS Emergency Trauma, Delhi',
      licenseNo: 'AIIMS-DEL-110001',
      locationLat: 28.6139,
      locationLng: 77.2090,
    },
  });

  console.log('Seeded Hospitals.');

  const patient = await prisma.patient.create({
    data: {
      hospitalId: hospital.id,
      name: encryptField('Amit Verma'),
      age: 45,
      gender: 'Male',
      bloodGroup: BloodGroup.O_NEG,
      chronicConditions: encryptField('None'),
    },
  });

  const janePatient = await prisma.patient.create({
    data: {
      hospitalId: stJudeHospital.id,
      name: encryptField('Deepika Sen'),
      age: 28,
      gender: 'Female',
      bloodGroup: BloodGroup.A_POS,
      chronicConditions: encryptField('Anemia'),
    },
  });

  console.log('Seeded Patients.');

  const regionalBank = await prisma.bloodBank.create({
    data: {
      userId: bankUser.id,
      name: 'Red Cross Distro Hub, Bengaluru',
      locationLat: 12.9716,
      locationLng: 77.5946,
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
