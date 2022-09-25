  
const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
}

const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) return false;
  
  const msElapsed = Date.now() - Number(timestamp);
  return (msElapsed / 1000) > Number(expireTime);
};

const refreshToken = async () => {
  fetchGet('/refresh_token').then(data=>console.log(data));
};

const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const hasError = urlParams.get('error');
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
  };

  const accTokenKey = LOCALSTORAGE_KEYS.accessToken;
  const accTokenVal = LOCALSTORAGE_VALUES.accessToken;
  const timestampKey = LOCALSTORAGE_KEYS.timestamp;

  // If there's an error OR the token in localStorage has expired, refresh the token
  if (hasError || hasTokenExpired() || accTokenVal==='undefined') 
    refreshToken();

  // If there is a valid access token in localStorage, use that
  if (accTokenVal && accTokenVal!=='undefined')
    return accTokenVal; 

  // If there is a token in the URL query params, user is logging in for the first time
  if (queryParams[accTokenKey]) {
    Object.keys(queryParams).map(key => 
      window.localStorage.setItem(key,queryParams[key]));

    window.localStorage.setItem(timestampKey, Date.now());
  
    return queryParams[accTokenKey];
  }

  return false;
};

export const accessToken = getAccessToken();

export const logout = () => {
  Object.keys(LOCALSTORAGE_KEYS).forEach(key => 
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[key]));

  window.location = window.location.origin;
};

export const fetchGet = async (url) => new Promise (resolve =>
  fetch(url).then(res => res.json()).then(data => resolve(data)));

export const getServerHost = async () => new Promise(resolve => resolve(fetchGet('/api/get/server')));

export const getProfile = async () => new Promise(resolve => resolve(fetchGet('/api/get/profile')));

export const getArtists = async () => new Promise(resolve => resolve(fetchGet('/api/get/artists')));

export const getEditedImage = async (url) => new Promise(resolve => {
  const queryData = [['url', url]];
  const queryParams = new URLSearchParams(queryData).toString();
  resolve(fetchGet('api/IM/get/image/?'+queryParams));
});

export const setAccessToken = async (token) => new Promise(resolve => {
  const queryData = [['access_token', token]];
  const queryParams = new URLSearchParams(queryData).toString();
  resolve(fetchGet('/api/set/access_token/?'+queryParams));
});