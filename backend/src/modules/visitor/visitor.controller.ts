import { Request, Response } from 'express';

import {
  getVisitorProfile,
  updateVisitorProfile,
} from './visitor.service';
import {
  removeVisitorProfileImage,
  replaceVisitorProfileImage,
  VisitorImageServiceError,
} from './visitor-image.service';
import { UpdateVisitorProfileInput } from './visitor.types';

export const getProfile = async (
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
    const profile = await getVisitorProfile(req.user.id);

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Visitor profile not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Visitor profile fetched successfully',
      data: profile,
    });
  } catch (error) {
    console.error('[VisitorController] Fetch profile failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch visitor profile',
    });
  }
};

export const updateProfile = async (
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
    const profile = await updateVisitorProfile(
      req.user.id,
      req.body as UpdateVisitorProfileInput,
    );

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Visitor profile not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Visitor profile updated successfully',
      data: profile,
    });
  } catch (error) {
    console.error('[VisitorController] Update profile failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update visitor profile',
    });
  }
};

export const updateProfileImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  if (!req.file) {
    res.status(400).json({
      success: false,
      message: 'Select one JPEG, PNG, or WebP image',
    });
    return;
  }

  try {
    const data = await replaceVisitorProfileImage(req.user.id, req.file);

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data,
    });
  } catch (error) {
    const statusCode =
      error instanceof VisitorImageServiceError ? error.statusCode : 500;
    const message =
      error instanceof VisitorImageServiceError
        ? error.message
        : 'Unable to update profile picture';

    res.status(statusCode).json({ success: false, message });
  }
};

export const deleteProfileImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  try {
    const data = await removeVisitorProfileImage(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Profile picture removed successfully',
      data,
    });
  } catch (error) {
    const statusCode =
      error instanceof VisitorImageServiceError ? error.statusCode : 500;
    const message =
      error instanceof VisitorImageServiceError
        ? error.message
        : 'Unable to remove profile picture';

    res.status(statusCode).json({ success: false, message });
  }
};
