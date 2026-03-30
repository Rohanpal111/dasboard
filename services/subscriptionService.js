/**
 * subscriptionService.js
 * ─────────────────────────────────────────────────────────
 * Subscription registration + payment APIs.
 * ─────────────────────────────────────────────────────────
 */

import axiosInstance from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';

/**
 * Register business plan.
 * Backend may return payment_mode = RAZORPAY or MANUAL_QR.
 */
export async function registerSubscription(data) {
  const response = await axiosInstance.post(ENDPOINTS.SUBSCRIPTION.REGISTER, data);
  return response.data;
}

/**
 * Verify Razorpay payment after checkout.
 */
export async function verifyRazorpayPayment(paymentData) {
  const response = await axiosInstance.post(ENDPOINTS.SUBSCRIPTION.VERIFY, paymentData);
  return response.data;
}

/**
 * Submit manual QR transaction id for admin approval.
 */
export async function submitManualTransaction(data) {
  const response = await axiosInstance.post(ENDPOINTS.SUBSCRIPTION.MANUAL_SUBMIT, data);
  return response.data;
}

/**
 * Admin: fetch pending manual approvals.
 */
export async function getPendingManualApprovals(params = {}) {
  const response = await axiosInstance.get(ENDPOINTS.SUBSCRIPTION.MANUAL_PENDING, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      search: params.search ?? '',
    },
  });

  const payload = response?.data || {};
  return {
    approvals: Array.isArray(payload.approvals) ? payload.approvals : [],
    pagination: payload.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 },
  };
}

/**
 * Admin: approve selected manual payment.
 */
export async function approveManualPayment(payment_reference, admin_note = 'Txn matched') {
  const response = await axiosInstance.post(ENDPOINTS.SUBSCRIPTION.MANUAL_APPROVE, {
    payment_reference,
    action: 'approve',
    admin_note,
  });
  return response.data;
}

/**
 * Get subscription detail for logged-in business user.
 */
export async function getSubscriptionDetail() {
  const response = await axiosInstance.get(ENDPOINTS.SUBSCRIPTION.DETAIL);
  return response.data;
}

// Backward-compatible aliases
export const registerAndCreateOrder = registerSubscription;
export const verifyPayment = verifyRazorpayPayment;
