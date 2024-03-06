import { UuidAdapter } from '../../config/uuid.adapter';
import { Ticket } from '../../domain/interfaces/ticket';
import { WssService } from './wss.service';

export class TicketService {
  constructor(
    private readonly wssService = WssService.instance
  ) { }

  tickets: Ticket[] = [
    { id: UuidAdapter.v4(), ticketNumber: 1, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), ticketNumber: 2, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), ticketNumber: 3, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), ticketNumber: 4, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), ticketNumber: 5, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), ticketNumber: 6, createdAt: new Date(), done: false }
  ];

  private readonly workingOnTickets: Ticket[] = [];

  public get pendingTickets(): Ticket[] {
    return this.tickets.filter(ticket => !ticket.handleAtDesk);
  }

  public get lastWorkingOnTickets(): Ticket[] {
    return this.workingOnTickets.slice(0, 4);
  }

  public get lastTicketNumber(): number {
    return this.tickets.length > 0 ? this.tickets.at(-1)!.ticketNumber : 0;
  }

  public createTicket(): Ticket {
    const ticket: Ticket = {
      id: UuidAdapter.v4(),
      ticketNumber: this.lastTicketNumber + 1,
      createdAt: new Date(),
      done: false,
      handleAt: undefined,
      handleAtDesk: undefined
    };

    this.tickets.push(ticket);
    this.onTicketNumberChanged();

    return ticket;
  }

  public drawTicket(desk: string) {
    const ticket = this.tickets.find(t => !t.handleAtDesk);

    if (!ticket) return { status: 'error', message: 'No hay tickets pendientes' };

    ticket.handleAtDesk = desk;
    ticket.handleAt = new Date();

    this.workingOnTickets.unshift({ ...ticket });
    this.onTicketNumberChanged();
    this.onWorkingOnChanged();

    return { status: 'ok', ticket };
  }

  public onFinishedTicket(id: string) {
    const ticket = this.tickets.find(t => t.id === id);

    if (!ticket) return { status: 'error', message: 'Ticket no encontrado' };

    this.tickets.map(t => {
      if (t.id === id) {
        t.done = true;
      }

      return t;
    });

    return { status: 'ok' };
  }

  private onTicketNumberChanged() {
    this.wssService.sendMessage('on-ticket-count-change', this.pendingTickets.length);
  }

  private onWorkingOnChanged() {
    this.wssService.sendMessage('on-working-change', this.lastWorkingOnTickets);
  }
}