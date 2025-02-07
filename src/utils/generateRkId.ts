import { prisma } from '../lib/prisma';
import { Department } from '../constants/departments';

const rollNumberPattern = /^2\d[A-Z]{2}\d[\dA-Z]{2}\d{2}$/;

export async function generateRkId(rollNumber: string): Promise<string> {
  const { batchYear, department } = parseRollNumber(rollNumber);
  const rkPrefix = `${batchYear.slice(-2)}RK`;

  // Find the latest user with the same department and batch
  const latestUser = await prisma.user.findFirst({
    where: {
      department,
      rkId: {
        startsWith: `${rkPrefix}${department}`
      }
    },
    orderBy: {
      rkId: 'desc'
    }
  });

  let serialNumber = 1;

  if (latestUser) {
    const currentSerial = parseInt(latestUser.rkId.slice(-2));
    serialNumber = currentSerial + 1;
  }

  const formattedSerial = serialNumber.toString().padStart(2, '0');
  return `${rkPrefix}${department}${formattedSerial}`;
}

export function parseRollNumber(rollNumber: string) {
  const matches = rollNumber.match(rollNumberPattern);
  if (!matches) throw new Error('Invalid roll number format');

  return {
    batchYear: `2${rollNumber[1]}`,
    department: rollNumber.slice(2, 4) as Department,
    serialNumber: parseInt(rollNumber.slice(-2))
  };
}