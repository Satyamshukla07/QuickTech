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
    return Array.from(this.services.values());
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
  private initializeServices() {
    const services: InsertService[] = [
      {
        name: "Aadhaar-PAN Linking",
        description: "Quick and secure linking of your Aadhaar card with PAN card as per government regulations.",
        category: "Identity",
        price: 300,
        processing_time: "1-2 days",
        requirements: "Aadhaar card, PAN card",
        icon: "fa-link",
        badge: "Mandatory Service",
        badge_color: "red"
      },
      {
        name: "E-Shram Card",
        description: "Registration and card generation for unorganized workers under the E-Shram portal.",
        category: "Employment",
        price: 200,
        processing_time: "2-3 days",
        requirements: "Aadhaar card, bank details, mobile number",
        icon: "fa-id-badge",
        badge: "Worker Benefits",
        badge_color: "green"
      },
      {
        name: "Aadhaar Card",
        description: "New applications, corrections, updates and more for your Aadhaar card.",
        category: "Identity",
        price: 500,
        processing_time: "2-3 days",
        requirements: "Address proof, identity proof, and recent photograph",
        icon: "fa-id-card",
        badge: "Fast Processing",
        badge_color: "green"
      },
      {
        name: "PAN Card",
        description: "Apply for new PAN card, correction in existing card and PAN-Aadhaar linking.",
        category: "Identity",
        price: 750,
        processing_time: "4-5 days",
        requirements: "Identity proof, address proof, and recent photograph",
        icon: "fa-credit-card",
        badge: "Government Authorized",
        badge_color: "blue"
      },
      {
        name: "Driving License",
        description: "New learner's license, permanent license, renewals and international permits.",
        category: "Licenses",
        price: 1200,
        processing_time: "7-10 days",
        requirements: "Age proof, address proof, identity proof, and medical certificate",
        icon: "fa-id-badge",
        badge: "Complete Assistance",
        badge_color: "yellow"
      },
      {
        name: "Passport",
        description: "New passport application, renewal and other passport-related services.",
        category: "Travel",
        price: 2500,
        processing_time: "10-15 days",
        requirements: "Address proof, identity proof, birth certificate, and photographs",
        icon: "fa-passport",
        badge: "Priority Service",
        badge_color: "red"
      },
      {
        name: "Domicile Certificate",
        description: "Obtain residence proof certificate from state government.",
        category: "Certificates",
        price: 1500,
        processing_time: "10-15 days",
        requirements: "Address proof, identity documents, residence proof",
        icon: "fa-home",
        badge: "State Document",
        badge_color: "purple"
      },
      {
        name: "Income Certificate",
        description: "Get income certification for various purposes.",
        category: "Certificates",
        price: 1200,
        processing_time: "7-10 days",
        requirements: "Income proof, identity documents, bank statements",
        icon: "fa-money-bill",
        badge: "Income Proof",
        badge_color: "green"
      },
      {
        name: "CSC Education Services",
        description: "PMGDISHA digital literacy, skill development courses, NDLM registration and online educational services.",
        category: "Education",
        price: 400,
        processing_time: "1-2 days",
        requirements: "Educational details, identity proof, and photographs",
        icon: "fa-graduation-cap",
        badge: "Skill Development",
        badge_color: "blue"
      },
      {
        name: "CSC Utility Services",
        description: "Electricity bill payments, mobile/DTH recharges, water bill payments, and other utility services.",
        category: "Utilities",
        price: 200,
        processing_time: "Same day",
        requirements: "Bill/connection details and payment amount",
        icon: "fa-bolt",
        badge: "Quick Service",
        badge_color: "yellow"
      },
      {
        name: "CSC Agriculture Services",
        description: "PM-KISAN registration, soil health card, crop insurance, and agricultural advisory services.",
        category: "Agriculture",
        price: 350,
        processing_time: "2-4 days",
        requirements: "Land records, identity proof, and bank account details",
        icon: "fa-seedling",
        badge: "Farmer Support",
        badge_color: "green"
      },
      {
        name: "CSC G2C Services",
        description: "Government to Citizen services including welfare schemes, MGNREGA job cards, land records, and social security pensions.",
        category: "Government",
        price: 250,
        processing_time: "3-7 days",
        requirements: "Identity proof, address documents, and scheme-specific requirements",
        icon: "fa-id-card",
        badge: "Government Schemes",
        badge_color: "blue"
      },
      {
        name: "Caste Certificate",
        description: "Documentation and verification for SC/ST/OBC categories certification.",
        category: "Identity",
        price: 300,
        processing_time: "7-10 days",
        requirements: "Identity proof, residence proof, and previous caste certificates if any",
        icon: "fa-id-card",
        badge: "Government Verified",
        badge_color: "blue"
      },
      {
        name: "Birth Certificate",
        description: "Official documentation for proof of birth and age.",
        category: "Identity",
        price: 400,
        processing_time: "5-7 days",
        requirements: "Hospital records, parents' ID proof",
        icon: "fa-baby",
        badge: "Essential Document",
        badge_color: "green"
      },
      {
        name: "Death Certificate",
        description: "Legal documentation for proof of death.",
        category: "Legal",
        price: 400,
        processing_time: "3-5 days",
        requirements: "Medical certificate, deceased's ID proof",
        icon: "fa-scroll",
        badge: "Priority Processing",
        badge_color: "red"
      },
      {
        name: "Marriage Certificate",
        description: "Legal proof of marriage registration.",
        category: "Legal",
        price: 600,
        processing_time: "7-10 days",
        requirements: "Both parties' ID proof, photographs, witness details",
        icon: "fa-rings-wedding",
        badge: "Legal Document",
        badge_color: "blue"
      },
      {
        name: "GST Registration",
        description: "Business registration for Goods and Services Tax.",
        category: "Business",
        price: 1000,
        processing_time: "3-5 days",
        requirements: "Business details, PAN, address proof",
        icon: "fa-receipt",
        badge: "Business Essential",
        badge_color: "purple"
      },
      {
        name: "ESIC Registration",
        description: "Employee State Insurance Corporation registration for benefits.",
        category: "Business",
        price: 800,
        processing_time: "5-7 days",
        requirements: "Company details, employee information",
        icon: "fa-shield-alt",
        badge: "Employee Welfare",
        badge_color: "green"
      },
      {
        name: "PF Registration",
        description: "Provident Fund registration for retirement benefits.",
        category: "Business",
        price: 800,
        processing_time: "5-7 days",
        requirements: "Company registration, employee details",
        icon: "fa-piggy-bank",
        badge: "Retirement Security",
        badge_color: "blue"
      },
      {
        name: "ITR Filing",
        description: "Income Tax Return filing services.",
        category: "Finance",
        price: 500,
        processing_time: "2-3 days",
        requirements: "Income statements, investment proofs, PAN",
        icon: "fa-file-invoice-dollar",
        badge: "Tax Compliance",
        badge_color: "green"
      },
      {
        name: "PMAY Application",
        description: "Pradhan Mantri Awas Yojana housing scheme assistance.",
        category: "Welfare",
        price: 300,
        processing_time: "10-15 days",
        requirements: "Income proof, property details, Aadhaar",
        icon: "fa-home",
        badge: "Housing Scheme",
        badge_color: "blue"
      },
      {
        name: "Ayushman Bharat Card",
        description: "Health insurance under PM-JAY scheme.",
        category: "Healthcare",
        price: 200,
        processing_time: "5-7 days",
        requirements: "Income certificate, Aadhaar, family details",
        icon: "fa-heart",
        badge: "Healthcare",
        badge_color: "red"
      },
      {
        name: "Pension Certificate",
        description: "Documentation for government pensions and benefits.",
        category: "Welfare",
        price: 400,
        processing_time: "7-10 days",
        requirements: "Service records, Aadhaar, bank details",
        icon: "fa-hand-holding-heart",
        badge: "Senior Care",
        badge_color: "purple"
      },
      {
        name: "MGNREGA Job Card",
        description: "Rural employment scheme registration.",
        category: "Employment",
        price: 100,
        processing_time: "3-5 days",
        requirements: "Address proof, photographs, bank details",
        icon: "fa-users",
        badge: "Rural Employment",
        badge_color: "green"
      },
      {
        name: "Property Registration",
        description: "Legal documentation of property ownership.",
        category: "Property",
        price: 2000,
        processing_time: "15-20 days",
        requirements: "Property documents, ID proof, payment details",
        icon: "fa-building",
        badge: "Legal Property",
        badge_color: "blue"
      },
      {
        name: "Land Records",
        description: "Online access to land ownership records (Bhulekh).",
        category: "Property",
        price: 300,
        processing_time: "2-3 days",
        requirements: "Property details, ID proof",
        icon: "fa-map",
        badge: "Digital Records",
        badge_color: "green"
      },
      {
        name: "Utility Connections",
        description: "New connections and bill management for electricity, water, and gas.",
        category: "Utilities",
        price: 600,
        processing_time: "7-10 days",
        requirements: "Address proof, ID proof, property documents",
        icon: "fa-plug",
        badge: "Essential Services",
        badge_color: "purple"
      },
      {
        name: "CSC Healthcare Services",
        description: "Telemedicine, Ayushman Bharat registration, health insurance, and wellness services through CSC-PHCs.",
        category: "Healthcare",
        price: 300,
        processing_time: "1-3 days",
        requirements: "Health records, identity proof, and family details",
        icon: "fa-stethoscope",
        badge: "Health Support",
        badge_color: "red"
      },
      {
        name: "CSC Digital Services",
        description: "Digital India services including Digi Locker, digital signatures, WiFi Choupal, and PMGDISHA training.",
        category: "Digital",
        price: 450,
        processing_time: "1-2 days",
        requirements: "Digital documents, identity proof, and email address",
        icon: "fa-mobile-alt",
        badge: "Digital Empowerment",
        badge_color: "purple"
      },
      {
        name: "CSC Travel Services",
        description: "IRCTC train ticket booking, bus tickets, flight tickets, and hotel bookings through CSC centers.",
        category: "Travel",
        price: 250,
        processing_time: "Same day",
        requirements: "Travel details, identity proof, and payment information",
        icon: "fa-train",
        badge: "Travel Solutions",
        badge_color: "orange"
      },
      {
        name: "Certificates",
        description: "Birth, death, income, caste, domicile and other essential certificates.",
        category: "Government",
        price: 400,
        processing_time: "2-4 days",
        requirements: "Supporting documents depending on certificate type",
        icon: "fa-scroll",
        badge: "Digital Delivery",
        badge_color: "green"
      },
      {
        name: "Property Documents",
        description: "Land records, property registration, mutation and related services.",
        category: "Property",
        price: 3000,
        processing_time: "15-20 days",
        requirements: "Property details, ownership proof, and identity documents",
        icon: "fa-house-user",
        badge: "Expert Assistance",
        badge_color: "blue"
      },
      {
        name: "Business Services",
        description: "GST registration, company registration, MSME registration and more.",
        category: "Business",
        price: 5000,
        processing_time: "7-14 days",
        requirements: "Business details, address proof, and identity documents",
        icon: "fa-briefcase",
        badge: "Business Solutions",
        badge_color: "indigo"
      },
      {
        name: "Domicile Certificate",
        description: "Obtain residence proof certificate from state government.",
        category: "Certificates",
        price: 1500,
        processing_time: "10-15 days",
        requirements: "Address proof, identity documents, residence proof",
        icon: "fa-home",
        badge: "State Document",
        badge_color: "purple"
      },
      {
        name: "Income Certificate",
        description: "Get income certification for various purposes.",
        category: "Certificates",
        price: 1200,
        processing_time: "7-10 days",
        requirements: "Income proof, identity documents, bank statements",
        icon: "fa-money-bill",
        badge: "Income Proof",
        badge_color: "green"
      },
      {
        name: "Voter ID",
        description: "Apply for new voter ID or update existing one.",
        category: "Identity",
        price: 800,
        processing_time: "20-30 days",
        requirements: "Age proof, address proof, photographs",
        icon: "fa-id-card",
        badge: "Electoral ID",
        badge_color: "blue"
      },
      {
        name: "Ration Card",
        description: "Apply for new ration card or modify existing one.",
        category: "Identity",
        price: 1000,
        processing_time: "15-20 days",
        requirements: "Family details, income proof, address proof",
        icon: "fa-card-list",
        badge: "Essential Document",
        badge_color: "orange"
      }
    ];

    services.forEach(service => {
      this.createService(service);
    });
  }
}

export const storage = new MemStorage();
