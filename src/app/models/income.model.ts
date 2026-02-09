export interface IncomeDto {
  id: string;
  source: string;
  amount: number;
  description: string;
  date: string;
  userId?: string;
}