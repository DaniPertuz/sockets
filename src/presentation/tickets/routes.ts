import { Router } from 'express';
import { TicketController } from './controller';

export class TicketRoutes {
  static get routes() {
    const router = Router();
    const { createTicket, drawTicket, getLastTicketNumber, getTickets, pendingTickets, ticketFinished, workingOn } = new TicketController();

    router.get('/', getTickets);
    router.get('/last', getLastTicketNumber);
    router.get('/pending', pendingTickets);

    router.post('/', createTicket);

    router.get('/draw/:desk', drawTicket);
    router.put('/done/:ticketId', ticketFinished);

    router.get('/working-on', workingOn);
    return router;
  }
}