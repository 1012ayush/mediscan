import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertUploadSchema } from "@shared/schema";

// Configure multer for file uploads
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: fileStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept medical image files
    const allowedTypes = [
      'application/dicom',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    const allowedExtensions = ['.dcm', '.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only DICOM, JPEG, and PNG files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // File upload endpoint
  app.post('/api/upload', upload.array('files', 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const patientInfo = req.body.patientInfo ? JSON.parse(req.body.patientInfo) : undefined;

      const uploads = [];
      for (const file of req.files) {
        const uploadData = {
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          fileSize: file.size,
          mimeType: file.mimetype,
          patientInfo,
        };

        const validatedData = insertUploadSchema.parse(uploadData);
        const upload = await storage.createUpload(validatedData);
        uploads.push(upload);

        // Simulate ML processing by updating status after a delay
        setTimeout(async () => {
          await storage.updateUploadStatus(upload.id, "processing");
          
          // Simulate completion after another delay
          setTimeout(async () => {
            const mockResults = {
              confidenceScore: Math.random() * 100,
              anomaliesDetected: Math.random() > 0.7,
              findings: Math.random() > 0.7 ? ["Potential abnormality detected in region A"] : [],
              processingTime: Math.floor(Math.random() * 300) + 60, // 60-360 seconds
            };
            await storage.updateUploadStatus(upload.id, "completed", mockResults);
          }, Math.random() * 10000 + 5000); // 5-15 seconds
        }, Math.random() * 5000 + 2000); // 2-7 seconds
      }

      res.json({ uploads, message: `${uploads.length} file(s) uploaded successfully` });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // Get upload status
  app.get('/api/upload/:id', async (req, res) => {
    try {
      const upload = await storage.getUpload(req.params.id);
      if (!upload) {
        return res.status(404).json({ error: 'Upload not found' });
      }
      res.json(upload);
    } catch (error) {
      console.error('Error fetching upload:', error);
      res.status(500).json({ error: 'Failed to fetch upload' });
    }
  });

  // Get all uploads
  app.get('/api/uploads', async (req, res) => {
    try {
      const uploads = await storage.getAllUploads();
      res.json(uploads);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      res.status(500).json({ error: 'Failed to fetch uploads' });
    }
  });

  // Update upload status (for ML processing integration)
  app.put('/api/upload/:id/status', async (req, res) => {
    try {
      const { status, results } = req.body;
      const upload = await storage.updateUploadStatus(req.params.id, status, results);
      if (!upload) {
        return res.status(404).json({ error: 'Upload not found' });
      }
      res.json(upload);
    } catch (error) {
      console.error('Error updating upload status:', error);
      res.status(500).json({ error: 'Failed to update upload status' });
    }
  });

  // Get upload statistics
  app.get('/api/stats', async (req, res) => {
    try {
      const uploads = await storage.getAllUploads();
      const stats = {
        total: uploads.length,
        uploaded: uploads.filter(u => u.status === 'uploaded').length,
        processing: uploads.filter(u => u.status === 'processing').length,
        completed: uploads.filter(u => u.status === 'completed').length,
        error: uploads.filter(u => u.status === 'error').length,
      };
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
