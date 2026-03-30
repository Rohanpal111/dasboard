/**
 * offersService.js
 * ─────────────────────────────────────────────────────────
 * Offers API integration.
 * Supports: create, my_offers, offers-by-business, update/toggle.
 * ─────────────────────────────────────────────────────────
 */

import axiosInstance from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';

function getOfferStatus(offer) {
	const now = new Date();
	const start = offer.start_date ? new Date(offer.start_date) : null;
	const end = offer.end_date ? new Date(offer.end_date) : null;

	if (!offer.is_active) return 'inactive';
	if (end && end < now) return 'expired';
	if (start && start > now) return 'pending';
	return 'active';
}

function mapOffer(offer) {
	const discountValue = Number(offer.discount || 0);
	const isPercentage = offer.discount_type === 'percentage';

	return {
		...offer,
		name: offer.title,
		discountLabel: isPercentage ? `${discountValue}%` : `Rs ${discountValue}`,
		appliesTo: offer.service_name || 'All Services',
		enabled: !!offer.is_active,
		status: getOfferStatus(offer),
	};
}

export async function getMyOffers(params = {}) {
	const query = {
		limit: params.limit ?? 10,
		page: params.page ?? 1,
	};

	const response = await axiosInstance.get(ENDPOINTS.OFFERS.MY_OFFERS, { params: query });
	const payload = response?.data || {};
	const offers = Array.isArray(payload.offers) ? payload.offers : [];

	return {
		offers: offers.map(mapOffer),
		pagination: payload.pagination || { total: 0, page: 1, limit: query.limit, totalPages: 0 },
	};
}

export async function getOffersByBusiness(businessId, params = {}) {
	if (!businessId) return { offers: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };

	const query = {
		limit: params.limit ?? 10,
		page: params.page ?? 1,
		active_only: params.active_only ?? true,
	};

	const response = await axiosInstance.get(ENDPOINTS.OFFERS.BY_BUSINESS(businessId), { params: query });
	const payload = response?.data || {};
	const offers = Array.isArray(payload.offers) ? payload.offers : [];

	return {
		offers: offers.map(mapOffer),
		pagination: payload.pagination || { total: 0, page: 1, limit: query.limit, totalPages: 0 },
	};
}

export async function createOffer(payload) {
	const requestBody = {
		service_id: payload.service_id || null,
		title: payload.title,
		discount_type: payload.discount_type,
		discount: payload.discount,
		start_date: payload.start_date,
		end_date: payload.end_date,
		is_active: payload.is_active ?? true,
	};

	const response = await axiosInstance.post(ENDPOINTS.OFFERS.CREATE, requestBody);
	return mapOffer(response?.data || {});
}

export async function updateOffer(offerId, payload) {
	const response = await axiosInstance.patch(ENDPOINTS.OFFERS.UPDATE(offerId), payload);
	return mapOffer(response?.data || {});
}

export async function toggleOffer(offerId, enabled) {
	return updateOffer(offerId, { is_active: enabled });
}
