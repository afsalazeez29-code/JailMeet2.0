import { Request, Response } from 'express';

import {
  createPrisonerParoleRequest,
  getOfficerParoleRequests,
  getPrisonerParoleRequests,
  ParoleError,
  reviewParoleRequest,
} from './parole.service';
import {
} from './parole.schema';
import {
  CreateParoleRequestInput,
  ParoleStatusFilterInput,
  ReviewParoleRequestInput,
} from './parole.types';

const handleParoleError = (
  error: unknown,
  res: Response,
  fallbackMessage: string,
): void => {
  if (error instanceof ParoleError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  console.error('[ParoleController]', error);
  res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

export const submitParoleRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  try {
    const request = await createPrisonerParoleRequest(
      req.user.id,
      req.body as CreateParoleRequestInput,
    );

    res.status(201).json({
      success: true,
      message: 'Parole request submitted successfully',
      data: request,
    });
  } catch (error) {
    handleParoleError(error, res, 'Failed to submit parole request');
  }
};

export const listPrisonerParoleRequests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  try {
    const requests = await getPrisonerParoleRequests(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Parole requests fetched successfully',
      data: requests,
    });
  } catch (error) {
    handleParoleError(error, res, 'Failed to fetch parole requests');
  }
};

export const listOfficerParoleRequests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const requests = await getOfficerParoleRequests(
      req.query as ParoleStatusFilterInput,
    );

    res.status(200).json({
      success: true,
      message: 'Officer parole requests fetched successfully',
      data: requests,
    });
  } catch (error) {
    handleParoleError(error, res, 'Failed to fetch officer parole requests');
  }
};

export const reviewOfficerParoleRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  try {
    const { paroleRequestId } = req.params as { paroleRequestId: string };
    const request = await reviewParoleRequest(
      req.user.id,
      paroleRequestId,
      req.body as ReviewParoleRequestInput,
    );

    res.status(200).json({
      success: true,
      message: 'Parole request reviewed successfully',
      data: request,
    });
  } catch (error) {
    handleParoleError(error, res, 'Failed to review parole request');
  }
};
