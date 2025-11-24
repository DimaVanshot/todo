// src/services/todos.service.ts
import { prisma } from '../db/prisma';

import { Category } from './category.service';

export type Todo = {
  id: number;
  title: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
};

export async function listTodo(): Promise<Todo[]> {
  const todo = await prisma.todo.findMany({
    orderBy: { id: 'asc' },
  });
  return todo;
}

export async function createTodo(title: Todo['title'], categoryId: Category['id']) {
  const todo = (await prisma.todo.create({
    data: {
      title,
      categoryId,
    },
  })) as Todo;
  return todo;
}

export async function toggleTodo(id: Todo['id']) {
  const found = (await prisma.todo.findUnique({
    where: {
      id,
    },
  })) as Todo | null;
  if (!found) {
    return null;
  }
  const todo = (await prisma.todo.update({
    where: {
      id,
    },
    data: {
      done: !found.done,
    },
  })) as Todo;
  return todo;
}

export async function removeTodo(id: Todo['id']) {
  const found = (await prisma.todo.findUnique({
    where: {
      id,
    },
  })) as Todo | null;
  if (!found) {
    return null;
  }
  const todo = (await prisma.todo.delete({
    where: {
      id,
    },
  })) as Todo;
  return todo;
}

export async function updateTodo(id: Todo['id'], title: Todo['title'], categoryId: Category['id']) {
  const found = (await prisma.todo.findUnique({
    where: {
      id,
    },
  })) as Todo | null;
  if (!found) {
    return null;
  }
  const todo = (await prisma.todo.update({
    where: {
      id,
    },
    data: {
      title,
      categoryId,
    },
  })) as Todo;
  return todo;
}

export async function getTodo(id: Todo['id']) {
  const found = (await prisma.todo.findUnique({
    where: {
      id,
    },
  })) as Todo | null;
  if (!found) {
    return null;
  }
  return {
    id: found.id,
    title: found.title,
    done: found.done,
    created_at: found.createdAt,
    updated_at: found.updatedAt,
    category_id: found.categoryId,
  };
}
