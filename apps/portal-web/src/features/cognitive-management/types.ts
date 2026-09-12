export interface CognitiveFramework { id: string; code: string; name: string; description: string | null; frameworkVersion: string | null; isActive: boolean; levelCount: number; }
export interface CognitiveLevel { id: string; cognitiveFrameworkId: string; parentId: string | null; code: string; name: string; rank: number; description: string | null; icon: string | null; reportBucket: string | null; isActive: boolean; }
export type CognitiveFrameworkInput = Omit<CognitiveFramework, "id" | "levelCount">;
export type CognitiveLevelInput = Omit<CognitiveLevel, "id">;
