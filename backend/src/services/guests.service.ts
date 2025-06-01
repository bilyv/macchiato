import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
  identification_type?: string;
  identification_number?: string;
  special_requirements?: string;
  // Booking details for local guests
  room_number?: number;
  check_in_date?: string;
  check_out_date?: string;
  number_of_guests?: number;
  total_price?: number;
  created_by_user_id?: string;
  created_by_external_user_id?: string;
  created_at: string;
  updated_at: string;
  creator_name?: string;
  creator_type?: string;
}

export interface CreateGuestData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  identificationType?: string;
  identificationNumber?: string;
  specialRequirements?: string;
  // Booking details for local guests
  roomNumber?: number;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  totalPrice?: number;
  createdByUserId?: string;
  createdByExternalUserId?: string;
}

export interface UpdateGuestData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  identificationType?: string;
  identificationNumber?: string;
  specialRequirements?: string;
  // Booking details for local guests
  roomNumber?: number;
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  totalPrice?: number;
}

/**
 * Get all guests with creator information
 */
export const getAllGuests = async (): Promise<Guest[]> => {
  try {
    const result = await query(`
      SELECT
        g.*,
        CASE
          WHEN g.created_by_user_id IS NOT NULL THEN CONCAT(u.first_name, ' ', u.last_name)
          WHEN g.created_by_external_user_id IS NOT NULL THEN CONCAT(eu.first_name, ' ', eu.last_name)
          ELSE 'Unknown'
        END as creator_name,
        CASE
          WHEN g.created_by_user_id IS NOT NULL THEN 'admin'
          WHEN g.created_by_external_user_id IS NOT NULL THEN 'external_user'
          ELSE 'unknown'
        END as creator_type
      FROM guests g
      LEFT JOIN users u ON g.created_by_user_id = u.id
      LEFT JOIN external_users eu ON g.created_by_external_user_id = eu.id
      ORDER BY g.created_at DESC
    `);

    return result.rows;
  } catch (error) {
    console.error('Error fetching guests:', error);
    throw new AppError('Error fetching guests', 500);
  }
};

/**
 * Get guests created by a specific external user
 */
export const getGuestsByExternalUser = async (externalUserId: string): Promise<Guest[]> => {
  try {
    const result = await query(`
      SELECT
        g.*,
        CONCAT(eu.first_name, ' ', eu.last_name) as creator_name,
        'external_user' as creator_type
      FROM guests g
      LEFT JOIN external_users eu ON g.created_by_external_user_id = eu.id
      WHERE g.created_by_external_user_id = $1
      ORDER BY g.created_at DESC
    `, [externalUserId]);

    return result.rows;
  } catch (error) {
    console.error('Error fetching guests by external user:', error);
    throw new AppError('Error fetching guests', 500);
  }
};

/**
 * Get guest by ID
 */
export const getGuestById = async (id: string): Promise<Guest> => {
  try {
    const result = await query(`
      SELECT
        g.*,
        CASE
          WHEN g.created_by_user_id IS NOT NULL THEN CONCAT(u.first_name, ' ', u.last_name)
          WHEN g.created_by_external_user_id IS NOT NULL THEN CONCAT(eu.first_name, ' ', eu.last_name)
          ELSE 'Unknown'
        END as creator_name,
        CASE
          WHEN g.created_by_user_id IS NOT NULL THEN 'admin'
          WHEN g.created_by_external_user_id IS NOT NULL THEN 'external_user'
          ELSE 'unknown'
        END as creator_type
      FROM guests g
      LEFT JOIN users u ON g.created_by_user_id = u.id
      LEFT JOIN external_users eu ON g.created_by_external_user_id = eu.id
      WHERE g.id = $1
    `, [id]);

    if (result.rowCount === 0) {
      throw new AppError('Guest not found', 404);
    }

    return result.rows[0];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error fetching guest:', error);
    throw new AppError('Error fetching guest', 500);
  }
};

/**
 * Create a new guest
 */
export const createGuest = async (guestData: CreateGuestData): Promise<Guest> => {
  try {
    // Validate that at least one creator is specified
    if (!guestData.createdByUserId && !guestData.createdByExternalUserId) {
      throw new AppError('Either createdByUserId or createdByExternalUserId must be specified', 400);
    }

    if (guestData.createdByUserId && guestData.createdByExternalUserId) {
      throw new AppError('Only one creator can be specified', 400);
    }

    // Insert new guest
    const result = await query(`
      INSERT INTO guests (
        first_name, last_name, email, phone, city, country,
        date_of_birth, identification_type, identification_number,
        special_requirements, room_number, check_in_date, check_out_date,
        number_of_guests, total_price, created_by_user_id, created_by_external_user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      guestData.firstName,
      guestData.lastName,
      guestData.email,
      guestData.phone || null,
      guestData.city || null,
      guestData.country || null,
      guestData.dateOfBirth || null,
      guestData.identificationType || null,
      guestData.identificationNumber || null,
      guestData.specialRequirements || null,
      guestData.roomNumber || null,
      guestData.checkInDate || null,
      guestData.checkOutDate || null,
      guestData.numberOfGuests || 1,
      guestData.totalPrice || null,
      guestData.createdByUserId || null,
      guestData.createdByExternalUserId || null
    ]);

    return result.rows[0];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error creating guest:', error);
    throw new AppError('Error creating guest', 500);
  }
};

/**
 * Update guest
 */
export const updateGuest = async (id: string, guestData: UpdateGuestData): Promise<Guest> => {
  try {
    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (guestData.firstName !== undefined) {
      updateFields.push(`first_name = $${paramCount}`);
      values.push(guestData.firstName);
      paramCount++;
    }

    if (guestData.lastName !== undefined) {
      updateFields.push(`last_name = $${paramCount}`);
      values.push(guestData.lastName);
      paramCount++;
    }

    if (guestData.email !== undefined) {
      updateFields.push(`email = $${paramCount}`);
      values.push(guestData.email);
      paramCount++;
    }

    if (guestData.phone !== undefined) {
      updateFields.push(`phone = $${paramCount}`);
      values.push(guestData.phone);
      paramCount++;
    }

    if (guestData.city !== undefined) {
      updateFields.push(`city = $${paramCount}`);
      values.push(guestData.city);
      paramCount++;
    }

    if (guestData.country !== undefined) {
      updateFields.push(`country = $${paramCount}`);
      values.push(guestData.country);
      paramCount++;
    }

    if (guestData.dateOfBirth !== undefined) {
      updateFields.push(`date_of_birth = $${paramCount}`);
      values.push(guestData.dateOfBirth);
      paramCount++;
    }

    if (guestData.identificationType !== undefined) {
      updateFields.push(`identification_type = $${paramCount}`);
      values.push(guestData.identificationType);
      paramCount++;
    }

    if (guestData.identificationNumber !== undefined) {
      updateFields.push(`identification_number = $${paramCount}`);
      values.push(guestData.identificationNumber);
      paramCount++;
    }

    if (guestData.specialRequirements !== undefined) {
      updateFields.push(`special_requirements = $${paramCount}`);
      values.push(guestData.specialRequirements);
      paramCount++;
    }

    // Booking details fields
    if (guestData.roomNumber !== undefined) {
      updateFields.push(`room_number = $${paramCount}`);
      values.push(guestData.roomNumber);
      paramCount++;
    }

    if (guestData.checkInDate !== undefined) {
      updateFields.push(`check_in_date = $${paramCount}`);
      values.push(guestData.checkInDate);
      paramCount++;
    }

    if (guestData.checkOutDate !== undefined) {
      updateFields.push(`check_out_date = $${paramCount}`);
      values.push(guestData.checkOutDate);
      paramCount++;
    }

    if (guestData.numberOfGuests !== undefined) {
      updateFields.push(`number_of_guests = $${paramCount}`);
      values.push(guestData.numberOfGuests);
      paramCount++;
    }

    if (guestData.totalPrice !== undefined) {
      updateFields.push(`total_price = $${paramCount}`);
      values.push(guestData.totalPrice);
      paramCount++;
    }

    if (updateFields.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    // Add updated_at field
    updateFields.push(`updated_at = NOW()`);

    // Add ID parameter
    values.push(id);

    const result = await query(`
      UPDATE guests
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    if (result.rowCount === 0) {
      throw new AppError('Guest not found', 404);
    }

    return result.rows[0];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error updating guest:', error);
    throw new AppError('Error updating guest', 500);
  }
};

/**
 * Delete guest
 */
export const deleteGuest = async (id: string): Promise<void> => {
  try {
    const result = await query(
      'DELETE FROM guests WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw new AppError('Guest not found', 404);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error deleting guest:', error);
    throw new AppError('Error deleting guest', 500);
  }
};
