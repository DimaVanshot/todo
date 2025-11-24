import { prisma } from '../db/prisma';

export type Category = {
  id: number;
  title: string;
  color: string;
};

export async function createCategory(
  title: Category['title'],
  color: Category['color'],
): Promise<Category> {
  const category = await prisma.category.create({
    data: {
      title,
      color,
    },
  });

  return {
    id: category.id,
    title: category.title,
    color: category.color,
  };
}

export async function listCategory() {
  const categories = (await prisma.category.findMany({
    orderBy: {
      id: 'asc',
    },
  })) as Category[];

  return categories.map((category) => ({
    id: category.id,
    title: category.title,
    color: category.color,
  }));
}

export async function getCategory(id: Category['id']): Promise<Category | undefined> {
  const category = (await prisma.category.findUnique({
    where: { id },
  })) as Category | null;

  if (!category) return undefined;

  return {
    id: category.id,
    title: category.title,
    color: category.color,
  };
}

export async function addedTodoInCategory(
  idCategory: Category['id'],
  todosId: number[],
): Promise<number[]> {
  await prisma.todo.updateMany({
    where: {
      id: { in: todosId },
    },
    data: {
      categoryId: idCategory,
    },
  });

  return todosId;
}

export async function getTodosInCategory(idCategory: Category['id']) {
  const category = await prisma.category.findUnique({
    where: { id: idCategory },
    include: {
      todos: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return {
    id: category.id,
    title: category.title,
    color: category.color,
    todos: category.todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      done: todo.done,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
      categoryId: todo.categoryId,
    })),
  };
}
export async function updateCategory(
  id: Category['id'],
  title: Category['title'],
  color: Category['color'],
) {
  const found = (await prisma.category.findUnique({
    where: {
      id,
    },
  })) as Category | null;
  if (!found) {
    return null;
  }
  const category = (await prisma.category.update({
    where: {
      id,
    },
    data: {
      title,
      color,
    },
  })) as Category;
  return {
    id: category.id,
    title: category.title,
    color: category.color,
  };
}
export async function removeCategory(id: Category['id']) {
  const category = (await prisma.category.findUnique({
    where: {
      id,
    },
  })) as Category | null;
  if (!category) {
    return null;
  }
  await prisma.todo.deleteMany({
    where: {
      categoryId: id,
    },
  });
  await prisma.category.delete({
    where: {
      id,
    },
  });
  return {
    id: category.id,
    title: category.title,
    color: category.color,
  };
}
