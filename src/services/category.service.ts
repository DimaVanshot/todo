import { getTodo, Todo } from './todos.service';

export type HexColor = '#${string}';
export type Category = {
  id: number;
  title: string;
  color: HexColor;
};

let seq = 1;
const store = new Map<Category['id'], Category>();
const storeTodoAndCategory = new Map<Category['id'], Todo['id'][]>();

export function createCategory(title: Category['title'], color: Category['color']): Category {
  const category: Category = {
    id: seq++,
    title,
    color,
  };
  store.set(category.id, category);
  return category;
}
export function listCategory(): Category[] {
  return Array.from(store.values());
}
export function getCategory(id: Category['id']): Category | undefined {
  return store.get(id);
}

export function addedTodoInCategory(
  idCategory: Category['id'],
  todosId: Todo['id'][],
): Todo['id'][] {
  const todos = todosId.map((id) => getTodo(id)?.id).filter(Boolean) as Todo['id'][];
  const category = getCategory(idCategory);

  if (category) {
    storeTodoAndCategory.set(category.id, todos);
  }

  return todos;
}

export function getTodosInCategory(idCategory: Category['id']): Category & { todos: Todo[] } {
  const category = getCategory(idCategory);
  if (!category) {
    throw new Error('Category not found');
  }
  const todos = storeTodoAndCategory.get(idCategory);
  const todosEntity = ((todos || [])?.map((id) => getTodo(id)) || []) as Todo[];
  return {
    ...category,
    todos: todosEntity,
  };
}
