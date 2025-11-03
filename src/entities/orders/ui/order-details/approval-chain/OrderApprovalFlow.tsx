import DocumentApprovalFlow, {
  ApprovalParticipant,
  ApprovalRole,
} from 'entities/documents/ui/document-details/approval-chain/DocumentApprovalFlow';
import { OrderMember } from '../../../model/types';

interface OrderApprovalFlowProps {
  orderMembers: OrderMember[];
  employeeName?: string;
  employeePhoto?: string;
}

// Map OrderMember type_approval to ApprovalRole
const mapTypeApprovalToRole = (typeApproval: number): ApprovalRole => {
  switch (typeApproval) {
    case 1:
      return 'Отправитель';
    case 2:
      return 'Согласующий';
    case 3:
      return 'Получатель';
    default:
      return 'Согласующий';
  }
};

// Map OrderMember to ApprovalParticipant
const mapOrderMemberToParticipant = (member: OrderMember): ApprovalParticipant => {
  const isSigned = member.member_check === 'true' || member.member_check === '1';
  const hasRejection = member.member_refusal !== null && member.member_refusal !== '';

  return {
    id: member.id.toString(),
    name: member.name,
    photo: member.image,
    role: mapTypeApprovalToRole(member.type_approval),
    isSigned,
    rejectionReason: hasRejection ? member.member_refusal || undefined : undefined,
    division: '', // OrderMember doesn't have division info
    position: member.position,
  };
};

const OrderApprovalFlow = ({ orderMembers, employeeName, employeePhoto }: OrderApprovalFlowProps) => {
  // Sort members by queue order
  const sortedMembers = [...orderMembers].sort((a, b) => a.member_queue - b.member_queue);

  // Map OrderMember[] to ApprovalParticipant[]
  const participants: ApprovalParticipant[] = sortedMembers.map(mapOrderMemberToParticipant);

  // If we have employee info and no sender in members, add it at the beginning
  if (employeeName && !participants.some(p => p.role === 'Отправитель')) {
    const senderParticipant: ApprovalParticipant = {
      id: 'sender',
      name: employeeName,
      photo: employeePhoto,
      role: 'Отправитель',
      isSigned: true, // Sender always signed
      division: '',
      position: '',
    };
    participants.unshift(senderParticipant);
  }

  return <DocumentApprovalFlow participants={participants} />;
};

export default OrderApprovalFlow;

