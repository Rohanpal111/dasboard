/**
 * endpoints.js
 * ─────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for every API endpoint.
 * Backend: https://api.sundayhundred.com/api/v1
 * ─────────────────────────────────────────────────────────
 */

const RAW_BASE_URL =
 'https://api.sundayhundred.com/api/v1';

export const BASE_URL = /^https?:\/\//i.test(RAW_BASE_URL)
  ? RAW_BASE_URL
  : `https://${RAW_BASE_URL}`;

export const ENDPOINTS = {
  // ── Auth ──────────────────────────────────────────────
  AUTH: {
    LOGIN_BUSINESS: "/users/login-business",
    SIGNUP: "/users/signup",
    PROFILE_UPLOAD: "/users/profile-upload",
    PROFILE_UPDATE: "/users/profile-update",
  },

  // ── Subscriptions (Razorpay) ──────────────────────────
  SUBSCRIPTION: {
    REGISTER: "/subscriptions/register",
    VERIFY: "/subscriptions/verify",
    DETAIL: "/subscriptions/detail",
    MANUAL_SUBMIT: '/subscriptions/manual/submit',
    MANUAL_PENDING: '/subscriptions/manual/pending',
    MANUAL_APPROVE: '/subscriptions/manual/action',
  },

  // ── Business ──────────────────────────────────────────
  BUSINESS: {
    CREATE: "/business/createBusiness",
    ADMIN_BULK_CREATE: "/business/admin/bulk-create",
    UPDATE: "/business/updateBusiness",
    GET_ALL_FEATURED: "/business/getAllFeatureBusiness",
    GET_BY_ID: (id) => `/business/getBusinessById/${id}`,
  },

  // ── Users (Superadmin) ────────────────────────────────
  USERS: {
    ADMIN_LIST: '/users/admin/users',
    ADMIN_UPDATE: '/users/admin/user-update',
  },

  // ── Categories ────────────────────────────────────────
  CATEGORIES: {
    LIST: "/categories/",
  },

  // ── Cities ────────────────────────────────────────────
  CITIES: {
    LIST: "/cities/",
  },

  // ── Reviews ───────────────────────────────────────────
  REVIEWS: {
    BY_BUSINESS: (businessId) => `/reviews/${businessId}`,
  },

  // ── SERVICES ───────────────────────────────────────────
  SERVICES: {
    LIST: (businessId) => `services/get_service/${businessId}`,
    CREATE: "/services/create_service",
  },

  // ── OFFERS ─────────────────────────────────────────────
  OFFERS: {
    CREATE: '/offers/create_offer',
    BY_BUSINESS: (businessId) => `/offers/business/${businessId}`,
    MY_OFFERS: '/offers/my_offers',
    UPDATE: (offerId) => `/offers/update_offer/${offerId}`,
  },
};
