import { Badge, Button, Card, PageContainer, Text } from "@seek/ui";
import { candidateCertificates } from "@/features/candidate-portal/mock-data";

export default function CertificatesPage() {
  return (
    <PageContainer className="max-w-none bg-muted-background">
      <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold text-foreground">
            Сертификатууд
          </h1>
          <Text variant="muted" className="mt-seek-2">
            Таны авсан сертификатууд болон авах боломжтой үнэлгээнүүд.
          </Text>
        </div>
        <Button type="button" variant="outline">
          Сертификат шалгах
        </Button>
      </div>

      <div className="mt-seek-5 grid grid-cols-1 gap-seek-4 md:grid-cols-2 xl:grid-cols-3">
        {candidateCertificates.map((certificate) => (
          <Card key={certificate.id}>
            <div className="grid aspect-[1.7] place-items-center rounded-seek-md border border-warning/30 bg-amber-50 text-center">
              <div>
                <p className="font-serif text-xl font-bold text-slate-900">
                  СЕРТИФИКАТ
                </p>
                <p className="mt-seek-3 font-sans text-3xl font-bold text-primary">
                  {certificate.score}
                </p>
              </div>
            </div>
            <h2 className="mt-seek-4 font-sans text-lg font-bold text-foreground">
              {certificate.title}
            </h2>
            <div className="mt-seek-3 flex items-center justify-between">
              <Badge variant={certificate.paid ? "warning" : "success"}>
                {certificate.paid ? "Төлбөртэй" : "Төлбөргүй"}
              </Badge>
              <Text variant="muted" className="text-sm">
                Огноо: {certificate.issuedAt}
              </Text>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
