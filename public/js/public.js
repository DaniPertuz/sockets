function renderTickets(tickets = []) {
  for (let i = 0; i < tickets.length; i++) {
    if (i >= 4) break;

    const ticket = tickets[i];
    if (!ticket) continue;

    const lblTicket = document.querySelector(`#lbl-ticket-0${ticket + 1}`);
    const lblDesk = document.querySelector(`#lbl-desk-0${ticket + 1}`);

    lblTicket.innerText = `Ticket ${ticket.ticketNumber}`;
    lblDesk.innerText = ticket.handleAtDesk;
  }
}

async function loadCurrentTickets() {
  const tickets = await fetch('/api/ticket/working-on').then(resp => resp.json());
  renderTickets(tickets);
}

function connectToWebSockets() {
  const socket = new WebSocket('ws://localhost:3000/ws');

  socket.onmessage = (event) => {
    const { msg, payload } = JSON.parse(event.data);

    if (msg !== 'on-working-change') return;

    renderTickets(payload);
  };

  socket.onclose = (event) => {
    setTimeout(() => {
      connectToWebSockets();
    }, 1500);
  };

  socket.onopen = (event) => {
    console.log('Connected');
  };
}

connectToWebSockets();
loadCurrentTickets();