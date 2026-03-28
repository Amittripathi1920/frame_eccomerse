const pool = require('../config/database');

const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    const result = await pool.query(
      'SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1 ORDER BY created_at DESC',
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const filterProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, rating } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (minPrice) {
      params.push(parseFloat(minPrice));
      query += ` AND price >= $${params.length}`;
    }

    if (maxPrice) {
      params.push(parseFloat(maxPrice));
      query += ` AND price <= $${params.length}`;
    }

    if (rating) {
      params.push(parseFloat(rating));
      query += ` AND average_rating >= $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sortProducts = async (req, res) => {
  try {
    const { sortBy, order } = req.query;
    const validSort = ['price', 'rating', 'created_at'];
    const validOrder = ['ASC', 'DESC'];

    if (!validSort.includes(sortBy) || !validOrder.includes(order.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid sort parameters' });
    }

    const query = `SELECT * FROM products ORDER BY ${sortBy} ${order.toUpperCase()}`;
    const result = await pool.query(query);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  searchProducts,
  filterProducts,
  sortProducts
};
