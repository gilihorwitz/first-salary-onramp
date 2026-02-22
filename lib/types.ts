export type BenefitElection = {
  name: string;
  type: "health" | "dental" | "vision" | "401k" | "hsa" | "fsa" | "life" | "disability";
  employeeContribution: number;
  employerContribution: number;
  description: string;
  isOptimized?: boolean;
};

export type PersonalFinancialData = {
  employeeId: string;
  grossSalary: number;
  federalTax: number;
  stateTax: number;
  ficaTax: number;
  healthPremium: number;
  retirement401k: number;
  netPay: number;
  benefitElections: BenefitElection[];
  plaidAccessToken: string;
};

export type CompanyInsights = {
  cohort: string;
  avgBenefitOptimizationScore: number;
  pct401kMatchCaptured: number;
  avgNetPayConfidenceScore: number;
  cardActivationRate: number;
};
