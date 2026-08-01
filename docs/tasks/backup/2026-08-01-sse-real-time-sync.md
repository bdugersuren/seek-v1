# Active Task

Status: `COMPLETED`

## Next Task: Real-time Sync & WebSocket Integration

Энэхүү даалгавар нь шалгалт эхлэх үед хэрэгдэх `unlock key`-ийг серверээс WebSocket/SSE сувгаар хөтөч рүү автоматаар түлхэж (push) ирүүлдэг бодит холболтыг хэрэгжүүлэхэд чиглэнэ.

### Хийгдэх ажлын дараалал:
- `[ ]` `services/execution` үйлчилгээн дээр WebSocket Gateway эсвэл SSE (Server-Sent Events) endpoint үүсгэх.
- `[ ]` RabbitMQ-ийн `assessment.events` exchange-ээс ирэх шалгалт эхлэх дохиог хүлээж аваад, тухайн сурагчийн холболт руу `unlockKey`-ийг дамжуулах.
- `[ ]` `apps/assessment-web` дээр бодит WebSocket холболтыг нээж, `unlockReceived` төлөвийг автоматаар хүлээн авч өөрчилдөг болгох.
- `[ ]` Хүлээлгийн өрөөнд (waiting room) "Mock unlock event" товчлуурыг ашиглахгүйгээр, бодит урсгалаар шалгалт эхлэхийг туршиж баталгаажуулах.
