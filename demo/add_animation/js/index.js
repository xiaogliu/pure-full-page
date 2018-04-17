let addAnimation = function(height) {
  this.pages.forEach(function(el) {
    Utils.deleteClassName(el.querySelector('p'), 'fade-in');
  });

  // i represent currentPage index
  let i = -(height / this.viewHeight);
  this.pages[i].querySelector('p').classList.add('fade-in');
};

new PureFullPage({
  definePages: addAnimation,
}).init();
