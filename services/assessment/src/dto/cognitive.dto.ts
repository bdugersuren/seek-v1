export interface CognitiveFrameworkInput {
  name?: string; code?: string; description?: string | null;
  frameworkVersion?: string | null; isActive?: boolean;
}
export interface CognitiveLevelInput {
  cognitiveFrameworkId?: string; name?: string; code?: string;
  parentId?: string | null; rank?: number; description?: string | null;
  icon?: string | null; reportBucket?: string | null; isActive?: boolean;
}
