import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../../middleware/auth.middleware';
import { requireEmployee } from '../../middleware/role.middleware';
import { workUpdateUpload } from './upload.middleware';
import {
  dashboardController,
  getTasksController,
  getTaskByIdController,
  updateTaskStatusController,
  createWorkUpdateController,
  getTaskHistoryController,
  getPerformanceController,
  getIncentivesController,
  checkInController,
  checkOutController,
  getAttendanceController,
  getProfileController,
  updateProfileController,
  getNotificationsController,
  markNotificationReadController,
  getDocumentsController,
} from './employee.controller';

const router = Router();

// All employee routes are protected with authenticateToken + requireEmployee
const protect = [authenticateToken, requireEmployee];

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
router.get('/employee/dashboard', ...protect, dashboardController);

// ─── TASKS ───────────────────────────────────────────────────────────────────
router.get('/employee/tasks', ...protect, getTasksController);
router.get('/employee/tasks/:id', ...protect, getTaskByIdController);
router.put('/employee/tasks/:id/status', ...protect, updateTaskStatusController);

// ─── WORK UPDATE (multipart/form-data) ───────────────────────────────────────
router.post(
  '/employee/tasks/:id/work-update',
  ...protect,
  workUpdateUpload,
  createWorkUpdateController
);

// ─── TASK HISTORY ─────────────────────────────────────────────────────────────
router.get('/employee/tasks/:id/history', ...protect, getTaskHistoryController);

// ─── PERFORMANCE ─────────────────────────────────────────────────────────────
router.get('/employee/performance', ...protect, getPerformanceController);

// ─── INCENTIVES ───────────────────────────────────────────────────────────────
router.get('/employee/incentives', ...protect, getIncentivesController);

// ─── GPS ATTENDANCE ───────────────────────────────────────────────────────────
router.post('/employee/checkin', ...protect, checkInController);
router.post('/employee/checkout', ...protect, checkOutController);

// ─── ATTENDANCE HISTORY ───────────────────────────────────────────────────────
// ?filter=today|weekly|monthly
router.get('/employee/attendance', ...protect, getAttendanceController);

// ─── PROFILE ──────────────────────────────────────────────────────────────────
router.get('/employee/profile', ...protect, getProfileController);

// Profile update — supports optional profile photo via multipart
const profilePhotoUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const dir = require('path').join(process.cwd(), 'uploads', 'profile-photos');
      require('fs').mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const ext = require('path').extname(file.originalname);
      cb(null, `profile-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('profilePhoto');

router.put('/employee/profile', ...protect, profilePhotoUpload, updateProfileController);

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
router.get('/employee/notifications', ...protect, getNotificationsController);
router.patch('/employee/notifications/:id/read', ...protect, markNotificationReadController);

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────
router.get('/employee/documents', ...protect, getDocumentsController);

export default router;
