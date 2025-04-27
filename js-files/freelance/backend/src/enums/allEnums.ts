export enum UserRole {
    CLIENT = 'CLIENT',
    FREELANCER = 'FREELANCER',
    ADMIN = 'ADMIN'
  }
  
  export enum ProjectStatus {
    DRAFT = 'DRAFT',
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    ASSIGNED = 'ASSIGNED',
  }
  
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
}
  export enum PaymentType {
    FIXED = 'FIXED',
    HOURLY = 'HOURLY'
  }
  
  export enum ProjectVisibility {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    INVITE_ONLY = 'INVITE_ONLY'
  }
  
  export enum BidStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN'
  }
  
  export enum MilestoneStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    APPROVED = 'APPROVED'
  }
  
  export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
    OVERDUE = 'OVERDUE'
  }
  
  export enum FileCategory {
    DELIVERABLE = 'DELIVERABLE',
    BRIEF = 'BRIEF',
    INVOICE = 'INVOICE',
    MESSAGE_ATTACHMENT = 'MESSAGE_ATTACHMENT'
  }
  
  export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
  }
  
  export enum ContractStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    TERMINATED = 'TERMINATED'
  }
  
  export enum NotificationType {
    PROJECT = 'PROJECT',
    BID = 'BID',
    MESSAGE = 'MESSAGE',
    PAYMENT = 'PAYMENT',
    MILESTONE = 'MILESTONE',
    SYSTEM = 'SYSTEM'
  }
  
  export enum SubscriptionPlan {
    FREE = 'FREE',
    BASIC = 'BASIC',
    PREMIUM = 'PREMIUM',
    ENTERPRISE = 'ENTERPRISE'
  }
  
  export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED'
  }
  
  export enum DisputeStatus {
    OPEN = 'OPEN',
    IN_REVIEW = 'IN_REVIEW',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
  }
  

  export enum FileType {
    IMAGE,
    VIDEO,
    DOCUMENT,
  }

  export enum UserStatus {
    Active = 'ACTIVE',
    Inactive = 'INACTIVE',
  }


  
  export enum ProjectType {
    FIXED = 'FIXED',
    HOURLY = 'HOURLY',
  }

  export enum ProficiencyLevel {
    BEGINNER = 1,
    INTERMEDIATE = 2,
    ADVANCED = 3,
    EXPERT = 4,
    MASTER = 5
  }