export interface AudienceTypeInput {
  name?: string;
  code?: string;
  description?: string | null;
  isActive?: boolean;
}
export interface AudienceLevelInput {
  audienceTypeId?: string;
  name?: string;
  code?: string;
  parentId?: string | null;
  orderIndex?: number;
  rank?: number;
  levelKind?: string | null;
  externalCode?: string | null;
  isActive?: boolean;
}
