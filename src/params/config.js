const isDev = process.env.NODE_ENV === 'development';
const {
  DEFAULT_TOKEN,
  DEFAULT_QUOTE,
  FAUCET_URL,
  DEX_URL,
  DEFAULT_CHAIN_ID,
  BLOCKCHAIN_ENDPOINTS,
  GOOGLE_TAG_MANAGER_ID,
} = process.env;

/**
 * @namespace Config
 */
const Config = {
  /**
   * @type {boolean}
   * @memberof Config
   */
  isDev,

  /**
   * If set to true the app will use a set of dummy data. Use this when APIs are not working.
   *
   * @type {boolean}
   */
  useDummy: false,

  /**
   * The default token - PPY/TEST.
   *
   * @type {string}
   * @memberof Config
   */
  defaultToken: DEFAULT_TOKEN,

  /**
   * The default quote token.
   *
   * @type {string}
   * @memberof Config
   */
  defaultQuote: DEFAULT_QUOTE,

  /**
   * The default chain ID.
   *
   * @type {string}
   * @memberof Config
   */
  defaultChainID: DEFAULT_CHAIN_ID,

  /**
   * Endpoints for connecting to blockchain. Used for Peerplays login and transactions.
   *
   * @type {string[]}
   * @memberof Config
   */
  blockchainEndpoints: BLOCKCHAIN_ENDPOINTS.replace(' ', '').split(','),

  /**
   * Represents the faucet url.
   *
   * @type {string}
   * @memberof Config
   */
  faucetUrl: FAUCET_URL,

  /**
   * Represents the dex url.
   *
   * @type {string}
   * @memberof Config
   */
  dexUrl: DEX_URL,
  /**
   * Represents the google tag manager ID for QA and Production build.
   *
   * @type {string}
   * @memberof Config
   */
   googleTagManagerId: GOOGLE_TAG_MANAGER_ID
};

export default Config;