import { orders } from "./channels/orders.ts";

orders.consume(
  "orders",
  async (message) => {
    if (!message) {
      return null;
    }

    console.log(message?.content.toString());

    orders.ack(message); // avisando que recebi a mensagem com sucesso.
  },
  {
    noAck: false, // acknowledge -> reconhecer, ou seja, dizer que a mensagem foi recebida com sucesso
  },
);

// Não queremos que ele faça o reconhecimento automaticamente porque se der algo de errado eu quero dizer que deu algo errado
// para poder tentar novamente mais tarde, ou seja, o controle para dizer que a mensagem foi recebida com sucesso ou não é meu.
