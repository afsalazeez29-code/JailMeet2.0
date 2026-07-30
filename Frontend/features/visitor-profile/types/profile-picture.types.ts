import type { Area, Point } from 'react-easy-crop';

export type ProfilePictureStep = 'menu' | 'preparing' | 'crop' | 'remove';

export type ProfilePictureCrop = {
  position: Point;
  pixels: Area | null;
  rotation: number;
  zoom: number;
};

export type ProfilePictureModalProps = {
  currentImageUrl: string | null;
  visitorName: string;
  open: boolean;
  onClose: () => void;
  onUpdated: (profileImageUrl: string | null) => void;
};
