const router = require('express').Router();
const Article = require('../models/Article');

router.get('/', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) {
      const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: safe, $options: 'i' } },
        { excerpt: { $regex: safe, $options: 'i' } },
        { tags: { $in: [new RegExp(safe, 'i')] } }
      ];
    }
    const articles = await Article.find(filter).sort({ createdAt: -1 }).select('-content');
    res.json(articles);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) return res.status(404).json({ msg: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
