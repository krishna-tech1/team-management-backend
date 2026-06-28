import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const isPhoto = file.fieldname === 'photos';

    return {
      folder: isPhoto
        ? 'gst-mca/work-updates/photos'
        : 'gst-mca/work-updates/documents',

      resource_type: 'auto',

      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',

    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`));
  }
};

export const workUpdateUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
}).fields([
  { name: 'photos', maxCount: 10 },
  { name: 'documents', maxCount: 10 },
]);