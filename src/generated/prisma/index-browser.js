
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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

exports.Prisma.StudentViolationScalarFieldEnum = {
  id: 'id',
  studentName: 'studentName',
  studentClass: 'studentClass',
  violationType: 'violationType',
  context: 'context',
  notes: 'notes',
  severity: 'severity',
  date: 'date',
  pointDeduction: 'pointDeduction',
  recordedById: 'recordedById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
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

exports.ViolationSeverity = exports.$Enums.ViolationSeverity = {
  RINGAN: 'RINGAN',
  SEDANG: 'SEDANG',
  BERAT: 'BERAT'
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
  AuditLog: 'AuditLog',
  StudentViolation: 'StudentViolation'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
