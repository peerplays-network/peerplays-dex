export const blockContent = (bool) => {
    const body = document.body;
    document.getElementsByClassName('search__field')[0].value = '';
    if(bool){
        const scroll = window.scrollY;
        body.style.top = '-' + scroll + 'px';
        body.classList.add('modal-open');
    } else if(body.classList.contains('modal-open')){
        const scrollTo = Math.abs(parseInt(body.style.top));
        body.classList.remove('modal-open');
        body.removeAttribute('style');
        window.scrollTo(0, scrollTo);
    }
};