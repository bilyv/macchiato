import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
  identification_type?: string;
  identification_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  special_requirements?: string;
  notes?: string;
  is_vip: boolean;
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
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  identificationType?: string;
  identificationNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  specialRequirements?: string;
  notes?: string;
  isVip?: boolean;
  createdByUserId?: string;
  createdByExternalUserId?: string;
}

export interface UpdateGuestData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  identificationType?: string;
  identificationNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  specialRequirements?: string;
  notes?: string;
  isVip?: boolean;
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
        first_name, last_name, email, phone, address, city, country,
        date_of_birth, identification_type, identification_number,
        emergency_contact_name, emergency_contact_phone, special_requirements,
        notes, is_vip, created_by_user_id, created_by_external_user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      guestData.firstName,
      guestData.lastName,
      guestData.email,
      guestData.phone || null,
      guestData.address || null,
      guestData.city || null,
      guestData.country || null,
      guestData.dateOfBirth || null,
      guestData.identificationType || null,
      guestData.identificationNumber || null,
      guestData.emergencyContactName || null,
      guestData.emergencyContactPhone || null,
      guestData.specialRequirements || null,
      guestData.notes || null,
      guestData.isVip || false,
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

    if (guestData.address !== undefined) {
      updateFields.push(`address = $${paramCount}`);
      values.push(guestData.address);
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

    if (guestData.emergencyContactName !== undefined) {
      updateFields.push(`emergency_contact_name = $${paramCount}`);
      values.push(guestData.emergencyContactName);
      paramCount++;
    }

    if (guestData.emergencyContactPhone !== undefined) {
      updateFields.push(`emergency_contact_phone = $${paramCount}`);
      values.push(guestData.emergencyContactPhone);
      paramCount++;
    }

    if (guestData.specialRequirements !== undefined) {
      updateFields.push(`special_requirements = $${paramCount}`);
      values.push(guestData.specialRequirements);
      paramCount++;
    }

    if (guestData.notes !== undefined) {
      updateFields.push(`notes = $${paramCount}`);
      values.push(guestData.notes);
      paramCount++;
    }

    if (guestData.isVip !== undefined) {
      updateFields.push(`is_vip = $${paramCount}`);
      values.push(guestData.isVip);
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
