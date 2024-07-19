// service/user.js

import {get, post, apiURL} from "./util";

export const getUserProfile = async (userId) => {
    // let userId = localStorage.getItem('userId');
    let res = await get(`${apiURL}/user/${userId}`);
    console.log(res);
    return res;
};

export const getSelfProfile = async () => {
    let res = await get(`${apiURL}/user/self`);
    // console.log(res);
    return res;
};

export async function fetchInitiatorTasks(pageSize, pageIndex) {
    const url = `${apiURL}/task/initiator/self?pageSize=${pageSize}&pageIndex=${pageIndex}`;
    return get(url);
}

export async function fetchRecipientTasks(pageSize, pageIndex) {
    const url = `${apiURL}/task/recipient/self?pageSize=${pageSize}&pageIndex=${pageIndex}`;
    return get(url);
}

export async function fetchInitiatorServices(pageSize, pageIndex) {
    const url = `${apiURL}/service/initiator/self?pageSize=${pageSize}&pageIndex=${pageIndex}`;
    return get(url);
}

export async function fetchRecipientServices(pageSize, pageIndex) {
    const url = `${apiURL}/service/recipient/self?pageSize=${pageSize}&pageIndex=${pageIndex}`;
    return get(url);
}