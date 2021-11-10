import {CATEGORY_ARRAY} from "../constants/app";

export const getActivities = (activities) => {
    if(!activities) return '';
    const categories = activities.map(a => CATEGORY_ARRAY[a]);
    return categories.join(',');
}