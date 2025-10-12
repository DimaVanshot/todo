import { Router } from 'express';

import {
  createTodo,
  listTodos,
  deleteTodo,
  getTodo,
  toggleTodo,
  updateTodo,
} from '../services/todos.service';

const router = Router();
router.get('/', (_req, res) => {
  res.json({ list: listTodos() });
});
router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (typeof title !== 'string') {
    return res.status(400).json({ error: 'Title must be a string' });
  }
  if (title.trim().length === 0) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }
  const todo = createTodo(title.trim());
  return res.status(201).json({ todo });
});
router.get('/:id', (req, res) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({ error: 'Id must be a number' });
  }
  const todo = getTodo(Number(id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  return res.json({ todo });
});
router.put('/:id', (req, res) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({ error: 'Id must be a number' });
  }
  if (!req.body.title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (typeof req.body.title !== 'string') {
    return res.status(400).json({ error: 'Title must be a string' });
  }
  if (req.body.title.trim().length === 0) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }
  const todo = getTodo(Number(id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const updatedTodo = updateTodo(Number(id), req.body.title.trim());
  return res.json({ todo: updatedTodo });
});
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({ error: 'Id must be a number' });
  }
  if (!req.body.title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (typeof req.body.title !== 'string') {
    return res.status(400).json({ error: 'Title must be a string' });
  }
  if (req.body.title.trim().length === 0) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }
  const todo = getTodo(Number(id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const updatedTodo = updateTodo(Number(id), req.body.title.trim());
  return res.json({ todo: updatedTodo });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  if (isNaN(Number(id))) return res.status(400).json({ error: 'invalid id' });
  const todo = getTodo(Number(id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  const deleted = deleteTodo(Number(id));
  return res.json({ deleted });
});

router.get('/:id/toggle', (req, res) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({ error: 'Id must be a number' });
  }
  const todo = getTodo(Number(id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const toggled = toggleTodo(Number(id));
  return res.json({ toggled });
});
export default router;
