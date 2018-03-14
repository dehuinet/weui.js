function offCanvas($dom, data) {
    if (data) {
        $dom.css('display', 'block');
        $dom.find('.weui-offcanvas-bar').animate({ left: '70%' }, 300);
    } else {
        $dom.find('.weui-offcanvas-bar').animate({ left: '0' }, 300);
        setTimeout(function() {
            $dom.css('display', 'none');
        }, 300);
    }
}
export default offCanvas;