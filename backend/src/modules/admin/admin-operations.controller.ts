import { Request, Response } from 'express';

import { DomainError } from '../../utils/domain-error';
import * as service from './admin-operations.service';

const sendError = (error: unknown, res: Response) => {
  if (error instanceof DomainError) {
    res.status(error.statusCode).json({ success: false, message: error.message });
    return;
  }
  console.error('[AdminOperations]', error);
  res.status(500).json({ success: false, message: 'The Admin operation could not be completed' });
};

const query = <T>(res: Response): T => res.locals.validatedQuery as T;
const ok = (res: Response, data: unknown, message: string, status = 200) => res.status(status).json({ success: true, message, data });

export const profile = async (req: Request, res: Response) => { try { ok(res, await service.getAdminProfile(req.user!.id), 'Admin profile retrieved'); } catch (error) { sendError(error, res); } };
export const search = async (_req: Request, res: Response) => { try { const q = query<{ q: string; page: number; limit: number }>(res); ok(res, await service.searchAdmin(q.q, q.page, q.limit), 'Search completed'); } catch (error) { sendError(error, res); } };
export const integrity = async (_req: Request, res: Response) => { try { ok(res, await service.scanIntegrity(), 'Integrity scan completed'); } catch (error) { sendError(error, res); } };
export const previewRepair = async (req: Request, res: Response) => { try { ok(res, await service.previewRepair(req.user!.id, req.body), 'Repair preview prepared'); } catch (error) { sendError(error, res); } };
export const applyRepair = async (req: Request, res: Response) => { try { ok(res, await service.applyRepair(req.user!.id, req.body), 'Integrity repair applied'); } catch (error) { sendError(error, res); } };
export const auditLogs = async (_req: Request, res: Response) => { try { ok(res, await service.listAuditLogs(query(res)), 'Audit events retrieved'); } catch (error) { sendError(error, res); } };
export const reports = async (_req: Request, res: Response) => { try { const q = query<{ from?: Date; to?: Date }>(res); ok(res, await service.getReports(q.from, q.to), 'Reports retrieved'); } catch (error) { sendError(error, res); } };
export const firRecords = async (_req: Request, res: Response) => { try { ok(res, await service.listFirRecords(query(res)), 'FIR records retrieved'); } catch (error) { sendError(error, res); } };
export const firRecord = async (req: Request, res: Response) => { try { ok(res, await service.getFirRecord(req.params.reference), 'FIR record retrieved'); } catch (error) { sendError(error, res); } };
export const recordHistory = async (req: Request, res: Response) => { try { const q = query<{ page: number; limit: number }>(res); ok(res, await service.listAuditLogs({ ...q, reference: req.params.reference }), 'Record history retrieved'); } catch (error) { sendError(error, res); } };
export const correctFir = async (req: Request, res: Response) => { try { ok(res, await service.correctFirRecord(req.user!.id, req.params.reference, req.body), 'FIR record updated'); } catch (error) { sendError(error, res); } };
export const healthRecords = async (_req: Request, res: Response) => { try { ok(res, await service.listHealthRecords(query(res)), 'Health-record summaries retrieved'); } catch (error) { sendError(error, res); } };
export const healthRecord = async (req: Request, res: Response) => { try { ok(res, await service.getHealthRecord(req.user!.id, req.params.reference), 'Restricted health record retrieved'); } catch (error) { sendError(error, res); } };
export const correctHealth = async (req: Request, res: Response) => { try { ok(res, await service.correctHealthRecord(req.user!.id, req.params.reference, req.body), 'Health record updated'); } catch (error) { sendError(error, res); } };
export const announcementPreview = async (req: Request, res: Response) => { try { ok(res, await service.previewAnnouncement(req.user!.id, req.body), 'Announcement preview prepared'); } catch (error) { sendError(error, res); } };
export const publishAnnouncement = async (req: Request, res: Response) => { try { ok(res, await service.publishAnnouncement(req.user!.id, req.body), 'Announcement published', 201); } catch (error) { sendError(error, res); } };
export const announcements = async (_req: Request, res: Response) => { try { const q = query<{ page: number; limit: number }>(res); ok(res, await service.listAnnouncements(q.page, q.limit), 'Announcements retrieved'); } catch (error) { sendError(error, res); } };
export const security = async (_req: Request, res: Response) => { try { const q = query<{ page: number; limit: number }>(res); ok(res, await service.securityEvents(q.page, q.limit), 'Security events retrieved'); } catch (error) { sendError(error, res); } };
