export interface Ticket {
  id: string;
  ticketNumber: number;
  createdAt: Date;
  handleAtDesk?: string;
  handleAt?: Date;
  done: boolean;
}