import { Router } from 'express';
import supabase from '../lib/supabase.js';

const router = Router();

router.get('/bookings', async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        unit:units!inner(name),
        customer:customers!inner(first_name, last_name, email, phone)
      `)
      .order('check_in', { ascending: true });

    if (error) throw error;

    res.json(bookings || []);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

router.get('/bookings/calendar', async (req, res) => {
  try {
    const { start, end } = req.query;

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        unit:units!inner(id, name),
        customer:customers!inner(first_name, last_name)
      `)
      .or(`check_in.gte.${start as string},check_in.lte.${end as string},check_out.gte.${start as string},check_out.lte.${end as string}`);

    if (error) throw error;

    res.json(bookings || []);
  } catch (error) {
    console.error('Error fetching calendar bookings:', error);
    res.status(500).json({ error: 'Failed to fetch calendar bookings' });
  }
});

router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data: booking, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        unit:units!inner(name),
        customer:customers!inner(first_name, last_name, email, phone)
      `)
      .single();

    if (error || !booking) {
      throw new Error('Failed to update booking status');
    }

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

export default router;
