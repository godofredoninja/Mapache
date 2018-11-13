import LazyLoad from 'vanilla-lazyload';

const lazyLoadOptions = {
  elements_selector: '.lazy-load-image',
  threshold: 0,
}

export default () => { return new LazyLoad(lazyLoadOptions) }
