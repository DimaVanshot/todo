import { Router } from 'express';

import {
  createCategory,
  getCategory,
  getTodosInCategory,
  HexColor,
  listCategory,
} from '../services/category.service';

const router = Router();

router.get('/', (req, res) => {
  res.json({ list: listCategory() });
});

router.post('/', (req, res) => {
  const { title, color } = req.body;
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

  const category = createCategory(title.trim(), color.trim() as HexColor);
  return res.status(201).json({ category });
});

// Выборка конкретной категории
router.get('/:id', (req, res) => {
  // Получаем ID из url
  const { id } = req.params;
  const { todos } = req.query;

  // Проверяем ялвялется ли это числом
  if (isNaN(Number(id))) {
    return res.status(400).json({ message: 'Id must be a number' });
  }

  // Получаем нашу Category запись
  const category = getCategory(Number(id));

  // Если Category не найдено!
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  if (todos && todos === 'true') {
    res.json({ list: getTodosInCategory(category.id) });
  } else {
    // Возвращаем рузультат поиска Category
    return res.json({ category });
  }
});
export default router;
