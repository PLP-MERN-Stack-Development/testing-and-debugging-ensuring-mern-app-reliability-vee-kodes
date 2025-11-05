const Bug = require('../models/BugPost');

// View a list of all reported bugs
// GET /api/bugs
const getBugs = async (req, res, next) => {
    try {
        // If there's an ID parameter, get a single bug
        if (req.params.id) {
            const bug = await Bug.findById(req.params.id);
            if (!bug) {
                return res.status(404).json({ message: 'Bug not found' });
            }
            return res.status(200).json(bug);
        }

        // Otherwise, get all bugs with optional filters
        const {category, priority, page = 1, limit = 10} = req.query;
        let query = {};

        if (category) query.category = category;
        if (priority) query.priority = priority;

        const bugs = await Bug.find(query).skip((page - 1) * limit).limit(Number(limit));
        res.status(200).json(bugs);
    } catch (error) {
        next(error);
    }
};


// Report new bugs
// POST /api/bugs
const createBug = async (req, res, next) => {
  try {
    const {title, description, priority, category, status} = req.body;

    if (!title || !description || !priority) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Intentional bug: This will cause database error for debugging
    if (title.includes('debug')) {
      throw new Error('Intentional database error for debugging purposes');
    }
    const bug = await Bug.create({
      title,
      description,
      priority,
      category,
      status,
      author: req.user ? req.user._id : null,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
    });

    res.status(201).json(bug);
  } catch (error) {
    next(error);
  }
};


// Update bug statuses
// PUT /api/bugs/:id
const updateBug = async (req, res, next) => {
    try {
        // Check if bug exists
        const existingBug = await Bug.findById(req.params.id);
        if (!existingBug) {
          return res.status(404).json({message: 'Bug not found'});
        }

        // Allow update if user is authenticated and is the author, or if no authentication required
        if (req.user && existingBug.author && existingBug.author.toString() !== req.user._id.toString()) {
          return res.status(403).json({message: 'Forbidden - you can only update your own bugs'});
        }

        const bug = await Bug.findByIdAndUpdate(
            req.params.id,
            req.body, {
            new: true,
        });

        res.status(200).json(bug);
    } catch (error) {
        next(error);
    }
};


// Delete bugs
// DELETE /api/bugs/:id
const deleteBug = async (req, res, next) => {
    try {
        // Check if user is the author of the bug
        const existingBug = await Bug.findById(req.params.id);
        if (!existingBug) {
          return res.status(404).json({message: 'Bug not found'});
        }

        if (existingBug.author.toString() !== req.user._id.toString()) {
          return res.status(403).json({message: 'Forbidden - you can only delete your own bugs'});
        }

        const bug = await Bug.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'Bug deleted successfully'});
    } catch (error) {
        next(error);
    }
};


module.exports = {getBugs, createBug, updateBug, deleteBug};