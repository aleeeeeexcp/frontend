export interface GroupDto {
  id?: string;
  name: string;
  description: string;
  ownerId?: string;
  memberIds?: string[];
  createdAt?: string;
}
