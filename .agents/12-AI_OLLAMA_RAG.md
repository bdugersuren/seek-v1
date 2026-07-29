# AI, Ollama, and RAG / AI, Ollama, RAG

## Boundary

All AI calls go through `ai`. Initial provider is Ollama.

## Capabilities

- result explanation;
- learning recommendation wording;
- question and rubric drafts;
- report summary;
- AI tutor;
- competency coach;
- semantic search;
- document metadata extraction.

## Prompt Governance

Every prompt has promptId, version, purpose, inputSchema, outputSchema, modelProfile, safetyPolicy, owner, and status.

Published prompt versions are immutable.

## RAG

```text
Source -> Parse -> Classify -> Chunk -> Embed -> Index -> Retrieve -> Cite -> Generate -> Validate
```

Choose Qdrant or pgvector through ADR.

## Critical Rule

AI is not allowed in autosave, entitlement, final submission acceptance, JWT verification, or payment confirmation.
