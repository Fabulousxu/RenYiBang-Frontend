// service/user.js

import {get, post, apiURL} from "./util";

export const getUserProfile = async () => {
    // let userId = localStorage.getItem('userId');
    let userId = 1;
    let res = await get(`${apiURL}/user/profile/${userId}`);
    return res;
};

export const  getUserTasks = async () => {
    // let userId = localStorage.getItem('userId');
    let userId = 1;
    let res = await get(`${apiURL}/order/task/recipient/${userId}?capacity=10`);
    return res;
};
