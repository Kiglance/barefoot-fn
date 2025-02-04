export const unloggedInUser = {
  role_id: 0,
  name: 'Anonymous',
};
const urlSerializer = (url) => {
  const param = new URLSearchParams();
  // console.log(window.location, url)
  url = window.location.origin;
  param.set('BASE_URL', url);
  return param;
};

// eslint-disable-next-line import/prefer-default-export
export { urlSerializer };
