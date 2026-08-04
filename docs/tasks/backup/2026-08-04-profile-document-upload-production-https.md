# Active Task: Profile Document Upload Production HTTPS

Status: `COMPLETED` (Archived on 2026-08-04)

## Goal

Profile document upload-ийг production HTTPS орчинд ажиллуулах. Portal browser нь MinIO рүү шууд `PUT` хийхгүй; бүх upload хүсэлт `quiz-api.seek.mn` gateway-ээр дамжин file-service дээр multipart хэлбэрээр боловсруулагдана.

## Current Finding

Browser дээр upload хийхэд хоёр дараалсан асуудал илэрсэн:

1. `https://files.seek.mn/...` presigned direct upload URL browser дээр resolve болохгүй байсан:
   - Error: `net::ERR_NAME_NOT_RESOLVED`
   - Шалтгаан: `files.seek.mn` host/NPM proxy бүрэн тохироогүй.
2. Direct MinIO upload-ийг болиулж gateway multipart upload болгосны дараа smoke test дээр:
   - Error: `Multipart: Unexpected end of form`
   - Шалтгаан: gateway `express-http-proxy` file upload body-г parse хийх гэж оролдоод multipart stream тасалж байсан.

## Target Architecture

| Domain | Required | Target | Purpose |
|---|---:|---|---|
| `portal.seek.mn` | Yes | `portal-web:8081` | User-facing portal |
| `quiz-api.seek.mn` | Yes | `gateway:3010` | Auth/profile/file API gateway |
| `file-api.seek.mn` | No | N/A | Not needed while gateway owns file API |
| `files.seek.mn` | Optional | `minio:9000` | Future direct presigned GET/PUT or object access |
| `minio-console.seek.mn` | Optional | `minio:9001` | MinIO admin web console |

## Upload Flow

1. Portal submits multipart form data:
   - `POST https://quiz-api.seek.mn/api/v1/file/upload`
   - fields: `file`, `type`
2. Gateway validates authentication, injects `x-user-id`, and proxies raw request stream:
   - `POST http://file:3140/file/upload`
3. File service validates:
   - user id exists from gateway header
   - file exists and is not empty
   - MIME type is `application/pdf`
   - max size is 10 MB
4. File service writes object to private MinIO bucket:
   - `documents/{userId}/{timestamp}-{suffix}-{safeFilename}`
5. Portal registers metadata:
   - `POST https://quiz-api.seek.mn/api/v1/profile/me/documents`
6. Profile service verifies object ownership/existence through file service internal API.

## Implementation Plan

1. `DONE` Remove direct browser dependency on `files.seek.mn`
   - Portal no longer uploads directly to presigned MinIO URL.
   - `files.seek.mn` is no longer required for the profile upload path.
   - `file-api.seek.mn` remains unnecessary.

2. `DONE` Add file-service multipart upload endpoint
   - Added `POST /file/upload`.
   - Uses `FileInterceptor("file")`.
   - Enforces 10 MB limit.
   - Uploads PDF to MinIO with user-scoped key.
   - Returns `storageKey`, `mimeType`, `sizeBytes`.

3. `DONE` Update portal upload flow
   - Added `uploadDocumentFile`.
   - Sends `FormData` to `/v1/file/upload`.
   - Avoids setting JSON `Content-Type` for `FormData`.
   - Registers profile document metadata only after object upload succeeds.

4. `DONE` Fix gateway multipart proxy
   - Added `parseReqBody: false` to `/api/v1/file` proxy.
   - This keeps multipart body as a raw stream and prevents `Unexpected end of form`.
   - Added gateway regression test so this setting is not removed accidentally.

5. `DONE` Local validation
   - `pnpm --filter @seek/file typecheck`
   - `pnpm --filter @seek/file test -- --runInBand`
   - `pnpm --filter @seek/gateway typecheck`
   - `pnpm --filter @seek/gateway test -- --runInBand`
   - `pnpm --filter @seek/portal-web typecheck`
   - `pnpm --filter @seek/portal-web build`

6. `DONE` Deploy updated gateway to production compose
   - Required command:
     - `docker compose -f docker-compose.yml -f docker-compose.prod.yml --profile auth-test --profile assessment --profile frontend up -d --build gateway`
   - Gateway container was rebuilt and restarted with the multipart proxy fix.

7. `DONE` Production smoke test after gateway deploy
   - Login via `https://quiz-api.seek.mn/api/v1/auth/login`.
   - Upload test PDF via:
     - `POST https://quiz-api.seek.mn/api/v1/file/upload`
   - Confirm response includes `storageKey`, `mimeType`, `sizeBytes`.
   - Confirm upload returns `201` through `quiz-api.seek.mn`.
   - Register metadata via:
     - `POST https://quiz-api.seek.mn/api/v1/profile/me/documents`
   - CLI metadata smoke returned `404 Профайл олдсонгүй` for seed smoke user, so it must be verified with a real portal user that has an existing profile.
   - Confirm document appears in `https://portal.seek.mn/profile`.
   - Confirm browser console has no `files.seek.mn`, Mixed Content, CORS, or multipart errors.

8. `DONE` Frontend final UX hardening
   - Add explicit PDF-only validation before submit.
   - Add max-size message matching backend 10 MB limit.
   - Show clear messages for:
     - unauthenticated state
     - file too large
     - non-PDF file
     - object upload failure
     - metadata registration failure

9. `DONE` Optional MinIO domains
   - `files.seek.mn` is optional for the current upload path.
   - Use it later only if direct presigned download/upload is intentionally reintroduced.
   - `minio-console.seek.mn` can map to `minio:9001` for admin UI only.
   - Application code should not depend on `minio-console.seek.mn`.
