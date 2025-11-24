import { prisma } from '../src/db/prisma';
import { createTodo, listTodo, toggleTodo, removeTodo } from '../src/services/todos.service';
beforeAll(async () => {
  await prisma.$connect();
});
beforeEach(async () => {
  await prisma.todo.deleteMany();
});
afterAll(async () => {
  await prisma.$disconnect();
});
describe('todos service (prisma)', () => {
  test('create and list', async () => {
    const t = await createTodo('learn ts', 1);
    expect(t.id).toBeGreaterThan(0);
    const all = await listTodo();
    expect(all.some((x) => x.id === t.id && x.title === 'learn ts' && x.done === false)).toBe(true);
  });
  test('toggle', async () => {
    const t = await createTodo('toggle me', 1);
    const toggled = await toggleTodo(t.id);
    expect(toggled?.done).toBe(true);
  });
  test('remove', async () => {
    const t = await createTodo('remove me', 1);
    const ok = await removeTodo(t.id);
    expect(ok).toBe(true);
  });
});
