"use client";

import { Button, Card, PageContainer, Text, useToast } from "@seek/ui";

const walletTransactions = [
  {
    id: "txn-1",
    title: "Wallet цэнэглэлт",
    amount: "+50,000₮",
    date: "2024.05.23",
    status: "Амжилттай",
  },
  {
    id: "txn-2",
    title: "Кибер аюулгүй байдлын үндэс",
    amount: "-25,000₮",
    date: "2024.05.24",
    status: "Худалдан авалт",
  },
  {
    id: "txn-3",
    title: "Харилцааны ур чадвар",
    amount: "-25,000₮",
    date: "2024.05.24",
    status: "Худалдан авалт",
  },
];

export default function WalletPage() {
  const { showToast } = useToast();

  return (
    <PageContainer className="max-w-none bg-muted-background">
      <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="space-y-seek-5">
          <div>
            <h1 className="font-sans text-3xl font-bold text-foreground">
              Хэтэвч
            </h1>
            <Text variant="muted" className="mt-seek-2">
              Үлдэгдэл, цэнэглэлт болон үнэлгээ худалдан авалтын хөдөлгөөн.
            </Text>
          </div>

          <div className="grid grid-cols-1 gap-seek-4 md:grid-cols-3">
            <Card>
              <Text variant="muted" className="text-sm">
                Одоогийн үлдэгдэл
              </Text>
              <p className="mt-seek-2 font-sans text-3xl font-bold text-primary">
                15,000₮
              </p>
            </Card>
            <Card>
              <Text variant="muted" className="text-sm">
                Энэ сарын зарцуулалт
              </Text>
              <p className="mt-seek-2 font-sans text-3xl font-bold text-foreground">
                50,000₮
              </p>
            </Card>
            <Card>
              <Text variant="muted" className="text-sm">
                Bonus credit
              </Text>
              <p className="mt-seek-2 font-sans text-3xl font-bold text-success">
                0₮
              </p>
            </Card>
          </div>

          <Card>
            <h2 className="font-sans text-xl font-bold text-foreground">
              Хэтэвчийн хөдөлгөөн
            </h2>
            <div className="mt-seek-4 space-y-seek-3">
              {walletTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-seek-2 rounded-seek-md border border-border p-seek-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-sans text-sm font-bold text-foreground">
                      {transaction.title}
                    </p>
                    <Text variant="muted" className="text-xs">
                      {transaction.date} · {transaction.status}
                    </Text>
                  </div>
                  <p
                    className={`font-sans text-lg font-bold ${
                      transaction.amount.startsWith("+")
                        ? "text-success"
                        : "text-foreground"
                    }`}
                  >
                    {transaction.amount}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <aside className="space-y-seek-4">
          <Card>
            <h2 className="font-sans text-xl font-bold text-foreground">
              Хэтэвч цэнэглэх
            </h2>
            <Text variant="muted" className="mt-seek-2 text-sm">
              Төлбөртэй үнэлгээ авахдаа wallet balance ашиглаж болно.
            </Text>
            <div className="mt-seek-4 grid grid-cols-2 gap-seek-2">
              {["10,000₮", "20,000₮", "50,000₮", "100,000₮"].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className="rounded-seek-md border border-border px-seek-3 py-seek-2 text-sm font-semibold hover:bg-surface-hover"
                >
                  {amount}
                </button>
              ))}
            </div>
            <Button
              type="button"
              className="mt-seek-4 w-full"
              onClick={() =>
                showToast("Wallet top-up demo хүсэлт илгээгдлээ.", "success")
              }
            >
              Цэнэглэх
            </Button>
          </Card>
          <Card>
            <h2 className="font-sans text-lg font-bold text-foreground">
              Wallet хэрэгтэй юу?
            </h2>
            <Text variant="muted" className="mt-seek-2 text-sm leading-6">
              Олон төлбөртэй үнэлгээ авдаг candidate, байгууллагаас credit
              олгодог flow, refund/bonus хэрэгтэй бол wallet тусдаа байх нь зөв.
              Харин MVP дээр зөвхөн card/payment gateway бол `/payments`
              дангаараа хангалттай.
            </Text>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}
