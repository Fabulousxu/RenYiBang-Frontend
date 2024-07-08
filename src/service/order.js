import {apiURL} from "./util";
import {get, post, put, del} from "./util";

export async function changeOrderStatus(id, status, isTask) {
	const url = isTask ? `${apiURL}/order/task/status?id=${id}&status=${status}` : `${apiURL}/order/service/status?id=${id}&status=${status}`;
	return put(url, {status});
}

export async function fetchInitiatorTasks() {
	let userId = 1;
	const url = `${apiURL}/order/task/initiator/${userId}`;
	return get(url);
}

export async function fetchRecipientTasks() {
	let userId = 1;
	const url = `${apiURL}/order/task/recipient/${userId}`;
	return get(url);
}

export async function fetchInitiatorServices() {
	let userId = 1;
	const url = `${apiURL}/order/service/initiator/${userId}`;
	return get(url);
}

export async function fetchRecipientServices() {
	let userId = 1;
  const url = `${apiURL}/order/service/recipient/${userId}`;
	return get(url);
}

export async function fetchOrderById(id, isTask) {
	const url = isTask ? `${apiURL}/order/task/${id}` : `${apiURL}/order/service/${id}`;
	return get(url);
}