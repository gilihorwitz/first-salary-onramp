import { PersonalFinancialData } from "./types";

export const COMPANY_NAME = "Meridian Technologies";
export const COMPANY_LOGO = "/meridian-logo.svg";
export const EMPLOYEE_NAME = "Jordan Rivera";
export const EMPLOYEE_ROLE = "Software Engineer I";
export const COHORT = "Engineering-2025";

export const mockEmployee: PersonalFinancialData = {
  employeeId: "emp-demo-001",
  grossSalary: 85000,
  federalTax: 10710,
  stateTax: 4505,
  ficaTax: 6502,
  healthPremium: 2400,
  retirement401k: 1700, // 2% — under the 6% employer match cap
  netPay: 59183,
  benefitElections: [
    {
      name: "Medical — PPO Gold",
      type: "health",
      employeeContribution: 200,
      employerContribution: 450,
      description: "Comprehensive medical plan with $500 deductible",
    },
    {
      name: "Dental — Basic",
      type: "dental",
      employeeContribution: 25,
      employerContribution: 25,
      description: "Preventive care and basic dental coverage",
    },
    {
      name: "Vision — Standard",
      type: "vision",
      employeeContribution: 10,
      employerContribution: 10,
      description: "Annual eye exam and lens allowance",
    },
    {
      name: "401(k) Retirement",
      type: "401k",
      employeeContribution: 1700, // annual, 2% of gross
      employerContribution: 1700, // match up to 6%
      description: "Company matches 100% up to 6% of salary. You're contributing 2%.",
    },
    {
      name: "HSA — Health Savings",
      type: "hsa",
      employeeContribution: 0,
      employerContribution: 500,
      description: "Tax-advantaged health savings. Employer seeds $500/yr.",
    },
    {
      name: "Life Insurance — 1x Salary",
      type: "life",
      employeeContribution: 0,
      employerContribution: 85,
      description: "Basic life insurance equal to annual salary, employer-paid",
    },
  ],
  plaidAccessToken: "access-sandbox-demo-000",
};

/** Monthly net pay for card budget calculation */
export const monthlyNetPay = Math.round(mockEmployee.netPay / 12);

/** "Free spend" = monthly net minus estimated essentials (rent, food, transport) */
export const freeSpendBudget = Math.round(monthlyNetPay * 0.3);
