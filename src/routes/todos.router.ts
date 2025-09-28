import { Router } from 'express';

import { createTodo, listTodos, removeTodo, toggleTodo } from '../services/todos.service';
const router = Router();
router.get('/', (_req, res) => {
  res.json(listTodos());
});
router.post('/', (req, res) => {
  const { title } = req.body ?? {};
  if (typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  const todo = createTodo(title.trim());
  res.status(201).json(todo);
});
router.post('/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
  const todo = toggleTodo(id);
  if (!todo) return res.status(404).json({ error: 'not found' });
  res.json(todo);
});
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'invalid id' });
  const ok = removeTodo(id);
  if (!ok) return res.status(404).json({ error: 'not found' });
  res.status(204).send();
});
export default router;
