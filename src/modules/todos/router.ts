import { Hono } from "hono";
import { prisma } from "../../utils/prisma";
import { zValidator } from "@hono/zod-validator";
import { createTodoSchema } from "./schema";

export const todoRouter = new Hono()
  .get("/", async (c) => {
    const todos = await prisma.todo.findMany();
    return c.json({ todos });
  })
  .get("/:id", async (c) => {
    const todoId = c.req.param("id");
    const todo = await prisma.todo.findUnique({
      where: { id: Number(todoId) },
    });
    if (!todo) {
      return c.json({ message: "Data tidak ditemukan" }, 404);
    }
    return c.json(todo);
  })
  .post("/", zValidator("json", createTodoSchema), async (c) => {
    const body = c.req.valid("json");

    const newTodo = await prisma.todo.create({
      data: {
        title: body.title,
        content: body.content,
      },
    });

    return c.json(newTodo, 201);
  });
