const asyncHandler = require('./asyncHandler');

function buildCrud(Model, options = {}) {
  const { searchFields = [], sort = '-createdAt' } = options;

  const list = asyncHandler(async (req, res) => {
    const { search, page = 1, limit = 50, ...filters } = req.query;
    const query = {};

    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== '') query[k] = v;
    }

    if (search && searchFields.length) {
      query.$or = searchFields.map((f) => ({ [f]: { $regex: search, $options: 'i' } }));
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Model.find(query).sort(sort).skip(skip).limit(Number(limit)),
      Model.countDocuments(query),
    ]);

    res.json({ data: items, total, page: Number(page), limit: Number(limit) });
  });

  const getOne = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  });

  const create = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json(item);
  });

  const update = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  });

  return { list, getOne, create, update, remove };
}

module.exports = buildCrud;
