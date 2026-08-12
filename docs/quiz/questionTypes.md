
## 1. Үнэн / Худал (TRUE_FALSE)

```json
{
  "id": "q_101",
  "type": "TRUE_FALSE",
  "title": "Дэлхий нарыг тойрдог уу?",
  "body": "Агуулга",
  "correctAnswer": true
}
```



## 2. Нэг сонголттой (SINGLE_CHOICE / MULTIPLE_CHOICE)

```json
{
  "id": "q_102",
  "type": "SINGLE_CHOICE",
  "title": "Монгол улсын нийслэл юу вэ?",
  "options": [
    { "id": "opt_1", "content": "Улаанбаатар" },
    { "id": "opt_2", "content": "Дархан" },
    { "id": "opt_3", "content": "Эрдэнэт" }
  ],
  "correctAnswer": "opt_1" // Олон сонголттой бол ["opt_1", "opt_3"]
}
```




## 3. Матриц Асуулт (Matrix / Grid)

```json
{
  "id": "q_103",
  "type": "MATCHING",
  "title": "Улсуудыг нийслэлтэй нь харгалзуулна уу.",
  "leftItems": [
    { "id": "L1", "text": "Монгол" },
    { "id": "L2", "text": "Японо" }
  ],
  "rightItems": [
    { "id": "R1", "text": "Токио" },
    { "id": "R2", "text": "Улаанбаатар" },
    { "id": "R3", "text": "Инчон" }
  ],
  "correctAnswer": [
    { "leftId": "L1", "rightId": "R2" },
    { "leftId": "L2", "rightId": "R1" },
    
  ]
}
```


## 4. Нэг сонголттой (SINGLE_CHOICE / MULTIPLE_CHOICE)

```json
{
  "id": "q_104",
  "type": "ORDERING",
  "title": "Дараах үйл явдлуудыг он дарааллаар нь эрэмбэлнэ үү.",
  "items": [
    { "id": "ord_1", "text": "Их Монгол Улс байгуулагдсан" },
    { "id": "ord_2", "text": "Үндсэн хууль батлагдсан" }
  ],
  "correctOrder": ["ord_1", "ord_2"]
}
```


Нөхөх Асуулт (Fill-in-the-Blank) — Олон нөхөлтэй, Нөхөлт бүр өөр
