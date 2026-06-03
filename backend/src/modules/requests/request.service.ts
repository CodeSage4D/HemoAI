import { prisma } from '../../config/db';
import { AIService } from '../ai/ai.service';
import { BloodGroup, UrgencyChannel, RequestStatus } from '@prisma/client';
import { encryptField, decryptField } from '../../utils/encryption';

const aiService = new AIService();

export class RequestService {
  async submitTriage(params: {
    patientId?: string;
    unitsRequired: number;
    hemoglobinLevel: number;
    diseaseType: string;
    patientName?: string;
    patientAge?: number | string;
    gender?: string;
    bloodGroup?: string;
    userId?: string;
  }) {
    let finalPatientId = params.patientId;

    if (!finalPatientId) {
      // Find or create the patient
      let hospitalId = '';
      if (params.userId) {
        const hospital = await prisma.hospital.findUnique({
          where: { userId: params.userId }
        });
        if (hospital) {
          hospitalId = hospital.id;
        }
      }

      if (!hospitalId) {
        const firstHospital = await prisma.hospital.findFirst();
        if (firstHospital) {
          hospitalId = firstHospital.id;
        } else {
          throw new Error('No hospital registered in database. Cannot associate patient.');
        }
      }

      const name = params.patientName || 'Anonymous Patient';
      const age = params.patientAge ? parseInt(params.patientAge.toString()) : 30;
      const gender = params.gender || 'Unknown';
      
      let bloodGroup: BloodGroup = BloodGroup.O_NEG;
      if (params.bloodGroup) {
        const cleanedGroup = params.bloodGroup.replace(/\s+/g, '').replace('_POS', '+').replace('_NEG', '-').toUpperCase();
        const groupMapping: Record<string, BloodGroup> = {
          'A+': BloodGroup.A_POS,
          'A-': BloodGroup.A_NEG,
          'B+': BloodGroup.B_POS,
          'B-': BloodGroup.B_NEG,
          'O+': BloodGroup.O_POS,
          'O-': BloodGroup.O_NEG,
          'AB+': BloodGroup.AB_POS,
          'AB-': BloodGroup.AB_NEG,
          'A_POS': BloodGroup.A_POS,
          'A_NEG': BloodGroup.A_NEG,
          'B_POS': BloodGroup.B_POS,
          'B_NEG': BloodGroup.B_NEG,
          'O_POS': BloodGroup.O_POS,
          'O_NEG': BloodGroup.O_NEG,
          'AB_POS': BloodGroup.AB_POS,
          'AB_NEG': BloodGroup.AB_NEG,
        };
        if (groupMapping[cleanedGroup]) {
          bloodGroup = groupMapping[cleanedGroup];
        }
      }

      const patients = await prisma.patient.findMany({
        where: {
          hospitalId,
        }
      });

      const existingPatient = patients.find(p => decryptField(p.name) === name);

      if (existingPatient) {
        finalPatientId = existingPatient.id;
      } else {
        const newPatient = await prisma.patient.create({
          data: {
            hospitalId,
            name: encryptField(name),
            age,
            gender,
            bloodGroup,
            chronicConditions: encryptField('None')
          }
        });
        finalPatientId = newPatient.id;
      }
    }

    const mockPayload = {
      raw_text: params.diseaseType,
      hb: params.hemoglobinLevel,
    };

    const aiResult = await aiService.runEnsemble(mockPayload);
    
    let channel: UrgencyChannel = UrgencyChannel.GREEN;
    if (aiResult.channel === 'RED') channel = UrgencyChannel.RED;
    else if (aiResult.channel === 'YELLOW') channel = UrgencyChannel.YELLOW;

    const request = await prisma.bloodRequest.create({
      data: {
        patientId: finalPatientId!,
        unitsRequired: params.unitsRequired,
        urgencyChannel: channel,
        priorityScore: aiResult.risk_score || 0,
        status: RequestStatus.PENDING,
      },
    });

    return request;
  }

  async getPrioritizedRequests() {
    const requests = await prisma.bloodRequest.findMany({
      orderBy: {
        priorityScore: 'desc',
      },
      include: {
        patient: {
          select: {
            name: true,
            bloodGroup: true,
          },
        },
      },
    });

    return requests.map((r: any) => {
      if (r.patient) {
        return {
          ...r,
          patient: {
            ...r.patient,
            name: decryptField(r.patient.name),
          },
        };
      }
      return r;
    });
  }

  async updateRequestStatus(id: string, status: RequestStatus) {
    const request = await prisma.bloodRequest.update({
      where: { id },
      data: { status },
      include: {
        patient: {
          select: {
            name: true,
            bloodGroup: true,
          },
        },
      },
    });

    if (request.patient) {
      request.patient.name = decryptField(request.patient.name);
    }
    return request;
  }

  private computeHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371.0;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async routeBestBloodBank(hospitalLat: number, hospitalLng: number, requiredUnits: number, bloodGroup: BloodGroup) {
    const banks = await prisma.bloodBank.findMany({
      include: {
        inventories: {
          where: {
            bloodGroup: bloodGroup,
          },
        },
      },
    });

    if (!banks.length) {
      throw new Error('No registered Blood Banks found in regional network.');
    }

    let optimalBank: any = null;
    let minScore = Infinity;
    let optimalDist = 0;

    const now = new Date();

    for (const bank of banks) {
      const totalInv = bank.inventories.reduce((acc, item) => acc + item.units, 0);

      if (totalInv >= requiredUnits) {
        const dist = this.computeHaversineDistance(hospitalLat, hospitalLng, bank.locationLat, bank.locationLng);

        let shortestExpiryDays = 999;
        for (const item of bank.inventories) {
          if (item.expiryDate) {
            const timeDiff = item.expiryDate.getTime() - now.getTime();
            const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            if (daysLeft < shortestExpiryDays && daysLeft >= 0) {
              shortestExpiryDays = Math.max(daysLeft, 1);
            }
          }
        }

        if (shortestExpiryDays === 999) shortestExpiryDays = 30;

        const compositeScore = dist * 0.4 + shortestExpiryDays * 0.6;

        if (compositeScore < minScore) {
          minScore = compositeScore;
          optimalBank = bank;
          optimalDist = dist;
        }
      }
    }

    if (!optimalBank) {
      return {
        status: 'CRITICAL_SHORTAGE',
        message: `No single bank has adequate supply of ${requiredUnits}x ${bloodGroup}. Splitting dispatch required.`,
      };
    }

    return {
      status: 'AUTO_DISPATCHED',
      optimalBloodBankId: optimalBank.id,
      name: optimalBank.name,
      distanceKm: Math.round(optimalDist * 100) / 100,
      intelligenceScore: Math.round(minScore * 100) / 100,
    };
  }

  async getInventory() {
    return prisma.inventory.findMany({
      include: {
        bloodBank: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
export default RequestService;
