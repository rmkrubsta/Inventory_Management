export const roleUsers = [
  { name: 'Riya Kumar', email: 'riya.kumar@acmepartners.com', role: 'Admin' },
  { name: 'Lerato Ndlovu', email: 'lerato.ndlovu@acmepartners.com', role: 'Employee' },
  { name: 'Naledi Pillay', email: 'naledi.pillay@acmepartners.com', role: 'Manager' }
];

export const roleViews = {
  Admin: ['Overview', 'Assets', 'Audits', 'Maintenance', 'People & teams'],
  Employee: ['Assets', 'Maintenance'],
  Manager: ['Assets', 'People & teams']
};

export const rolePermissions = {
  Admin: { manageAssets: true, managePeople: true, scheduleAudits: true, manageMaintenance: true, requestAssets: true, approveRequests: true },
  Employee: { requestAssets: true, reportIssues: true },
  Manager: { requestAssets: true, approveRequests: true }
};

export const hasPermission = (role, permission) => Boolean(rolePermissions[role]?.[permission]);

export const defaultRoleView = (role) => ['Employee', 'Manager'].includes(role) ? 'Assets' : 'Overview';

export const profilePhotoKey = (email) => `assetflow.profilePhoto.${email}`;