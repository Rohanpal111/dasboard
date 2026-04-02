/**
 * usersService.js
 * ─────────────────────────────────────────────────────────
 * Superadmin-only user management APIs.
 * ─────────────────────────────────────────────────────────
 */

import axiosInstance from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';

/**
 * Superadmin: fetch users with filters, search and pagination.
 */
export async function getAdminUsers(params = {}) {
  const resolvedRole = typeof params.role === 'string' && params.role.trim() ? params.role.trim() : 'customer';
  const resolvedSearch = typeof params.search === 'string' ? params.search.trim() : '';
  const resolvedIsActive =
    params.is_active === true || params.is_active === 'true'
      ? 'true'
      : params.is_active === false || params.is_active === 'false'
        ? 'false'
        : 'true';

  const queryParams = {
    search: resolvedSearch,
    role: resolvedRole,
    is_active: resolvedIsActive,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    sort_by: params.sort_by ?? 'created_at',
    sort_order: params.sort_order ?? 'desc',
  };

  return axiosInstance.get(ENDPOINTS.USERS.ADMIN_LIST, {
    params: queryParams,
  });
}

/**
 * Superadmin: update a user record.
 */
export async function updateAdminUser(payload) {
  return axiosInstance.patch(ENDPOINTS.USERS.ADMIN_UPDATE, payload);
}