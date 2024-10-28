import { Context } from 'hono'
import { SlotModel } from '../models/slotsModel'

// Récupérer tous les slots
export const getSlots = async (c: Context) => {
  try {
    const slots = await SlotModel.find()
    return c.json(slots)
  } catch (error) {
    return c.json({ message: 'Error fetching slots', error }, 500)
  }
}

// Récupérer un slot par son ID
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

// Créer un nouveau slot
export const createSlotHandler = async (c: Context) => {
  try {
    const { start_date, end_date, location, photographId } = await c.req.json()
    const newSlot = new SlotModel({ start_date, end_date, location, photographId })
    await newSlot.save()
    return c.json(newSlot, 201)
  } catch (error) {
    return c.json({ message: 'Error creating slot', error }, 500)
  }
}

// Mettre à jour un slot
export const updateSlotHandler = async (c: Context) => {
  try {
    const id = c.req.param('id')
    const { start_date, end_date, location, photographId } = await c.req.json()
    const updatedSlot = await SlotModel.findByIdAndUpdate(
      id,
      { start_date, end_date, location, photographId },
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

// Supprimer un slot
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
