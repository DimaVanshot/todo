export type Todo = { id: number; title: string; done: boolean };
let seq = 1;
const store = new Map<number, Todo>();
export function listTodos(): Todo[] {
  return Array.from(store.values());
}
export function createTodo(title: string): Todo {
  const todo: Todo = { id: seq++, title, done: false };
  store.set(todo.id, todo);
  return todo;
}
export function toggleTodo(id: number): Todo | null {
  const t = store.get(id);
  if (!t) return null;
  t.done = !t.done;
  store.set(id, t);
  return t;
}
export function removeTodo(id: number): boolean {
  return store.delete(id);
}
