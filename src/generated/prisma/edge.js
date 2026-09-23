
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.2.1
 * Query Engine version: 4123509d24aa4dede1e864b46351bf2790323b69
 */
Prisma.prismaVersion = {
  client: "6.2.1",
  engine: "4123509d24aa4dede1e864b46351bf2790323b69"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AcademicPeriodScalarFieldEnum = {
  id: 'id',
  name: 'name',
  yearStart: 'yearStart',
  yearEnd: 'yearEnd',
  cabinetNameOsis: 'cabinetNameOsis',
  cabinetNameMpk: 'cabinetNameMpk',
  theme: 'theme',
  isActive: 'isActive',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  nis: 'nis',
  nisn: 'nisn',
  rfidCard: 'rfidCard',
  name: 'name',
  email: 'email',
  password: 'password',
  image: 'image',
  role: 'role',
  division: 'division',
  position: 'position',
  kelas: 'kelas',
  major: 'major',
  gender: 'gender',
  phone: 'phone',
  bio: 'bio',
  isActive: 'isActive',
  deletedAt: 'deletedAt',
  periodId: 'periodId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AspirationScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  category: 'category',
  targetDivision: 'targetDivision',
  status: 'status',
  response: 'response',
  respondedAt: 'respondedAt',
  isAnonymous: 'isAnonymous',
  isPublic: 'isPublic',
  attachmentUrl: 'attachmentUrl',
  upvotesCount: 'upvotesCount',
  userId: 'userId',
  respondedById: 'respondedById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AspirationTimelineScalarFieldEnum = {
  id: 'id',
  aspirationId: 'aspirationId',
  status: 'status',
  note: 'note',
  changedByName: 'changedByName',
  createdAt: 'createdAt'
};

exports.Prisma.AspirationUpvoteScalarFieldEnum = {
  id: 'id',
  aspirationId: 'aspirationId',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.WorkProgramScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  division: 'division',
  targetPeriod: 'targetPeriod',
  budget: 'budget',
  budgetPlanned: 'budgetPlanned',
  budgetRealized: 'budgetRealized',
  status: 'status',
  personInCharge: 'personInCharge',
  proposalUrl: 'proposalUrl',
  lpjUrl: 'lpjUrl',
  evaluationNotes: 'evaluationNotes',
  periodId: 'periodId',
  authorId: 'authorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  title: 'title',
  excerpt: 'excerpt',
  content: 'content',
  coverImage: 'coverImage',
  galleryImages: 'galleryImages',
  category: 'category',
  division: 'division',
  status: 'status',
  isFeatured: 'isFeatured',
  eventDate: 'eventDate',
  location: 'location',
  views: 'views',
  prokerId: 'prokerId',
  periodId: 'periodId',
  authorId: 'authorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StructureMemberScalarFieldEnum = {
  id: 'id',
  name: 'name',
  role: 'role',
  badge: 'badge',
  photo: 'photo',
  level: 'level',
  orgType: 'orgType',
  divisionCode: 'divisionCode',
  order: 'order',
  instagramUrl: 'instagramUrl',
  linkedinUrl: 'linkedinUrl',
  isActive: 'isActive',
  periodId: 'periodId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AttendanceSessionScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  type: 'type',
  targetDivision: 'targetDivision',
  location: 'location',
  date: 'date',
  startTime: 'startTime',
  endTime: 'endTime',
  passcode: 'passcode',
  qrToken: 'qrToken',
  isOpen: 'isOpen',
  periodId: 'periodId',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AttendanceRecordScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  userId: 'userId',
  status: 'status',
  checkInTime: 'checkInTime',
  notes: 'notes',
  proofImage: 'proofImage',
  isVerified: 'isVerified',
  verifiedById: 'verifiedById',
  verifiedAt: 'verifiedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MemberTaskScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  division: 'division',
  priority: 'priority',
  status: 'status',
  dueDate: 'dueDate',
  workProgramId: 'workProgramId',
  assignedToId: 'assignedToId',
  createdById: 'createdById',
  submissionNote: 'submissionNote',
  submissionLink: 'submissionLink',
  reviewNote: 'reviewNote',
  completedAt: 'completedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  description: 'description',
  metadata: 'metadata',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  actorId: 'actorId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  KEPALA_SEKOLAH: 'KEPALA_SEKOLAH',
  KESISWAAN: 'KESISWAAN',
  PEMBINA: 'PEMBINA',
  BPH_OSIS: 'BPH_OSIS',
  BPH_MPK: 'BPH_MPK',
  SEKBID_OFFICER: 'SEKBID_OFFICER',
  KOMISI_OFFICER: 'KOMISI_OFFICER',
  STUDENT: 'STUDENT'
};

exports.Division = exports.$Enums.Division = {
  SEKBID_1: 'SEKBID_1',
  SEKBID_2: 'SEKBID_2',
  SEKBID_3: 'SEKBID_3',
  SEKBID_4: 'SEKBID_4',
  SEKBID_5: 'SEKBID_5',
  SEKBID_6: 'SEKBID_6',
  SEKBID_7: 'SEKBID_7',
  SEKBID_8: 'SEKBID_8',
  SEKBID_9: 'SEKBID_9',
  SEKBID_10: 'SEKBID_10',
  KOMISI_A: 'KOMISI_A',
  KOMISI_B: 'KOMISI_B',
  KOMISI_C: 'KOMISI_C',
  KOMISI_D: 'KOMISI_D',
  BPH_OSIS: 'BPH_OSIS',
  BPH_MPK: 'BPH_MPK',
  KESISWAAN: 'KESISWAAN',
  PEMBINA: 'PEMBINA',
  KEPALA_SEKOLAH: 'KEPALA_SEKOLAH',
  GENERAL: 'GENERAL'
};

exports.OrganizationType = exports.$Enums.OrganizationType = {
  SHARED: 'SHARED',
  OSIS: 'OSIS',
  MPK: 'MPK',
  DEWAN_PEMBINA: 'DEWAN_PEMBINA'
};

exports.Gender = exports.$Enums.Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

exports.AspirationStatus = exports.$Enums.AspirationStatus = {
  PENDING: 'PENDING',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  RESOLVED: 'RESOLVED'
};

exports.ProkerStatus = exports.$Enums.ProkerStatus = {
  PLANNED: 'PLANNED',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  EVALUATED: 'EVALUATED',
  CANCELLED: 'CANCELLED'
};

exports.PostStatus = exports.$Enums.PostStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

exports.AttendanceType = exports.$Enums.AttendanceType = {
  MEETING: 'MEETING',
  EVENT: 'EVENT',
  DUTY_PIKET: 'DUTY_PIKET',
  GENERAL_ASSEMBLY: 'GENERAL_ASSEMBLY'
};

exports.AttendanceStatus = exports.$Enums.AttendanceStatus = {
  PRESENT: 'PRESENT',
  LATE: 'LATE',
  PERMISSION: 'PERMISSION',
  SICK: 'SICK',
  ABSENT: 'ABSENT'
};

exports.TaskPriority = exports.$Enums.TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

exports.TaskStatus = exports.$Enums.TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  COMPLETED: 'COMPLETED'
};

exports.AuditAction = exports.$Enums.AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  VERIFY: 'VERIFY'
};

exports.Prisma.ModelName = {
  AcademicPeriod: 'AcademicPeriod',
  User: 'User',
  Aspiration: 'Aspiration',
  AspirationTimeline: 'AspirationTimeline',
  AspirationUpvote: 'AspirationUpvote',
  WorkProgram: 'WorkProgram',
  Activity: 'Activity',
  StructureMember: 'StructureMember',
  AttendanceSession: 'AttendanceSession',
  AttendanceRecord: 'AttendanceRecord',
  MemberTask: 'MemberTask',
  AuditLog: 'AuditLog'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "D:\\OSIM11\\src\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [
      "postgresqlExtensions"
    ],
    "sourceFilePath": "D:\\OSIM11\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "6.2.1",
  "engineVersion": "4123509d24aa4dede1e864b46351bf2790323b69",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  output          = \"../src/generated/prisma\"\n  previewFeatures = [\"postgresqlExtensions\"]\n}\n\ndatasource db {\n  provider   = \"postgresql\"\n  url        = env(\"DATABASE_URL\")\n  extensions = [pgcrypto]\n}\n\n// ═══════════════════════════════════════════════════════════════════════════════\n// ENUMS\n// ═══════════════════════════════════════════════════════════════════════════════\n\nenum Role {\n  ADMINISTRATOR  @map(\"administrator\")\n  KEPALA_SEKOLAH @map(\"kepala_sekolah\")\n  KESISWAAN      @map(\"kesiswaan\")\n  PEMBINA        @map(\"pembina\")\n  BPH_OSIS       @map(\"bph_osis\")\n  BPH_MPK        @map(\"bph_mpk\")\n  SEKBID_OFFICER @map(\"sekbid_officer\")\n  KOMISI_OFFICER @map(\"komisi_officer\")\n  STUDENT        @map(\"student\")\n\n  @@map(\"user_roles\")\n}\n\nenum Division {\n  // OSIS SEKBID 1 - 10\n  SEKBID_1  @map(\"sekbid_1\")\n  SEKBID_2  @map(\"sekbid_2\")\n  SEKBID_3  @map(\"sekbid_3\")\n  SEKBID_4  @map(\"sekbid_4\")\n  SEKBID_5  @map(\"sekbid_5\")\n  SEKBID_6  @map(\"sekbid_6\")\n  SEKBID_7  @map(\"sekbid_7\")\n  SEKBID_8  @map(\"sekbid_8\")\n  SEKBID_9  @map(\"sekbid_9\")\n  SEKBID_10 @map(\"sekbid_10\")\n\n  // MPK KOMISI A - D\n  KOMISI_A @map(\"komisi_a\")\n  KOMISI_B @map(\"komisi_b\")\n  KOMISI_C @map(\"komisi_c\")\n  KOMISI_D @map(\"komisi_d\")\n\n  // PIMPINAN & UMUM\n  BPH_OSIS       @map(\"bph_osis\")\n  BPH_MPK        @map(\"bph_mpk\")\n  KESISWAAN      @map(\"kesiswaan\")\n  PEMBINA        @map(\"pembina\")\n  KEPALA_SEKOLAH @map(\"kepala_sekolah\")\n  GENERAL        @map(\"general\")\n\n  @@map(\"organization_divisions\")\n}\n\nenum OrganizationType {\n  SHARED        @map(\"shared\")\n  OSIS          @map(\"osis\")\n  MPK           @map(\"mpk\")\n  DEWAN_PEMBINA @map(\"dewan_pembina\")\n\n  @@map(\"organization_types\")\n}\n\nenum Gender {\n  MALE   @map(\"male\")\n  FEMALE @map(\"female\")\n\n  @@map(\"user_genders\")\n}\n\nenum AspirationStatus {\n  PENDING   @map(\"pending\")\n  IN_REVIEW @map(\"in_review\")\n  APPROVED  @map(\"approved\")\n  REJECTED  @map(\"rejected\")\n  RESOLVED  @map(\"resolved\")\n\n  @@map(\"aspiration_statuses\")\n}\n\nenum ProkerStatus {\n  PLANNED   @map(\"planned\")\n  ONGOING   @map(\"ongoing\")\n  COMPLETED @map(\"completed\")\n  EVALUATED @map(\"evaluated\")\n  CANCELLED @map(\"cancelled\")\n\n  @@map(\"proker_statuses\")\n}\n\nenum PostStatus {\n  DRAFT     @map(\"draft\")\n  PUBLISHED @map(\"published\")\n  ARCHIVED  @map(\"archived\")\n\n  @@map(\"post_statuses\")\n}\n\nenum AttendanceType {\n  MEETING          @map(\"meeting\") // Rapat Pleno, Rapat BPH, Rapat Sekbid/Komisi\n  EVENT            @map(\"event\") // Kegiatan Sekolah, Porseni, LDK, Upacara\n  DUTY_PIKET       @map(\"duty_piket\") // Piket Harian Ruang OSIS/MPK\n  GENERAL_ASSEMBLY @map(\"general_assembly\") // Sidang Umum & Musyawarah\n\n  @@map(\"attendance_types\")\n}\n\nenum AttendanceStatus {\n  PRESENT    @map(\"present\") // Hadir tepat waktu\n  LATE       @map(\"late\") // Hadir terlambat\n  PERMISSION @map(\"permission\") // Izin resmi\n  SICK       @map(\"sick\") // Sakit dengan surat/keterangan\n  ABSENT     @map(\"absent\") // Tanpa keterangan / Alpa\n\n  @@map(\"attendance_statuses\")\n}\n\nenum TaskPriority {\n  LOW    @map(\"low\")\n  MEDIUM @map(\"medium\")\n  HIGH   @map(\"high\")\n  URGENT @map(\"urgent\")\n\n  @@map(\"task_priorities\")\n}\n\nenum TaskStatus {\n  TODO        @map(\"todo\") // Belum dikerjakan\n  IN_PROGRESS @map(\"in_progress\") // Sedang berjalan\n  SUBMITTED   @map(\"submitted\") // Laporan tugas diserahkan\n  COMPLETED   @map(\"completed\") // Terverifikasi selesai\n\n  @@map(\"task_statuses\")\n}\n\nenum AuditAction {\n  CREATE  @map(\"create\")\n  UPDATE  @map(\"update\")\n  DELETE  @map(\"delete\")\n  LOGIN   @map(\"login\")\n  APPROVE @map(\"approve\")\n  REJECT  @map(\"reject\")\n  VERIFY  @map(\"verify\")\n\n  @@map(\"audit_actions\")\n}\n\n// ═══════════════════════════════════════════════════════════════════════════════\n// 1. ACADEMIC & CABINET PERIOD (PERIODE KEPENGURUSAN MULTI-TAHUN)\n// ═══════════════════════════════════════════════════════════════════════════════\n\nmodel AcademicPeriod {\n  id              String    @id @default(cuid())\n  name            String // Contoh: \"2025/2026\"\n  yearStart       Int // 2025\n  yearEnd         Int // 2026\n  cabinetNameOsis String? // Contoh: \"Navastra\"\n  cabinetNameMpk  String? // Contoh: \"Navandya\"\n  theme           String? // Contoh: \"Sinergi Aksi, Nyata Berprestasi\"\n  isActive        Boolean   @default(false)\n  startDate       DateTime?\n  endDate         DateTime?\n  createdAt       DateTime  @default(now())\n  updatedAt       DateTime  @updatedAt\n\n  // Relasi Data per Periode\n  users              User[]\n  structureMembers   StructureMember[]\n  workPrograms       WorkProgram[]\n  attendanceSessions AttendanceSession[]\n  activities         Activity[]\n\n  @@unique([yearStart, yearEnd])\n  @@index([isActive])\n  @@map(\"academic_periods\")\n}\n\n// ═══════════════════════════════════════════════════════════════════════════════\n// 2. USER & AUTHENTICATION\n// ═══════════════════════════════════════════════════════════════════════════════\n\nmodel User {\n  id        String    @id @default(cuid())\n  nis       String?   @unique\n  nisn      String?   @unique\n  rfidCard  String?   @unique // UID / ID Kartu RFID Siswa/Pengurus (misal: \"0014298172\")\n  name      String?\n  email     String?   @unique\n  password  String?\n  image     String?   @db.Text\n  role      Role      @default(STUDENT)\n  division  Division?\n  position  String? // Contoh: \"Ketua Umum\", \"Koordinator\", \"Sekretaris I\", \"Anggota\"\n  kelas     String? // Contoh: \"XII RPL 1\"\n  major     String? // Contoh: \"RPL\", \"TKJ\", \"AKL\", \"DKV\", \"MPLB\"\n  gender    Gender?\n  phone     String? // Nomor WhatsApp\n  bio       String?   @db.Text\n  isActive  Boolean   @default(true)\n  deletedAt DateTime? // Soft delete flag\n\n  // Periode Kepengurusan (opsional untuk siswa umum, diisi untuk pengurus kabinet)\n  periodId String?\n  period   AcademicPeriod? @relation(fields: [periodId], references: [id], onDelete: SetNull)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relasi Aspirasi\n  aspirations       Aspiration[]       @relation(\"UserAspirations\")\n  responses         Aspiration[]       @relation(\"ResponderAspirations\")\n  aspirationUpvotes AspirationUpvote[]\n\n  // Relasi Konten & Proker\n  activities   Activity[]\n  workPrograms WorkProgram[]\n\n  // Relasi Presensi Digital\n  attendanceRecords         AttendanceRecord[]\n  createdAttendanceSessions AttendanceSession[] @relation(\"SessionCreator\")\n  verifiedAttendances       AttendanceRecord[]  @relation(\"AttendanceVerifier\")\n\n  // Relasi Manajemen Tugas Anggota\n  assignedTasks MemberTask[] @relation(\"AssignedTo\")\n  createdTasks  MemberTask[] @relation(\"TaskCreator\")\n\n  // Relasi Audit Log\n  auditLogs AuditLog[] @relation(\"ActorAuditLogs\")\n\n  @@index([role])\n  @@index([division])\n  @@index([periodId])\n  @@index([isActive])\n  @@map(\"users\")\n}\n\n// ═══════════════════════════════════════════════════════════════════════════════\n// 3. ASPIRASI & ADVOKASI SISWA (KOTAK ASPIRASI DIGITAL)\n// ═══════════════════════════════════════════════════════════════════════════════\n\nmodel Aspiration {\n  id             String           @id @default(cuid())\n  title          String\n  content        String           @db.Text\n  category       String // Fasilitas, Akademik, Kegiatan, Tata Tertib, Ekstrakurikuler, dll.\n  targetDivision Division         @default(KOMISI_B) // Default dikelola Komisi B (Aspirasi & Advokasi)\n  status         AspirationStatus @default(PENDING)\n  response       String?          @db.Text\n  respondedAt    DateTime?\n  isAnonymous    Boolean          @default(false)\n  isPublic       Boolean          @default(true) // Apakah tampil di feed aspirasi publik\n  attachmentUrl  String?          @db.Text // Bukti foto pendukung aspirasi\n  upvotesCount   Int              @default(0) // Cache hitungan upvote siswa\n\n  // Siswa pengirim\n  userId String\n  user   User   @relation(\"UserAspirations\", fields: [userId], references: [id], onDelete: Cascade)\n\n  // Pengurus penanggap\n  respondedById String?\n  respondedBy   User?   @relation(\"ResponderAspirations\", fields: [respondedById], references: [id], onDelete: SetNull)\n\n  // Timeline / History Status Aspirasi\n  timeline AspirationTimeline[]\n  upvotes  AspirationUpvote[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@index([targetDivision])\n  @@index([status])\n  @@index([category])\n  @@index([createdAt])\n  @@map(\"aspirations\")\n}\n\nmodel AspirationTimeline {\n  id            String           @id @default(cuid())\n  aspirationId  String\n  aspiration    Aspiration       @relation(fields: [aspirationId], references: [id], onDelete: Cascade)\n  status        AspirationStatus\n  note          String?          @db.Text\n  changedByName String? // Nama aktor pengubah status\n  createdAt     DateTime         @default(now())\n\n  @@index([aspirationId])\n  @@map(\"aspiration_timelines\")\n}\n\nmodel AspirationUpvote {\n  id           String     @id @default(cuid())\n  aspirationId String\n  aspiration   Aspiration @relation(fields: [aspirationId], references: [id], onDelete: Cascade)\n  userId       String\n  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt    DateTime   @default(now())\n\n  @@unique([aspirationId, userId])\n  @@index([aspirationId])\n  @@index([userId])\n  @@map(\"aspiration_upvotes\")\n}\n\n// ═══════════════════════════════════════════════════════════════════════════════\n// 4. PROGRAM KERJA (PROKER) & ANGGARAN\n// ═══════════════════════════════════════════════════════════════════════════════\n\nmodel WorkProgram {\n  id              String       @id @default(cuid())\n  title           String\n  description     String       @db.Text\n  division        Division\n  targetPeriod    String // Contoh: \"Mei 2026\" / \"Semester Ganjil\"\n  budget          Float?       @default(0) // Anggaran Rencana (Legacy & Quick Access)\n  budgetPlanned   Float?       @default(0) // Rencana Anggaran Biaya (RAB)\n  budgetRealized  Float?       @default(0) // Realisasi Anggaran Terpakai\n  status          ProkerStatus @default(PLANNED)\n  personInCharge  String? // Penanggung Jawab Proker\n  proposalUrl     String?      @db.Text // Link Dokumen Proposal\n  lpjUrl          String?      @db.Text // Link Dokumen LPJ\n  evaluationNotes String?      @db.Text // Catatan evaluasi Komisi D MPK & Pembina\n\n  // Periode Kepengurusan\n  periodId String?\n  period   AcademicPeriod? @relation(fields: [periodId], references: [id], onDelete: SetNull)\n\n  // Author / Penanggung jawab akun\n  authorId String\n  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)\n\n  // Relasi Turunan (Kegiatan Publikasi & Tugas Anggota)\n  activities Activity[]\n  tasks      MemberTask[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([division])\n  @@index([status])\n  @@index([periodId])\n  @@map(\"work_programs\")\n}\n\n// ═══════════════════════════════════════════════════════════════════════════════\n// 5. KEGIATAN, ARTIKEL, DOKUMENTASI & GALERI (CMS)\n// ═══════════════════════════════════════════════════════════════════════════════\n\nmodel Activity {\n  id            String     @id @default(cuid())\n  slug          String     @unique\n  title         String\n  excerpt       String?    @db.Text\n  content       String     @db.Text\n  coverImage    String?    @db.Text\n  galleryImages String[]   @default([])\n  category      String // Olahraga, Seni, Keagamaan, Kepemimpinan, Lingkungan, dll.\n  division      Division   @default(GENERAL)\n  status        PostStatus @default(PUBLISHED)\n  isFeatured    Boolean    @default(false)\n  eventDate     DateTime?\n  location      String?\n  views         Int        @default(0)\n\n  // Hubungan ke Program Kerja & Periode\n  prokerId    String?\n  workProgram WorkProgram?    @relation(fields: [prokerId], references: [id], onDelete: SetNull)\n  periodId    String?\n  period      AcademicPeriod? @relation(fields: [periodId], references: [id], onDelete: SetNull)\n\n  authorId String\n  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([division])\n  @@index([status])\n  @@index([isFeatured])\n  @@index([periodId])\n  @@index([eventDate])\n  @@map(\"activities\")\n}\n\n// ═══════════════════════════════════════════════════════════════════════════════\n// 6. STRUKTUR ORGANISASI KABINET (ORGANIZATION STRUCTURE)\n// ═══════════════════════════════════════════════════════════════════════════════\n\nmodel StructureMember {\n  id           String    @id @default(cuid())\n  name         String\n  role         String // Contoh: \"Ketua Umum\", \"Koordinator\", \"Kepala Sekolah\"\n  badge        String // Contoh: \"Ketua OSIS\", \"Sekbid 1\", \"Pelindung\"\n  photo        String?   @db.Text\n  level        Int       @default(1) // 1: Kepsek, 2: Kesiswaan & Pembina, 3: Ketua/Wakil, 4: Sekre/Bend, 5: Sekbid/Komisi\n  orgType      String    @default(\"SHARED\") // SHARED, OSIS, MPK, DEWAN_PEMBINA\n  divisionCode Division?\n  order        Int       @default(0)\n  instagramUrl String?\n  linkedinUrl  String?\n  isActive     Boolean   @default(true)\n\n  // Periode Kepengurusan\n  periodId String?\n  period   AcademicPeriod? @relation(fields: [periodId], references: [id], onDelete: SetNull)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([orgType])\n  @@index([level])\n  @@index([order])\n  @@index([periodId])\n  @@map(\"structure_members\")\n}\n\n// ═══════════════════════════════════════════════════════════════════════════════\n// 7. SISTEM PRESENSI DIGITAL (ATTENDANCE SYSTEM)\n// ═══════════════════════════════════════════════════════════════════════════════\n\nmodel AttendanceSession {\n  id             String         @id @default(cuid())\n  title          String // Contoh: \"Rapat Pleno Triwulan I\", \"Piket Ruang OSIS Rabu\"\n  description    String?        @db.Text\n  type           AttendanceType @default(MEETING)\n  targetDivision Division       @default(GENERAL) // Target peserta (GENERAL / OSIS / MPK / Sekbid tertentu)\n  location       String? // Contoh: \"Ruang Rapat OSIS-MPK\", \"Aula SMKN 11\"\n  date           DateTime       @default(now())\n  startTime      String? // Contoh: \"13:30\"\n  endTime        String? // Contoh: \"16:00\"\n  passcode       String? // Kode OTP / PIN 6-digit untuk scan mandiri anggota\n  qrToken        String?        @unique // Token QR Code dinamis untuk scan presensi\n  isOpen         Boolean        @default(true) // Status sesi buka / tutup\n\n  // Periode Kepengurusan\n  periodId String?\n  period   AcademicPeriod? @relation(fields: [periodId], references: [id], onDelete: SetNull)\n\n  createdById String\n  creator     User   @relation(\"SessionCreator\", fields: [createdById], references: [id], onDelete: Cascade)\n\n  records AttendanceRecord[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([targetDivision])\n  @@index([date])\n  @@index([isOpen])\n  @@index([periodId])\n  @@map(\"attendance_sessions\")\n}\n\nmodel AttendanceRecord {\n  id        String            @id @default(cuid())\n  sessionId String\n  session   AttendanceSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  status      AttendanceStatus @default(PRESENT)\n  checkInTime DateTime         @default(now())\n  notes       String?          @db.Text // Alasan izin/sakit atau catatan kehadiran\n  proofImage  String?          @db.Text // Foto bukti izin / surat dokter / selfie presensi\n\n  // Verifikasi oleh Sekretaris / Admin\n  isVerified   Boolean   @default(true)\n  verifiedById String?\n  verifiedBy   User?     @relation(\"AttendanceVerifier\", fields: [verifiedById], references: [id], onDelete: SetNull)\n  verifiedAt   DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([sessionId, userId]) // Setiap anggota hanya punya 1 record per sesi\n  @@index([sessionId])\n  @@index([userId])\n  @@index([status])\n  @@map(\"attendance_records\")\n}\n\n// ═══════════════════════════════════════════════════════════════════════════════\n// 8. SISTEM MANAJEMEN TUGAS ANGGOTA (MEMBER TASKS ASSIGNMENT)\n// ═══════════════════════════════════════════════════════════════════════════════\n\nmodel MemberTask {\n  id          String       @id @default(cuid())\n  title       String // Contoh: \"Buat Desain Banner Porseni\", \"Rekap Anggaran Kas Bulan Maret\"\n  description String       @db.Text\n  division    Division // Divisi terkait (Sekbid / Komisi)\n  priority    TaskPriority @default(MEDIUM)\n  status      TaskStatus   @default(TODO)\n  dueDate     DateTime?\n\n  // Relasi ke Proker spesifik (opsional)\n  workProgramId String?\n  workProgram   WorkProgram? @relation(fields: [workProgramId], references: [id], onDelete: SetNull)\n\n  // Anggota yang ditugaskan\n  assignedToId String\n  assignedTo   User   @relation(\"AssignedTo\", fields: [assignedToId], references: [id], onDelete: Cascade)\n\n  // Pembuat tugas (Koordinator / Ketua / Sekretaris)\n  createdById String\n  creator     User   @relation(\"TaskCreator\", fields: [createdById], references: [id], onDelete: Cascade)\n\n  // Submission & Review\n  submissionNote String?   @db.Text\n  submissionLink String?   @db.Text // Link Google Drive / Figma / File laporan\n  reviewNote     String?   @db.Text // Feedback evaluator\n  completedAt    DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([division])\n  @@index([assignedToId])\n  @@index([status])\n  @@index([workProgramId])\n  @@map(\"member_tasks\")\n}\n\n// ═══════════════════════════════════════════════════════════════════════════════\n// 9. AUDIT LOGS & SECURITY AUDIT TRAIL\n// ═══════════════════════════════════════════════════════════════════════════════\n\nmodel AuditLog {\n  id          String      @id @default(cuid())\n  action      AuditAction\n  entity      String // Contoh: \"Aspiration\", \"User\", \"WorkProgram\", \"Attendance\"\n  entityId    String?\n  description String      @db.Text\n  metadata    Json? // Snapshot data perubahan (sebelum & sesudah)\n  ipAddress   String?\n  userAgent   String?\n\n  actorId String?\n  actor   User?   @relation(\"ActorAuditLogs\", fields: [actorId], references: [id], onDelete: SetNull)\n\n  createdAt DateTime @default(now())\n\n  @@index([action])\n  @@index([entity])\n  @@index([actorId])\n  @@index([createdAt])\n  @@map(\"audit_logs\")\n}\n",
  "inlineSchemaHash": "0311b99a67e59be89c4c9f79eb0f788948109342ca9c3901a1799cbeacadf4f2",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"AcademicPeriod\":{\"dbName\":\"academic_periods\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"yearStart\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"yearEnd\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cabinetNameOsis\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cabinetNameMpk\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"theme\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"users\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"AcademicPeriodToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"structureMembers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"StructureMember\",\"nativeType\":null,\"relationName\":\"AcademicPeriodToStructureMember\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workPrograms\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"WorkProgram\",\"nativeType\":null,\"relationName\":\"AcademicPeriodToWorkProgram\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"attendanceSessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AttendanceSession\",\"nativeType\":null,\"relationName\":\"AcademicPeriodToAttendanceSession\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activities\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Activity\",\"nativeType\":null,\"relationName\":\"AcademicPeriodToActivity\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"yearStart\",\"yearEnd\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"yearStart\",\"yearEnd\"]}],\"isGenerated\":false},\"User\":{\"dbName\":\"users\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nis\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nisn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rfidCard\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"image\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Role\",\"nativeType\":null,\"default\":\"STUDENT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"division\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Division\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"position\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"kelas\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"major\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"gender\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Gender\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bio\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deletedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"period\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AcademicPeriod\",\"nativeType\":null,\"relationName\":\"AcademicPeriodToUser\",\"relationFromFields\":[\"periodId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"aspirations\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Aspiration\",\"nativeType\":null,\"relationName\":\"UserAspirations\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"responses\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Aspiration\",\"nativeType\":null,\"relationName\":\"ResponderAspirations\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aspirationUpvotes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AspirationUpvote\",\"nativeType\":null,\"relationName\":\"AspirationUpvoteToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activities\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Activity\",\"nativeType\":null,\"relationName\":\"ActivityToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workPrograms\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"WorkProgram\",\"nativeType\":null,\"relationName\":\"UserToWorkProgram\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"attendanceRecords\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AttendanceRecord\",\"nativeType\":null,\"relationName\":\"AttendanceRecordToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAttendanceSessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AttendanceSession\",\"nativeType\":null,\"relationName\":\"SessionCreator\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedAttendances\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AttendanceRecord\",\"nativeType\":null,\"relationName\":\"AttendanceVerifier\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedTasks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MemberTask\",\"nativeType\":null,\"relationName\":\"AssignedTo\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdTasks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MemberTask\",\"nativeType\":null,\"relationName\":\"TaskCreator\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"auditLogs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AuditLog\",\"nativeType\":null,\"relationName\":\"ActorAuditLogs\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Aspiration\":{\"dbName\":\"aspirations\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetDivision\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Division\",\"nativeType\":null,\"default\":\"KOMISI_B\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AspirationStatus\",\"nativeType\":null,\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"response\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"respondedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isAnonymous\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isPublic\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"attachmentUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"upvotesCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"UserAspirations\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"respondedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"respondedBy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"ResponderAspirations\",\"relationFromFields\":[\"respondedById\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timeline\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AspirationTimeline\",\"nativeType\":null,\"relationName\":\"AspirationToAspirationTimeline\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"upvotes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AspirationUpvote\",\"nativeType\":null,\"relationName\":\"AspirationToAspirationUpvote\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AspirationTimeline\":{\"dbName\":\"aspiration_timelines\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aspirationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aspiration\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Aspiration\",\"nativeType\":null,\"relationName\":\"AspirationToAspirationTimeline\",\"relationFromFields\":[\"aspirationId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AspirationStatus\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"note\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"changedByName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AspirationUpvote\":{\"dbName\":\"aspiration_upvotes\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aspirationId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"aspiration\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Aspiration\",\"nativeType\":null,\"relationName\":\"AspirationToAspirationUpvote\",\"relationFromFields\":[\"aspirationId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"AspirationUpvoteToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"aspirationId\",\"userId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"aspirationId\",\"userId\"]}],\"isGenerated\":false},\"WorkProgram\":{\"dbName\":\"work_programs\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"division\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Division\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetPeriod\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"budget\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"budgetPlanned\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"budgetRealized\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ProkerStatus\",\"nativeType\":null,\"default\":\"PLANNED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"personInCharge\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"proposalUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lpjUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"evaluationNotes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"period\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AcademicPeriod\",\"nativeType\":null,\"relationName\":\"AcademicPeriodToWorkProgram\",\"relationFromFields\":[\"periodId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"author\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"UserToWorkProgram\",\"relationFromFields\":[\"authorId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activities\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Activity\",\"nativeType\":null,\"relationName\":\"ActivityToWorkProgram\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tasks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MemberTask\",\"nativeType\":null,\"relationName\":\"MemberTaskToWorkProgram\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Activity\":{\"dbName\":\"activities\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"slug\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"excerpt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"content\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"coverImage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"galleryImages\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"division\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Division\",\"nativeType\":null,\"default\":\"GENERAL\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PostStatus\",\"nativeType\":null,\"default\":\"PUBLISHED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isFeatured\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"location\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"views\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"prokerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workProgram\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"WorkProgram\",\"nativeType\":null,\"relationName\":\"ActivityToWorkProgram\",\"relationFromFields\":[\"prokerId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"period\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AcademicPeriod\",\"nativeType\":null,\"relationName\":\"AcademicPeriodToActivity\",\"relationFromFields\":[\"periodId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"author\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"ActivityToUser\",\"relationFromFields\":[\"authorId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"StructureMember\":{\"dbName\":\"structure_members\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"badge\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"photo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"level\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"orgType\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":\"SHARED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"divisionCode\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Division\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"order\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"instagramUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"linkedinUrl\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isActive\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"period\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AcademicPeriod\",\"nativeType\":null,\"relationName\":\"AcademicPeriodToStructureMember\",\"relationFromFields\":[\"periodId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AttendanceSession\":{\"dbName\":\"attendance_sessions\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AttendanceType\",\"nativeType\":null,\"default\":\"MEETING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"targetDivision\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Division\",\"nativeType\":null,\"default\":\"GENERAL\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"location\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"date\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"passcode\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"qrToken\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isOpen\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"periodId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"period\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AcademicPeriod\",\"nativeType\":null,\"relationName\":\"AcademicPeriodToAttendanceSession\",\"relationFromFields\":[\"periodId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creator\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"SessionCreator\",\"relationFromFields\":[\"createdById\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"records\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AttendanceRecord\",\"nativeType\":null,\"relationName\":\"AttendanceRecordToAttendanceSession\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AttendanceRecord\":{\"dbName\":\"attendance_records\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"session\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AttendanceSession\",\"nativeType\":null,\"relationName\":\"AttendanceRecordToAttendanceSession\",\"relationFromFields\":[\"sessionId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"user\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"AttendanceRecordToUser\",\"relationFromFields\":[\"userId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AttendanceStatus\",\"nativeType\":null,\"default\":\"PRESENT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"checkInTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"proofImage\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isVerified\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedBy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"AttendanceVerifier\",\"relationFromFields\":[\"verifiedById\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"verifiedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[[\"sessionId\",\"userId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"sessionId\",\"userId\"]}],\"isGenerated\":false},\"MemberTask\":{\"dbName\":\"member_tasks\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"division\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Division\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TaskPriority\",\"nativeType\":null,\"default\":\"MEDIUM\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TaskStatus\",\"nativeType\":null,\"default\":\"TODO\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workProgramId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"workProgram\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"WorkProgram\",\"nativeType\":null,\"relationName\":\"MemberTaskToWorkProgram\",\"relationFromFields\":[\"workProgramId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedToId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedTo\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"AssignedTo\",\"relationFromFields\":[\"assignedToId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creator\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"TaskCreator\",\"relationFromFields\":[\"createdById\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"submissionNote\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"submissionLink\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reviewNote\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AuditLog\":{\"dbName\":\"audit_logs\",\"schema\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":{\"name\":\"cuid\",\"args\":[1]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AuditAction\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ipAddress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"userAgent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actor\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"nativeType\":null,\"relationName\":\"ActorAuditLogs\",\"relationFromFields\":[\"actorId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"Role\":{\"values\":[{\"name\":\"ADMINISTRATOR\",\"dbName\":\"administrator\"},{\"name\":\"KEPALA_SEKOLAH\",\"dbName\":\"kepala_sekolah\"},{\"name\":\"KESISWAAN\",\"dbName\":\"kesiswaan\"},{\"name\":\"PEMBINA\",\"dbName\":\"pembina\"},{\"name\":\"BPH_OSIS\",\"dbName\":\"bph_osis\"},{\"name\":\"BPH_MPK\",\"dbName\":\"bph_mpk\"},{\"name\":\"SEKBID_OFFICER\",\"dbName\":\"sekbid_officer\"},{\"name\":\"KOMISI_OFFICER\",\"dbName\":\"komisi_officer\"},{\"name\":\"STUDENT\",\"dbName\":\"student\"}],\"dbName\":\"user_roles\"},\"Division\":{\"values\":[{\"name\":\"SEKBID_1\",\"dbName\":\"sekbid_1\"},{\"name\":\"SEKBID_2\",\"dbName\":\"sekbid_2\"},{\"name\":\"SEKBID_3\",\"dbName\":\"sekbid_3\"},{\"name\":\"SEKBID_4\",\"dbName\":\"sekbid_4\"},{\"name\":\"SEKBID_5\",\"dbName\":\"sekbid_5\"},{\"name\":\"SEKBID_6\",\"dbName\":\"sekbid_6\"},{\"name\":\"SEKBID_7\",\"dbName\":\"sekbid_7\"},{\"name\":\"SEKBID_8\",\"dbName\":\"sekbid_8\"},{\"name\":\"SEKBID_9\",\"dbName\":\"sekbid_9\"},{\"name\":\"SEKBID_10\",\"dbName\":\"sekbid_10\"},{\"name\":\"KOMISI_A\",\"dbName\":\"komisi_a\"},{\"name\":\"KOMISI_B\",\"dbName\":\"komisi_b\"},{\"name\":\"KOMISI_C\",\"dbName\":\"komisi_c\"},{\"name\":\"KOMISI_D\",\"dbName\":\"komisi_d\"},{\"name\":\"BPH_OSIS\",\"dbName\":\"bph_osis\"},{\"name\":\"BPH_MPK\",\"dbName\":\"bph_mpk\"},{\"name\":\"KESISWAAN\",\"dbName\":\"kesiswaan\"},{\"name\":\"PEMBINA\",\"dbName\":\"pembina\"},{\"name\":\"KEPALA_SEKOLAH\",\"dbName\":\"kepala_sekolah\"},{\"name\":\"GENERAL\",\"dbName\":\"general\"}],\"dbName\":\"organization_divisions\"},\"OrganizationType\":{\"values\":[{\"name\":\"SHARED\",\"dbName\":\"shared\"},{\"name\":\"OSIS\",\"dbName\":\"osis\"},{\"name\":\"MPK\",\"dbName\":\"mpk\"},{\"name\":\"DEWAN_PEMBINA\",\"dbName\":\"dewan_pembina\"}],\"dbName\":\"organization_types\"},\"Gender\":{\"values\":[{\"name\":\"MALE\",\"dbName\":\"male\"},{\"name\":\"FEMALE\",\"dbName\":\"female\"}],\"dbName\":\"user_genders\"},\"AspirationStatus\":{\"values\":[{\"name\":\"PENDING\",\"dbName\":\"pending\"},{\"name\":\"IN_REVIEW\",\"dbName\":\"in_review\"},{\"name\":\"APPROVED\",\"dbName\":\"approved\"},{\"name\":\"REJECTED\",\"dbName\":\"rejected\"},{\"name\":\"RESOLVED\",\"dbName\":\"resolved\"}],\"dbName\":\"aspiration_statuses\"},\"ProkerStatus\":{\"values\":[{\"name\":\"PLANNED\",\"dbName\":\"planned\"},{\"name\":\"ONGOING\",\"dbName\":\"ongoing\"},{\"name\":\"COMPLETED\",\"dbName\":\"completed\"},{\"name\":\"EVALUATED\",\"dbName\":\"evaluated\"},{\"name\":\"CANCELLED\",\"dbName\":\"cancelled\"}],\"dbName\":\"proker_statuses\"},\"PostStatus\":{\"values\":[{\"name\":\"DRAFT\",\"dbName\":\"draft\"},{\"name\":\"PUBLISHED\",\"dbName\":\"published\"},{\"name\":\"ARCHIVED\",\"dbName\":\"archived\"}],\"dbName\":\"post_statuses\"},\"AttendanceType\":{\"values\":[{\"name\":\"MEETING\",\"dbName\":\"meeting\"},{\"name\":\"EVENT\",\"dbName\":\"event\"},{\"name\":\"DUTY_PIKET\",\"dbName\":\"duty_piket\"},{\"name\":\"GENERAL_ASSEMBLY\",\"dbName\":\"general_assembly\"}],\"dbName\":\"attendance_types\"},\"AttendanceStatus\":{\"values\":[{\"name\":\"PRESENT\",\"dbName\":\"present\"},{\"name\":\"LATE\",\"dbName\":\"late\"},{\"name\":\"PERMISSION\",\"dbName\":\"permission\"},{\"name\":\"SICK\",\"dbName\":\"sick\"},{\"name\":\"ABSENT\",\"dbName\":\"absent\"}],\"dbName\":\"attendance_statuses\"},\"TaskPriority\":{\"values\":[{\"name\":\"LOW\",\"dbName\":\"low\"},{\"name\":\"MEDIUM\",\"dbName\":\"medium\"},{\"name\":\"HIGH\",\"dbName\":\"high\"},{\"name\":\"URGENT\",\"dbName\":\"urgent\"}],\"dbName\":\"task_priorities\"},\"TaskStatus\":{\"values\":[{\"name\":\"TODO\",\"dbName\":\"todo\"},{\"name\":\"IN_PROGRESS\",\"dbName\":\"in_progress\"},{\"name\":\"SUBMITTED\",\"dbName\":\"submitted\"},{\"name\":\"COMPLETED\",\"dbName\":\"completed\"}],\"dbName\":\"task_statuses\"},\"AuditAction\":{\"values\":[{\"name\":\"CREATE\",\"dbName\":\"create\"},{\"name\":\"UPDATE\",\"dbName\":\"update\"},{\"name\":\"DELETE\",\"dbName\":\"delete\"},{\"name\":\"LOGIN\",\"dbName\":\"login\"},{\"name\":\"APPROVE\",\"dbName\":\"approve\"},{\"name\":\"REJECT\",\"dbName\":\"reject\"},{\"name\":\"VERIFY\",\"dbName\":\"verify\"}],\"dbName\":\"audit_actions\"}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

