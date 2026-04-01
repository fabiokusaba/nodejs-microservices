import { broker } from "../broker.ts";

export const orders = await broker.createChannel(); // criando um canal

await orders.assertQueue("orders"); // nomeando a fila
