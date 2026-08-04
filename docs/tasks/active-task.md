# Active Task: KMS, Request Signature, and Token Binding Integration

Status: `IN_PROGRESS`

## Goal
Шалгалтын үйл явцын аюулгүй байдлыг хангах, replay attack, төхөөрөмж хуурамчаар солих (device spoofing), шалгалтын асуултын payload-ийг замаас нь уншихаас сэргийлэх криптограф хамгаалалт хэрэгжүүлэх.

---

## Todo List

### Phase 1: Request Signature Verification & Replay Protection
- [ ] `services/execution` дотор `signature.guard.ts` үүсгэх
- [ ] Олон дахин ашиглагдахаас сэргийлж Redis-д суурилсан nonce шалгах логик нэмэх
- [ ] SHA256 HMAC гарын үсгийг баталгаажуулах логик бэлдэх
- [ ] `execution.controller.ts` дахь чухал endpoints дээр `SignatureGuard` ашиглах

### Phase 2: Local KMS Integration & Secure Key Delivery
- [ ] `services/execution` дотор `crypto-kms.service.ts` үүсгэх
- [ ] KMS provider загварын дагуу payload decryption хийх хамгаалалттай түлхүүр бэлтгэх
- [ ] `execution.service.ts` доторх `startAttempt` ажиллахад unlock key-ийг SSE/RabbitMQ ашиглан асинхроноор илгээх

### Phase 3: Token Binding & Device Fingerprint Validation
- [ ] Оролдлогын (attempt) өгөгдөл дотор `deviceFingerprintHash`-ийг хадгалах
- [ ] Хүсэлт бүр дээр browser-оос ирэх fingerprint-ийг тулган шалгаж зөрвөл татгалзах

### Phase 4: Verification & Tests
- [ ] Signature guard болон баталгаажуулалтад зориулсан unit тест бичих
- [ ] Үйлчилгээний typecheck болон unit тестүүдийг ажиллуулж баталгаажуулах
