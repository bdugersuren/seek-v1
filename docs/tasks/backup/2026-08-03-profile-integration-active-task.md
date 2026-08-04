# Active Task

Status: `READY`

## Goal

Profile үйлчилгээг гадны үйлчилгээнүүдтэй холбон бодит баталгаажуулалт (SMS OTP), файл хадгалах сан (MinIO Presigned URL), болон иргэний баталгаажуулалт (KYC) интеграциудыг бүрэн хийж гүйцэтгэх.

## Scope

- SMS/OTP provider холболт хийж утасны дугаар баталгаажуулах API болон вэб UI нэмэх.
- File үйлчилгээ болон MinIO ашиглан бичиг баримт оруулах presigned URL холболтыг бүрэн хийж, UI-тай холбох.
- Иргэний үнэмлэх (IDENTITY)-ийг автоматаар шалгах KYC холболтын загварыг бэлтгэж нэгтгэх.
- Шинэ интеграцийн хувилбарт зориулсан тест болон баримтжуулалтыг шинэчлэх.

## Non-Goals

- SMS/OTP дээр бодит мөнгө төлөх үйлчилгээ ажиллуулахгүй, зөвхөн provider-ийн API-г холбон sandbox/mock байдлаар ажиллуулна.
- KYC дээр Улсын Бүртгэлийн бодит нууцлалтай тусгай сүлжээний холболт хийхгүй, харин API Gateway болон mock KYC adapter ашиглан протокол холбоно.

## Implementation Plan

1. `TODO` SMS / OTP Integration (Phone Verification)
   - Integration үйлчилгээн дотор OTP provider адаптер үүсгэх.
   - Profile үйлчилгээнд OTP илгээх, баталгаажуулах API үүсгэх.
   - Portal-web UI дээр OTP оруулах хэсэг нэмж холбох.

2. `TODO` MinIO Presigned URL Storage Integration
   - File үйлчилгээнээс upload presigned URL авах логик холбох.
   - Portal-web дээр файлыг бодит MinIO руу presigned URL-аар хуулдаг болгох.
   - Амжилттай болсон файлын метадатаг Profile үйлчилгээнд бүртгэх.

3. `TODO` External KYC Autoverification Adapter
   - Mock KYC adapter үүсгэж, IDENTITY хүсэлтийг автоматаар тулган баталгаажуулах логик бичих.
   - Улсын бүртгэлийн одоогийн identity шалгалтыг дуурайлган ажиллах загвар хийх.

4. `TODO` Integration Tests and Verification
   - Бүх холбогдсон үйлчилгээнүүдийн интеграцийн тест бичих.
   - docs/profile-service.md баримтыг шинэ интеграцийн бүтэцтэй уялдуулан шинэчлэх.

## Validation Commands

- `pnpm --filter @seek/profile typecheck`
- `pnpm --filter @seek/profile test -- --runInBand`
- `pnpm --filter @seek/portal-web typecheck`
- `pnpm --filter @seek/portal-web build`

## Done Criteria

- Утасны дугаар SMS OTP-оор бодитоор баталгааждаг болсон.
- Файлууд MinIO руу presigned URL-аар аюулгүй хуулагдаж, метадата хадгалагддаг болсон.
- KYC autoverification ажиллаж, IDENTITY хүсэлтийг автоматаар шийддэг болсон.
- Интеграцийн бүх тестүүд амжилттай ажиллаж байгаа.
