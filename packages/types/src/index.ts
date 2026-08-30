// ==========================================
// 1. API CONTRACT & STANDARD RESPONSES
// ==========================================

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
    rule?: string;
  }>;
}

// ==========================================
// 2. AUTH & SECURITY
// ==========================================

export type UserRole = "superadmin" | "admin" | "editor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  lastActiveAt: string;
  isCurrent?: boolean;
  createdAt: string;
}

export interface PasskeyCredential {
  id: string;
  userId: string;
  credentialId: string;
  deviceName?: string;
  counter: number;
  transports?: string[];
  createdAt: string;
  lastUsedAt?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  user: User;
  token: {
    type: string;
    token: string;
    expiresAt?: string;
  };
}

export interface PasskeyRegistrationChallenge {
  challenge: string;
  rp: {
    name: string;
    id: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: string;
    alg: number;
  }>;
  timeout?: number;
  attestation?: string;
}

export interface PasskeyAuthenticationChallenge {
  challenge: string;
  timeout?: number;
  rpId?: string;
  allowCredentials?: Array<{
    id: string;
    type: string;
    transports?: string[];
  }>;
}

export interface SecurityPasskey {
  id: string;
  userId: string;
  credentialId: string;
  deviceName?: string;
  counter: number;
  transports?: string[];
  createdAt: string;
  lastUsedAt?: string | null;
}

export interface SecuritySession {
  id: number | string;
  tokenableId: string;
  name?: string;
  browser: string;
  os: string;
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  isCurrent: boolean;
  createdAt: string;
  lastUsedAt?: string | null;
  expiresAt?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  newPassword_confirmation: string;
}

// ==========================================
// 3. TAXONOMIES & TECH STACKS
// ==========================================

export type TechCategory =
  "frontend" | "backend" | "database" | "devops" | "tools";

export interface TechStack {
  id: string;
  name: string;
  slug: string;
  iconSvg?: string;
  category: TechCategory;
  isFeatured: boolean;
  level?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  projectsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postsCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 4. PORTFOLIO & PROJECTS
// ==========================================

export interface ProjectGallery {
  id: string;
  projectId: string;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Structured Case Study (Problem, Solution, Arch, Results)
  clientName?: string;
  role?: string | null;
  projectYear: number;
  coverImage: string;
  demoUrl?: string;
  repositoryUrl?: string;
  isFeatured: boolean;
  order: number;
  viewCount?: number;
  demoClickCount?: number;
  repoClickCount?: number;
  categoryId?: string;
  category?: ProjectCategory;
  techStacks: TechStack[];
  galleries?: ProjectGallery[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFilterParams {
  page?: number;
  perPage?: number;
  category?: string;
  techStack?: string;
  isFeatured?: boolean;
  search?: string;
}

// ==========================================
// 5. BLOG & ARTICLES
// ==========================================

export type ArticleStatus = "draft" | "published" | "scheduled";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Tiptap JSON or HTML or Markdown
  coverImage?: string;
  status: ArticleStatus;
  publishedAt?: string;
  scheduledAt?: string;
  viewCount: number;
  readingTimeMinutes?: number;
  metaTitle?: string;
  metaDescription?: string;
  categoryId?: string;
  category?: Category;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticleFilterParams {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
  status?: ArticleStatus;
  search?: string;
}

// ==========================================
// 6. EXPERIENCE, EDUCATION & CERTIFICATIONS
// ==========================================

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  employmentType?: "full-time" | "part-time" | "contract" | "freelance";
  companyLogoUrl?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  techStacks?: TechStack[];
  techStackIds?: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceFormPayload {
  company: string;
  position: string;
  location?: string;
  employmentType?: "full-time" | "part-time" | "contract" | "freelance";
  companyLogoUrl?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description: string;
  techStackIds?: string[];
  order?: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  institutionLogoUrl?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface EducationFormPayload {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  institutionLogoUrl?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  grade?: string;
  description?: string;
  order?: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuerLogoUrl?: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CertificationFormPayload {
  name: string;
  issuer: string;
  issuerLogoUrl?: string;
  issueDate: string;
  expirationDate?: string | null;
  credentialId?: string;
  credentialUrl?: string;
  order?: number;
}

// ==========================================
// 7. SERVICES & DEVELOPMENT PHILOSOPHIES
// ==========================================

export interface ServiceFaq {
  id: string;
  serviceId: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  iconSvg?: string;
  shortDescription: string;
  valueProposition: string;
  deliverables: string[];
  faqs?: ServiceFaq[];
  order: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFaqPayload {
  id?: string;
  question: string;
  answer: string;
  sortOrder?: number;
}

export interface ServiceFormPayload {
  title: string;
  slug?: string;
  iconSvg?: string | null;
  shortDescription: string;
  valueProposition: string;
  deliverables: string[];
  faqs?: ServiceFaqPayload[];
  order?: number;
  isFeatured?: boolean;
}

export interface DevelopmentPhilosophy {
  id: string;
  title: string;
  iconSvg?: string;
  tagline: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PhilosophyFormPayload {
  title: string;
  iconSvg?: string | null;
  tagline: string;
  description: string;
  order?: number;
}

export interface WorkflowStep {
  id: string;
  stepNumber: string;
  title: string;
  shortTitle: string;
  description: string;
  activities: string[];
  iconSvg?: string | null;
  badgeColor?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStepFormPayload {
  stepNumber: string;
  title: string;
  shortTitle: string;
  description: string;
  activities: string[];
  iconSvg?: string | null;
  badgeColor?: string | null;
  order?: number;
  isActive?: boolean;
}

export interface Expertise {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  iconSvg?: string;
  order: number;
  isFeatured: boolean;
  techStacks?: TechStack[];
  techStackIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpertiseFormPayload {
  title: string;
  slug?: string;
  subtitle: string;
  description: string;
  iconSvg?: string | null;
  order?: number;
  isFeatured?: boolean;
  techStackIds?: string[];
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  order: number;
}

// ==========================================
// 8. CONTACT INBOX & LEADS
// ==========================================

export type InboxStatus = "unread" | "read" | "replied" | "archived";

export interface ContactInbox {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  budgetRange?: string;
  projectCategory?: string;
  ipAddress?: string;
  userAgent?: string;
  status: InboxStatus;
  replyNotes?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInboxRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
  budgetRange?: string;
  projectCategory?: string;
  honeypot?: string; // Anti-spam field
}

// ==========================================
// 9. MEDIA & STORAGE
// ==========================================

export type MediaType = "image" | "document" | "video" | "other";

export interface MediaAsset {
  id: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  mediaType: MediaType;
  width?: number;
  height?: number;
  altText?: string;
  createdAt: string;
  updatedAt: string;
  usagesCount?: number;
  usages?: MediaUsageItem[];
}

export interface MediaUsageItem {
  entity: "post" | "project" | "project_gallery" | "user" | "site_setting";
  entityId: string;
  title: string;
  fieldName: string;
}

export interface MediaUsageCheckResponse {
  isUsed: boolean;
  usages: MediaUsageItem[];
}

export interface MediaFilterParams {
  page?: number;
  perPage?: number;
  type?: MediaType | "all";
  search?: string;
  sortBy?: "created_at" | "file_size" | "file_name";
  sortOrder?: "asc" | "desc";
}

export interface MediaStats {
  totalFiles: number;
  totalSize: number;
  imageCount: number;
  documentCount: number;
  videoCount: number;
  otherCount: number;
}

export interface UpdateMediaRequest {
  altText?: string | null;
  fileName?: string;
}

export interface BulkDeleteMediaRequest {
  ids: string[];
}

// ==========================================
// 10. ACTIVITY LOGS (AUDIT TRAIL)
// ==========================================

export type ActivityAction =
  "create" | "update" | "delete" | "login" | "logout" | "setting_change";

export interface ActivityLog {
  id: string;
  userId?: string;
  user?: User;
  action: ActivityAction;
  entity: string;
  entityId?: string;
  payload?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// ==========================================
// 11. GLOBAL SETTINGS & CONFIG
// ==========================================

export interface SiteProfile {
  siteName: string;
  ownerName: string;
  tagline: string;
  bio: string;
  avatarUrl?: string;
  cvFileUrl?: string;
  email: string;
  phone?: string;
  location?: string;
  roles?: string[];
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
  };
}

export interface MaintenanceConfig {
  isActive: boolean;
  headline?: string;
  message?: string;
  estimatedEndTime?: string;
}

export interface TelegramConfig {
  botToken?: string;
  adminChatId?: string;
  notifyOnInbox: boolean;
  notifyOnPostPublish: boolean;
}

export interface SeoDefaults {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogImageUrl?: string;
  googleAnalyticsId?: string;
  googleSiteVerification?: string;
}

export type NavbarStyle = "floating" | "full_width";

export interface SiteAppearanceConfig {
  navbarStyle: NavbarStyle;
}

export interface SiteAboutConfig {
  storyHtml: string;
  yearsOfExperience: string;
  projectsCompleted: string;
  clientsSatisfied: string;
  availabilityStatus: string;
  availabilityActive: boolean;
  quote?: string;
  quoteAuthor?: string;
}

export interface SiteSettingsData {
  profile: SiteProfile;
  about?: SiteAboutConfig;
  appearance?: SiteAppearanceConfig;
  maintenance: MaintenanceConfig;
  telegram?: TelegramConfig;
  seo: SeoDefaults;
  stats?: StatItem[];
}

export interface SiteSetting {
  id: string;
  key: string;
  value: unknown;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 12. DASHBOARD STATS & ANALYTICS
// ==========================================

export interface TrafficSeriesItem {
  period: string; // e.g. "Jan", "Feb", or "2026-08"
  views: number;
  articles: number;
}

export interface ContentDistributionItem {
  name: string;
  count: number;
  percentage: number;
  color?: string;
}

export interface InboxStatusDistribution {
  unread: number;
  read: number;
  replied: number;
  archived: number;
}

export interface DashboardStats {
  totalProjects: number;
  totalArticles: number;
  totalInboxes: number;
  unreadInboxes: number;
  totalArticleViews: number;
  trafficSeries: TrafficSeriesItem[];
  categoryDistribution: ContentDistributionItem[];
  inboxDistribution: InboxStatusDistribution;
  recentActivities: ActivityLog[];
  recentInboxes: ContactInbox[];
  isMaintenanceActive: boolean;
}

// ==========================================
// 13. ARTICLE DETAILED ANALYTICS & EVALUATION
// ==========================================

export interface ArticleView {
  id: string;
  postId: string;
  visitorHash: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  referrer?: string | null;
  referrerSource: string;
  createdAt: string;
}

export interface ArticleTimeSeriesPoint {
  date: string;
  formattedDate: string;
  views: number;
  uniqueVisitors: number;
}

export interface ArticleAnalyticsBreakdownItem {
  name: string;
  count: number;
  percentage: number;
}

export interface ArticleContentEvaluation {
  wordCount: number;
  characterCount: number;
  readingTimeMinutes: number;
  headingCount: {
    h1: number;
    h2: number;
    h3: number;
    total: number;
  };
  imageCount: number;
  linkCount: number;
  paragraphCount: number;
  readabilityGrade: "Easy" | "Moderate" | "Advanced";
  readabilityScore: number;
  recommendations: string[];
}

export interface ArticleSeoAudit {
  hasMetaTitle: boolean;
  metaTitleLength: number;
  metaTitleStatus: "good" | "warning" | "error";
  hasMetaDescription: boolean;
  metaDescriptionLength: number;
  metaDescriptionStatus: "good" | "warning" | "error";
  hasCoverImage: boolean;
  hasCategory: boolean;
  hasTags: boolean;
  slugStatus: "good" | "warning";
  overallScore: number;
  checklist: Array<{
    title: string;
    description: string;
    passed: boolean;
    severity: "critical" | "recommended" | "optional";
  }>;
}

export interface ArticleAnalyticsData {
  period: string;
  dateFrom: string;
  dateTo: string;
  summary: {
    totalViews: number;
    uniqueVisitors: number;
    avgReadingTime: number;
    bounceRateEstimate: number;
    periodGrowth: number;
  };
  timeSeries: ArticleTimeSeriesPoint[];
  sources: ArticleAnalyticsBreakdownItem[];
  devices: ArticleAnalyticsBreakdownItem[];
  browsers: ArticleAnalyticsBreakdownItem[];
  operatingSystems: ArticleAnalyticsBreakdownItem[];
  contentEvaluation: ArticleContentEvaluation;
  seoAudit: ArticleSeoAudit;
}

export interface ProjectTimeSeriesPoint {
  date: string;
  views: number;
  demoClicks: number;
  repoClicks: number;
  totalClicks: number;
}

export interface ProjectAnalyticsBreakdownItem {
  name: string;
  count: number;
  percentage: number;
}

export interface ProjectAnalyticsData {
  period: string;
  dateFrom: string;
  dateTo: string;
  summary: {
    totalViews: number;
    uniqueVisitors: number;
    demoClicks: number;
    repoClicks: number;
    totalClicks: number;
    conversionRate: number; // percentage (totalClicks / totalViews * 100)
    periodGrowth: number;
  };
  timeSeries: ProjectTimeSeriesPoint[];
  sources: ProjectAnalyticsBreakdownItem[];
  devices: ProjectAnalyticsBreakdownItem[];
  browsers: ProjectAnalyticsBreakdownItem[];
  operatingSystems: ProjectAnalyticsBreakdownItem[];
}

// ==========================================
// 14. QUEUE, JOBS & BACKGROUND PROCESSING
// ==========================================

export interface TelegramLeadNotificationPayload {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  budgetRange?: string | null;
  projectCategory?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface ActivityLogJobPayload {
  userId?: string | null;
  action: ActivityAction;
  entity: string;
  entityId?: string | null;
  payload?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface ScheduledArticlesPublishResult {
  processedCount: number;
  publishedPostIds: string[];
  timestamp: string;
}

export interface QueueHealthStatus {
  redisConnected: boolean;
  queues: {
    telegram: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
    };
    scheduledArticles: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
    };
    activityLogs: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
    };
  };
}
