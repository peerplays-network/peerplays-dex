import {store} from "../index";
import {blockContent} from "../actions/blockContent";

const layoutDispatch = (type, payload = false, needToBlock = true) => {
    blockContent(needToBlock);
    store.dispatch({type, payload});
};

export const openMenu = () => layoutDispatch('SET_MENU');
export const setModal = payload => layoutDispatch('SET_MODAL', payload);
export const openSearch = () => layoutDispatch('SET_SEARCH');
export const clearLayout = () => layoutDispatch('CLEAR_LAYOUT', '', false);