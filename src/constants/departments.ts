export enum Department {
  AE = 'AE',
  AG = 'AG',
  AR = 'AR',
  BT = 'BT',
  CE = 'CE',
  CH = 'CH',
  CS = 'CS',
  CY = 'CY',
  EE = 'EE',
  EC = 'EC',
  EX = 'EX',
  GG = 'GG',
  HS = 'HS',
  IM = 'IM',
  MA = 'MA',
  ME = 'ME',
  MI = 'MI',
  MT = 'MT',
  NA = 'NA',
  PH = 'PH'
}

export const departmentFullNames: Record<Department, string> = {
  [Department.AE]: 'Aerospace Engineering',
  [Department.AG]: 'Agricultural Engineering',
  [Department.AR]: 'Architecture',
  [Department.BT]: 'Biotechnology',
  [Department.CE]: 'Civil Engineering',
  [Department.CH]: 'Chemical Engineering',
  [Department.CS]: 'Computer Science and Engineering',
  [Department.CY]: 'Chemistry',
  [Department.EE]: 'Electrical Engineering',
  [Department.EC]: 'Electronics and Communication Engineering',
  [Department.EX]: 'Electronics and Instrumentation Engineering',
  [Department.GG]: 'Geology and Geophysics',
  [Department.HS]: 'Humanities and Social Sciences',
  [Department.IM]: 'Industrial and Management Engineering',
  [Department.MA]: 'Mathematics',
  [Department.ME]: 'Mechanical Engineering',
  [Department.MI]: 'Mining Engineering',
  [Department.MT]: 'Metallurgical Engineering',
  [Department.NA]: 'Naval Architecture',
  [Department.PH]: 'Physics'
};

export const getDepartmentCode = (fullName: string): Department | null => {
  const entry = Object.entries(departmentFullNames).find(([_, name]) => name === fullName);
  return entry ? (entry[0] as Department) : null;
};

export const getDepartmentName = (code: Department): string => {
  return departmentFullNames[code];
};