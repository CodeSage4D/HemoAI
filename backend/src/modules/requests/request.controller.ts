import { Request, Response, NextFunction } from 'express';
import { RequestService } from './request.service';
import { sendSuccess } from '../../utils/response';
import { BloodGroup } from '@prisma/client';

const requestService = new RequestService();

export class RequestController {
  async submitRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId, unitsRequired, hemoglobinLevel, diseaseType, patientName, patientAge, gender, bloodGroup } = req.body;
      const userId = (req as any).user?.id;
      const request = await requestService.submitTriage({
        patientId,
        unitsRequired,
        hemoglobinLevel,
        diseaseType,
        patientName,
        patientAge,
        gender,
        bloodGroup,
        userId
      });
      return sendSuccess(res, request, 'Triage request submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = await requestService.getPrioritizedRequests();
      return sendSuccess(res, requests, 'Prioritized requests retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const inventory = await requestService.getInventory();
      return sendSuccess(res, inventory, 'Inventory levels retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getBestBank(req: Request, res: Response, next: NextFunction) {
    try {
      const hospitalLat = parseFloat(req.query.hospitalLat as string);
      const hospitalLng = parseFloat(req.query.hospitalLng as string);
      const requiredUnits = parseInt(req.query.requiredUnits as string);
      const bloodGroup = req.query.bloodGroup as BloodGroup;

      const result = await requestService.routeBestBloodBank(hospitalLat, hospitalLng, requiredUnits, bloodGroup);
      return sendSuccess(res, result, 'Optimal blood bank routing determined');
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await requestService.updateRequestStatus(id, status as any);
      return sendSuccess(res, result, 'Blood request status updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
export default RequestController;
