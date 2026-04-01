import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { db } from "../db/client.ts";
import { schema } from "../db/schema/index.ts";
import { randomUUID } from "node:crypto";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, { origin: "*" });

app.get("/health", (request, reply) => {
  return "OK";
});

app.post(
  "/orders",
  {
    schema: {
      body: z.object({
        amount: z.number(),
      }),
    },
  },
  async (request, reply) => {
    const { amount } = request.body;

    console.log(`creating an order with amount ${amount}`);

    const [order] = await db
      .insert(schema.orders)
      .values({
        id: randomUUID(),
        customerId: "61430f10-400b-4c7d-8a9e-6778666d4a65",
        amount,
      })
      .returning();

    dispatchOrderCreated({
      orderId: order.id,
      customer: {
        id: order.customerId,
      },
      amount: order.amount,
    });

    return reply.status(201).send();
  },
);

app.listen({ host: "0.0.0.0", port: 3333 }).then(() => {
  console.log("[Orders] HTTP Server running!");
});
