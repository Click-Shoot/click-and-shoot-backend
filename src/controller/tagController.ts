import { Context } from 'hono';
import { TagModel } from '../models/tagModel';

export const createTag = async (c: Context) => {
  try {
    const { label, image } = await c.req.json();

    if (!label) {
      return c.json({ message: 'label is required' }, 400);
    }

    if (!image) {
      return c.json({ message: 'image is required' }, 400);
    }

    const existingTag = await TagModel.findOne({ label });

    if (existingTag) {
      return c.json({ message: 'Tag already exists' }, 400);
    }

    const tag = new TagModel({ label, image });
    const savedTag = await tag.save();

    return c.json({ success: true, tag: savedTag });
  } catch (error) {
    console.error('Error creating tag:', error);
    return c.json({ message: 'Error creating tag', error }, 500);
  }
};

export const getAllTags = async (c: Context) => {
  try {
    const tags = await TagModel.find();

    if (tags.length === 0) {
      return c.json({ message: 'No tags found' }, 404);
    }

    return c.json({ success: true, tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return c.json({ message: 'Error fetching tags', error }, 500);
  }
};

export const getTagById = async (c: Context) => {
  try {
    const tagId = c.req.param('id');

    const tag = await TagModel.findById(tagId);

    if (!tag) {
      return c.json({ message: 'Tag not found' }, 404);
    }

    return c.json({ success: true, tag });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return c.json({ message: 'Error fetching tag', error }, 500);
  }
};

export const updateTag = async (c: Context) => {
  try {
    const tagId = c.req.param('id');
    const { label, image } = await c.req.json();

    if (!label) {
      return c.json({ message: 'label is required' }, 400);
    }

    if (!image) {
      return c.json({ message: 'image is required' }, 400);
    }

    const updatedTag = await TagModel.findByIdAndUpdate(
      tagId,
      { label, image },
      { new: true }
    );

    if (!updatedTag) {
      return c.json({ message: 'Tag not found' }, 404);
    }

    return c.json({ success: true, tag: updatedTag });
  } catch (error) {
    console.error('Error updating tag:', error);
    return c.json({ message: 'Error updating tag', error }, 500);
  }
};

export const deleteTag = async (c: Context) => {
  try {
    const tagId = c.req.param('id');

    const deletedTag = await TagModel.findByIdAndDelete(tagId);

    if (!deletedTag) {
      return c.json({ message: 'Tag not found' }, 404);
    }

    return c.json({ success: true, message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return c.json({ message: 'Error deleting tag', error }, 500);
  }
};
