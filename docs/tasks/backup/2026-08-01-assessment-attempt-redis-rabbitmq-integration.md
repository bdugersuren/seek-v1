# Active Task: Assessment Attempt Redis & RabbitMQ Integration

Status: `IN_PROGRESS`

Энэхүү task-ийн зорилго нь `services/execution` дээр бэлдсэн in-memory бүтцийг бодит Redis болон RabbitMQ-тэй холбох, мөн frontend `assessment-web` аппликейшны runtime adapter-ийг бодит HTTP API холболт руу шилжүүлэхэд оршино.

---

## Gate A: Redis State Store Integration

- [ ] `services/execution` үйлчилгээнд `ioredis` хамаарал нэмж, холболт үүсгэх.
- [ ] `RedisAttemptStateStore` классыг `AttemptStateStore` интерфейсийн дагуу хэрэгжүүлэх.
- [ ] Redis key-үүдийг TTL (time-to-live) хамт зөв хадгалах логик бичих.
- [ ] InMemoryStateStore-оос RedisStateStore руу bind-ийг шилжүүлэх.

## Gate B: RabbitMQ Event Publisher Integration

- [ ] `services/execution` үйлчилгээнд RabbitMQ холболт (`amqplib` эсвэл NestJS microservices) нэмэх.
- [ ] `RabbitMQAttemptEventPublisher` классыг `AttemptEventPublisher` интерфейсийн дагуу хэрэгжүүлэх.
- [ ] Autosave, submit, violation, scoring request event-үүдийг RabbitMQ exchange/queue руу publish хийдэг болгох.

## Gate C: Frontend HTTP Runtime Adapter

- [ ] `apps/assessment-web` дээр бодит HTTP (fetch/axios) холболт ашигласан `HttpRuntimeAdapter` бичих.
- [ ] `NEXT_PUBLIC_MOCK_MODE=false` үед бодит HTTP adapter-ийг ашигладаг болгон уялдуулах.

## Gate D: Integration & Dev Validation

- [ ] Docker Compose ашиглан redis, rabbitmq, gateway, execution, assessment-web үйлчилгээнүүдийг хамтад нь ажиллуулах.
- [ ] Интеграцийн туршилт ажиллуулж, өгөгдөл Redis-т бичигдэж, event-үүд RabbitMQ-р дамжиж байгааг баталгаажуулах.
- [ ] `pnpm typecheck` болон `pnpm lint` амжилттай болохыг шалгах.
