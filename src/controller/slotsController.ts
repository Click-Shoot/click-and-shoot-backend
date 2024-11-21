import { Context } from 'hono'
import { SlotModel } from '../models/slotsModel'

export const getSlots = async (c: Context) => {
  try {
    const slots = await SlotModel.find()
    return c.json(slots)
  } catch (error) {
    return c.json({ message: 'Error fetching slots', error }, 500)
  }
}

export const getSlotById = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const slot = await SlotModel.findById(id)
    if (slot) {
      return c.json(slot)
    } else {
      return c.json({ message: 'Slot not found' }, 404)
    }
  } catch (error) {
    return c.json({ message: 'Error fetching slot', error }, 500)
  }
}

export const getSlotByReserve = async (c: Context) => {
  try {
    const id = c.req.param('photographId');

    const isPhotograph = c.req.query('photograph') === 'true';

    console.log(isPhotograph)
    let slots;
    if (isPhotograph) {
      slots = await SlotModel.find({ photographId: id });
    } else {
      slots = await SlotModel.find({ customerId: id });
    }

    if (slots.length === 0) {
      return c.json({ message: 'No slots found for the given criteria' }, 404);
    }

    return c.json(slots);
  } catch (error) {
    return c.json({ message: 'Error fetching slots', error: error }, 500);
  }
};

export const createSlotHandler = async (c: Context) => {
  try {
    const { start_date, end_date, location, photographId, customersId } = await c.req.json()
    const newSlot = new SlotModel({ start_date, end_date, location, photographId, customersId })
    await newSlot.save()
    return c.json(newSlot, 201)
  } catch (error) {
    return c.json({ message: 'Error creating slot', error }, 500)
  }
}

export const updateSlotHandler = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const { start_date, end_date, location, photographId, customersId, isReserved } = await c.req.json()
    const updatedSlot = await SlotModel.findByIdAndUpdate(
      id,
      { start_date, end_date, location, photographId, customersId, isReserved },
      { new: true }
    )
    if (updatedSlot) {
      return c.json(updatedSlot)
    } else {
      return c.json({ message: 'Slot not found' }, 404)
    }
  } catch (error) {
    return c.json({ message: 'Error updating slot', error }, 500)
  }
}

export const deleteSlotHandler = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const deletedSlot = await SlotModel.findByIdAndDelete(id)
    if (deletedSlot) {
      return c.json({ message: 'Slot deleted successfully' })
    } else {
      return c.json({ message: 'Slot not found' }, 404)
    }
  } catch (error) {
    return c.json({ message: 'Error deleting slot', error }, 500)
  }
}

export const reserveSlot = async (c: Context) => {
  try {
    const { slotId, customersId } = await c.req.json();

    if (!slotId || !customersId) {
      return c.json({ message: 'slotId and customerId are required' }, 400);
    }

    const slot = await SlotModel.findById(slotId);
    if (!slot) {
      return c.json({ message: 'Slot not found' }, 404);
    }

    slot.isReserved = true;
    slot.customersId = customersId;

    await slot.save();

    return c.json({ message: 'Slot reserved successfully', slot });
  } catch (error) {
    console.error('Error reserving slot:', error);
    return c.json({ message: 'Error reserving slot', error }, 500);
  }
};
