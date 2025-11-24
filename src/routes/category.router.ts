import { Router } from 'express';

import {
  createCategory,
  getCategory,
  getTodosInCategory,
  listCategory,
  updateCategory,
  removeCategory,
} from '../services/category.service';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ list: await listCategory() });
});

router.post('/', async (req, res) => {
  const { title, color } = await req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (typeof title !== 'string') {
    return res.status(400).json({ error: 'Title must be a string' });
  }
  if (title.trim().length === 0) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }
  if (!color) {
    return res.status(400).json({ message: 'Color is required' });
  }

  if (typeof color !== 'string') {
    return res.status(400).json({ message: 'Color must be a string' });
  }

  if (color.trim().length === 0) {
    return res.status(400).json({ message: 'Color cannot be empty' });
  }

  if (color[0] !== '#') {
    return res.status(400).json({ message: 'Color must start with #' });
  }

  // #1F501F
  if (color.length !== 7) {
    return res.status(400).json({ message: 'Color must be 7 characters long' });
  }

  const category = await createCategory(title.trim(), color.trim());
  return res.status(201).json({ category });
});

// Выборка конкретной категории
router.get('/:id', async (req, res) => {
  // Получаем ID из url
  const { id } = req.params;
  const { todos } = req.query;

  // Проверяем ялвялется ли это числом
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: 'Id must be a number' });
  }

  // Получаем нашу Category запись
  const category = await getCategory(Number(id));

  // Если Category не найдено!
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  if (todos && todos === 'true') {
    res.json({ list: await getTodosInCategory(category.id) });
  } else {
    // Возвращаем рузультат поиска Category
    return res.json({ category });
  }
});
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: 'Id must be number' });
  }
  const { title, color } = req.body ?? {};
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
  const category = await getCategory(Number(id));
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  const updatedCategory = await updateCategory(Number(id), title.trim(), color);
  return res.json({ todo: updatedCategory });
});
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: 'Id must be a number' });
  }
  const category = await getCategory(Number(id));
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }
  const deletedCategory = await removeCategory(Number(id));
  return res.json({ category: deletedCategory });
});
export default router;
