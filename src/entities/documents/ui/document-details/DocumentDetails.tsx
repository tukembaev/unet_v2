import PageHeader from "widgets/page-header/page-header";
import DocumentApprovalFlow, { ApprovalParticipant } from "./approval-chain/DocumentApprovalFlow";

// Моковые данные участников подписания документа
const mockParticipants: ApprovalParticipant[] = [
  {
    id: "1",
    name: "Иванов Иван Иванович",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
    role: "Отправитель",
    isSigned: true,
  },
  {
    id: "2",
    name: "Петров Петр Петрович",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Petr",
    role: "Согласующий",
    isSigned: true,
  },
  {
    id: "3",
    name: "Сидорова Мария Александровна",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    role: "Согласующий",
    isSigned: true,
    // rejectionReason: "Необходимо уточнить пункт 3.2 договора",
  },
  {
    id: "4",
    name: "Козлов Алексей Сергеевич",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey",
    role: "Согласующий",
    isSigned: true,
  },
  {
    id: "5",
    name: "Смирнова Елена Викторовна",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    role: "Получатель",
    isSigned: false,
  },
];

const DocumentDetails = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Детали документа"
        description="Просмотр процесса согласования и подписания документа"
      />

      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-6">Цепочка согласования</h2>
        <h3>Причина отказа : {mockParticipants[2].rejectionReason}s</h3>
        <DocumentApprovalFlow participants={mockParticipants} />
      </div>
    </div>
  );
};

export default DocumentDetails;

