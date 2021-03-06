import json
import os
from eth_utils import denoms

API_PATH = "/api/1"
GAS_LIMIT = 250000
GAS_PRICE = 20 * denoms.gwei

NETWORK_NAMES = {
    1: 'mainnet',
    2: 'morden',
    3: 'ropsten',
    4: 'rinkeby',
    30: 'rootstock-main',
    31: 'rootstock-test',
    42: 'kovan',
    61: 'etc-main',
    62: 'etc-test',
    1337: 'geth'
}

<<<<<<< HEAD
CHANNEL_MANAGER_ADDRESS = '0x882029bab0d8b6b8edc0990c3ab9c153f78f5e19'
=======
# address of the default channel manager contract. You can change this using commandline
# option --channel-manager-address when running the proxy
CHANNEL_MANAGER_ADDRESS = '0xeb8f0c65921c6f2b6025d9dbdd9466419cbe56ec'
# absolute path to this directory. Used to find path to the webUI sources
>>>>>>> 2a92e01c5e38ea782c596f4d50f74d529cfad0e5
MICRORAIDEN_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
# webUI sources
HTML_DIR = os.path.join(MICRORAIDEN_DIR, 'microraiden', 'webui')
# javascript library for microraiden
JSLIB_DIR = os.path.join(HTML_DIR, 'js')
# url prefix for jslib dir
JSPREFIX_URL = '/js'
# decimals of the token. Any price that's set for the proxy resources is multiplied by this.
TKN_DECIMALS = 10**18  # token decimals

# ethereum node RPC interface should be available here
WEB3_PROVIDER_DEFAULT = "http://127.0.0.1:8545"

# name of the channel manager contract
CHANNEL_MANAGER_ABI_NAME = 'RaidenMicroTransferChannels'
# name of the token contract
TOKEN_ABI_NAME = 'CustomToken'
# compiled contracts path
CONTRACTS_ABI_JSON = 'data/contracts.json'

with open(os.path.join(MICRORAIDEN_DIR, 'microraiden', CONTRACTS_ABI_JSON)) as metadata_file:
    CONTRACT_METADATA = json.load(metadata_file)

# required version of the deployed contract at CHANNEL_MANAGER_ADDRESS.
# Proxy will refuse to start if the versions do not match.
MICRORAIDEN_VERSION = "0.1.0"
CHANNEL_MANAGER_CONTRACT_VERSION = MICRORAIDEN_VERSION
# they should stay the same until we decide otherwise
assert MICRORAIDEN_VERSION == CHANNEL_MANAGER_CONTRACT_VERSION
#  proxy will stop serving requests if receiver balance is below PROXY_BALANCE_LIMIT
PROXY_BALANCE_LIMIT = 10**6
SLEEP_RELOAD = 2


# sanity checks
assert PROXY_BALANCE_LIMIT > 0
assert isinstance(PROXY_BALANCE_LIMIT, int)
