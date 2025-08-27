import { type User, type InsertUser, type Upload, type InsertUpload } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Upload operations
  createUpload(upload: InsertUpload): Promise<Upload>;
  getUpload(id: string): Promise<Upload | undefined>;
  updateUploadStatus(id: string, status: string, results?: any): Promise<Upload | undefined>;
  getUserUploads(userId?: string): Promise<Upload[]>;
  getAllUploads(): Promise<Upload[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private uploads: Map<string, Upload>;

  constructor() {
    this.users = new Map();
    this.uploads = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createUpload(insertUpload: InsertUpload): Promise<Upload> {
    const id = randomUUID();
    const upload: Upload = {
      ...insertUpload,
      id,
      status: "uploaded",
      uploadedAt: new Date(),
      processedAt: null,
      userId: null,
      results: null,
      patientInfo: insertUpload.patientInfo || null,
    };
    this.uploads.set(id, upload);
    return upload;
  }

  async getUpload(id: string): Promise<Upload | undefined> {
    return this.uploads.get(id);
  }

  async updateUploadStatus(id: string, status: string, results?: any): Promise<Upload | undefined> {
    const upload = this.uploads.get(id);
    if (!upload) return undefined;
    
    const updatedUpload: Upload = {
      ...upload,
      status,
      processedAt: status === "completed" ? new Date() : upload.processedAt,
      results: results || upload.results,
    };
    
    this.uploads.set(id, updatedUpload);
    return updatedUpload;
  }

  async getUserUploads(userId?: string): Promise<Upload[]> {
    return Array.from(this.uploads.values()).filter(
      upload => !userId || upload.userId === userId
    );
  }

  async getAllUploads(): Promise<Upload[]> {
    return Array.from(this.uploads.values());
  }
}

export const storage = new MemStorage();
