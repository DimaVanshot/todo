import { Router } from 'express';

import { getCategory } from '../services/category.service';
import {
  createTodo,
  getTodo,
  listTodo,
  removeTodo,
  updateTodo,
  toggleTodo,
} from '../services/todos.service';
const router = Router();
router.get('/', async (_req, res, next) => {
  try {
    res.json(await listTodo());
  } catch (e) {
    next(e);
  }
});
router.get('/:id', async (_req, res, next) => {
  try {
    const { id } = _req.params;
    res.json(await getTodo(Number(id)));
  } catch (e) {
    next(e);
  }
});
router.post('/', async (req, res, next) => {
  try {
    const { title, categoryId } = (await req.body) ?? {};
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'title isrequired' });
    }
    const category = await getCategory(Number(categoryId));
    if (isNaN(Number(categoryId)) || !category) {
      return res.status(400).json({ error: 'Category not found' });
    }
    const todo = await createTodo(title.trim(), Number(categoryId));
    res.status(201).json(todo);
  } catch (e) {
    next(e);
  }
});
router.post('/:id/toggle', async (req, res, next) => {
  try {
    const id = await Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'invalid id' });
    }
    const todo = await toggleTodo(id);
    if (!todo) {
      return res.status(404).json({ error: 'notfound' });
    }
    res.json(todo);
  } catch (e) {
    next(e);
  }
});
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: 'Id must be number' });
  }
  const { title, categoryId } = req.body ?? {};
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  if (typeof title !== 'string') {
    return res.status(400).json({ message: 'Title must be a string' });
  }
  if (title.trim().length === 0) {
    return res.status(400).json({ message: 'Title cannot be empty' });
  }
  if (title.trim().length > 255) {
    return res.status(400).json({ message: 'Title must be less than 255 characters' });
  }
  if (isNaN(Number(categoryId))) {
    return res.status(400).json({ message: 'CategoryId must be a number' });
  }
  const category = await getCategory(Number(categoryId));
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  const todo = await getTodo(Number(id));
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  const updatedTodo = await updateTodo(Number(id), title.trim(), Number(categoryId));
  return res.json({ todo: updatedTodo });
});
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'invalid id' });
    }
    const ok = await removeTodo(id);
    if (!ok) {
      return res.status(404).json({ error: 'notfound' });
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
export default router;
