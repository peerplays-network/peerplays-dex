const defaultData = {
    modal: false,
    menu: false,
    overlay: false,
    globalSearch: false
};

const reducer = (state = defaultData, {type, payload}) => {
    switch (type) {
        case 'SET_MENU':
            return {...defaultData, overlay: true, menu: true};
        case 'SET_MODAL':
            return {...defaultData, overlay: true, modal: payload };
        case 'SET_SEARCH':
            return {...defaultData, globalSearch: true};
        case 'CLEAR_LAYOUT':
            return defaultData;
        default:
            return state;
    }
};

export default reducer