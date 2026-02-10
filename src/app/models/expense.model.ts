export interface ExpenseDto {
  id: string;
  description: string;
  amount: number;
  date: string;
  categoryId?: string;
  userId?: string;
  groupId?: string;
}
