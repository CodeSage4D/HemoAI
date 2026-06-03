import { prisma } from '../../config/db';
import { RequestStatus, UrgencyChannel } from '@prisma/client';
import { decryptField } from '../../utils/encryption';

export class AnalyticsService {
  async getDashboardStats() {
    const inventoryAggregate = await prisma.inventory.aggregate({
      _sum: {
        units: true,
      },
    });
    const totalInventoryUnits = inventoryAggregate._sum.units || 0;

    const totalPendingRequests = await prisma.bloodRequest.count({
      where: {
        status: RequestStatus.PENDING,
      },
    });

    const totalCriticalRequests = await prisma.bloodRequest.count({
      where: {
        urgencyChannel: UrgencyChannel.RED,
        status: RequestStatus.PENDING,
      },
    });

    const totalResolvedRequests = await prisma.bloodRequest.count({
      where: {
        status: RequestStatus.FULFILLED,
      },
    });

    const recentRequests = await prisma.bloodRequest.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
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

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const demandForecastingTrend = days.map((day, idx) => ({
      day,
      demand: Math.max(5, (12 + (idx * 7) % 20) + totalPendingRequests),
    }));

    return {
      totalInventoryUnits,
      bloodAvailabilityStats: totalInventoryUnits.toString(),
      totalPendingRequests,
      totalCriticalRequests,
      criticalPatientsAlert: totalCriticalRequests,
      totalResolvedRequests,
      demandForecastingTrend,
      recentRequests: recentRequests.map((r) => ({
        id: r.id,
        patientName: r.patient?.name ? decryptField(r.patient.name) : 'Unknown Patient',
        bloodGroup: r.patient?.bloodGroup || '--',
        unitsRequired: r.unitsRequired,
        urgencyChannel: r.urgencyChannel,
        priorityScore: r.priorityScore,
        status: r.status,
        createdAt: r.createdAt,
      })),
    };
  }
}
export default AnalyticsService;
