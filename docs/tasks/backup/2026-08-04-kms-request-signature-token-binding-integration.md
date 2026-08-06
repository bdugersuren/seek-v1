# Active Task: KMS, Request Signature, and Token Binding Integration

Status: `COMPLETED` (Archived on 2026-08-04)

## Goal
Шалгалтын үйл явцын аюулгүй байдлыг хангах, replay attack, төхөөрөмж хуурамчаар солих (device spoofing), шалгалтын асуултын payload-ийг замаас нь уншихаас сэргийлэх криптограф хамгаалалт хэрэгжүүлэх.

---

## Todo List

### Phase 1: Request Signature Verification & Replay Protection
- [x] `services/execution` дотор `signature.guard.ts` үүсгэх
- [x] Олон дахин ашиглагдахаас сэргийлж Redis-д суурилсан nonce шалгах логик нэмэх
- [x] SHA256 HMAC гарын үсгийг баталгаажуулах логик бэлдэх
- [x] `execution.controller.ts` дахь чухал endpoints дээр `SignatureGuard` ашиглах

### Phase 2: Local KMS Integration & Secure Key Delivery
- [x] `services/execution` дотор `crypto-kms.service.ts` үүсгэх
- [x] KMS provider загварын дагуу payload decryption хийх хамгаалалттай түлхүүр бэлтгэх
- [x] `execution.service.ts` доторх `startAttempt` ажиллахад unlock key-ийг Redis-т хадгалж, SSE ашиглан асинхроноор илгээх

### Phase 3: Token Binding & Device Fingerprint Validation
- [x] Оролдлогын (attempt) өгөгдөл дотор `deviceFingerprintHash`-ийг хадгалах
- [x] Хүсэлт бүр дээр browser-оос ирэх fingerprint-ийг тулган шалгаж зөрвөл татгалзах

### Phase 4: Verification & Tests
- [x] Signature guard болон баталгаажуулалтад зориулсан unit тест бичих
- [x] Үйлчилгээний typecheck болон unit тестүүдийг ажиллуулж баталгаажуулах
