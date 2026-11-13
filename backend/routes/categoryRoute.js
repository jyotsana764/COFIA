import express from 'express';

const categoryRouter = express.Router();

const categories = [
  {
    id: 'ethnic',
    name: 'Ethnic Wear',
    description: 'Traditional clothing for women, men and children.',
  },
  {
    id: 'shoes',
    name: 'Shoes & Footwear',
    description: 'Footwear for every occasion.',
  },
  {
    id: 'jewellery',
    name: 'Jewellery',
    description: 'Traditional and modern jewellery.',
  },
  {
    id: 'perfumes',
    name: 'Perfumes',
    description: 'Fragrances for every style.',
  },
];

// GET all categories
categoryRouter.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    categories,
  });
});

// GET a single category by ID
categoryRouter.get('/:id', (req, res) => {
  const category = categories.find(
    (item) => item.id === req.params.id
  );

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.status(200).json({
    success: true,
    category,
  });
});

export default categoryRouter;