import { users, type User, type InsertUser, services, type Service, type InsertService, orders, type Order, type InsertOrder } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Service methods
  getServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  
  // Order methods
  getOrders(): Promise<Order[]>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  updatePaymentStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private orders: Map<number, Order>;
  sessionStore: session.SessionStore;
  private userIdCounter: number;
  private serviceIdCounter: number;
  private orderIdCounter: number;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.orders = new Map();
    this.userIdCounter = 1;
    this.serviceIdCounter = 1;
    this.orderIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Pre-populate services
    this.initializeServices();
    
    // Add a test user
    this.initializeTestUser();
  }
  
  // Initialize a test user for demo purposes
  private async initializeTestUser() {
    // Import hashPassword function from auth.ts
    const { hashPassword } = await import('./auth');
    
    // Check if test user already exists
    const existingUser = await this.getUserByUsername('testuser');
    if (!existingUser) {
      const normalUser = await this.createUser({
        username: 'testuser',
        password: await hashPassword('password123'),
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        address: 'Test Address, Mumbai, India'
      });
      
      // Manually update role for admin user
      const adminUser = await this.createUser({
        username: 'admin',
        password: await hashPassword('admin123'),
        name: 'Admin User',
        email: 'admin@quicktech.com',
        phone: '9876543211',
        address: 'Admin Office, Delhi, India'
      });
      
      // Update admin role
      const updatedAdmin = {
        ...adminUser,
        role: 'admin'
      };
      this.users.set(adminUser.id, updatedAdmin);
      
      console.log('Test users created successfully.');
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    // Set nulls for optional fields if they're undefined
    const phone = insertUser.phone === undefined ? null : insertUser.phone;
    const address = insertUser.address === undefined ? null : insertUser.address;
    
    const user: User = { 
      ...insertUser,
      phone,
      address, 
      id, 
      role: "user", // Default role for regular users
      created_at: now 
    };
    this.users.set(id, user);
    return user;
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    const servicesList = this.initializeServices();
    return servicesList.map(service => this.createService(service));
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.category === category
    );
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const now = new Date();
    
    // Set nulls for optional fields if they're undefined
    const badge = insertService.badge === undefined ? null : insertService.badge;
    const badge_color = insertService.badge_color === undefined ? null : insertService.badge_color;
    
    const service: Service = { 
      ...insertService, 
      badge,
      badge_color,
      id, 
      created_at: now 
    };
    
    this.services.set(id, service);
    return service;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.user_id === userId
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const now = new Date();
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: "pending", 
      payment_status: "pending", 
      created_at: now, 
      updated_at: now 
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { 
      ...order, 
      status, 
      updated_at: new Date() 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async updatePaymentStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { 
      ...order, 
      payment_status: status, 
      updated_at: new Date() 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Pre-populate services
  private initializeServices(): InsertService[] {
    const services: InsertService[] = [
      {
        name: "Voter ID Card (EPIC)",
        description: "Apply for new voter ID card or make corrections to existing one",
        category: "Identity",
        price: 100,
        processing_time: "15-20 days",
        requirements: "Age proof, address proof, photographs",
        icon: "fa-id-card",
        badge: "Electoral Document",
        badge_color: "blue"
      },
      {
        name: "Aadhaar Card",
        description: "Apply for new Aadhaar card or update existing one",
        category: "Identity",
        price: 50,
        processing_time: "10-15 days",
        requirements: "Proof of Identity, Proof of Address, Birth Certificate",
        icon: "fa-id-card",
        badge: "Essential",
        badge_color: "green"
      },
      {
        name: "PAN Card",
        description: "Apply for new PAN card or request a duplicate",
        category: "Identity",
        price: 150,
        processing_time: "7-10 days",
        requirements: "Identity proof, address proof, photographs",
        icon: "fa-credit-card",
        badge: "Tax Document",
        badge_color: "orange"
      },
      {
        name: "Birth Certificate",
        description: "Apply for birth certificate or get duplicate copy",
        category: "Identity",
        price: 300,
        processing_time: "5-7 days",
        requirements: "Hospital records, parents' IDs",
        icon: "fa-baby",
        badge: "Essential",
        badge_color: "green"
      },
      {
        name: "Income Certificate",
        description: "Apply for income certificate for various purposes",
        category: "Financial",
        price: 200,
        processing_time: "7-10 days",
        requirements: "Salary slips, bank statements, employment proof",
        icon: "fa-money-bill",
        badge: "Income Proof",
        badge_color: "green"
      },
      {
        name: "Domicile Certificate",
        description: "Get proof of residence certificate",
        category: "Identity",
        price: 150,
        processing_time: "10-15 days",
        requirements: "Address proof, residence proof, identity documents",
        icon: "fa-home",
        badge: "Residence Proof",
        badge_color: "blue"
      },
      {
        name: "Passport",
        description: "Apply for new passport or renewal",
        category: "Identity",
        price: 2500,
        processing_time: "30-45 days",
        requirements: "Identity proof, address proof, birth certificate",
        icon: "fa-passport",
        badge: "Travel Document",
        badge_color: "blue"
      },
      {
        name: "Marriage Certificate",
        description: "Apply for marriage registration certificate",
        category: "Legal",
        price: 500,
        processing_time: "15-20 days",
        requirements: "Marriage photos, witness IDs, age proof",
        icon: "fa-rings-wedding",
        badge: "Legal Document",
        badge_color: "purple"
      },
      {
        name: "GST Registration",
        description: "Register your business under GST",
        category: "Business",
        price: 1000,
        processing_time: "3-5 days",
        requirements: "Business PAN, address proof, bank details",
        icon: "fa-receipt",
        badge: "Business",
        badge_color: "indigo"
      },
      {
        name: "Aadhaar-PAN Linking",
        description: "Quick and secure linking of your Aadhaar card with PAN card",
        category: "Identity",
        price: 50,
        processing_time: "1-2 days",
        requirements: "Aadhaar card, PAN card",
        icon: "fa-link",
        badge: "Essential",
        badge_color: "blue"
      },
      {
        name: "E-Shram Card",
        description: "Registration for unorganized workers under E-Shram portal",
        category: "Employment",
        price: 100,
        processing_time: "2-3 days",
        requirements: "Aadhaar card, bank details, employment details",
        icon: "fa-id-badge",
        badge: "Labor Welfare",
        badge_color: "green"
      }
    ];
    return services;
  }
}

export const storage = new MemStorage();