import logging

from microraiden.channel_manager import (
    ChannelManager,
)

from flask_restful import Resource
from eth_utils import is_address
from .paywall_decorator import paywall_decorator

log = logging.getLogger(__name__)


class LightClientProxy:
    def __init__(self, index_html):
        with open(index_html) as fp:
            self.data = fp.read()

    def get(self, url):
        return self.data


class Expensive(Resource):
    method_decorators = [paywall_decorator]

    def __init__(self,
                 channel_manager: ChannelManager,
                 light_client_proxy=None,
                 paywall=None,
                 price: None = None,
                 ) -> None:
        super(Expensive, self).__init__()
        assert isinstance(channel_manager, ChannelManager)
        assert price is None or callable(price) or price > 0
        self.contract_address = channel_manager.channel_manager_contract.address
        self.receiver_address = channel_manager.receiver
        assert is_address(self.contract_address)
        assert is_address(self.receiver_address)
        self.channel_manager = channel_manager
        self.light_client_proxy = light_client_proxy
        self._price = price
        self.paywall = paywall

    def get_paywall(self, url):
        return self.light_client_proxy.get(url)

<<<<<<< HEAD
        accepts_html = r'text/html' in request.headers.get('Accept', '')

        if not data.balance_signature:
            print('reply_payment_required', 1)
            return self.reply_payment_required(content, proxy_handle, gen_ui=accepts_html)

        # try to get an existing channel
        try:
            channel = self.channel_manager.verify_balance_proof(
                data.sender_address, data.open_block_number,
                data.balance, data.balance_signature)
        except InsufficientConfirmations as e:
            headers = {header.INSUF_CONFS: "1"}
            print('reply_payment_required', 2)
            return self.reply_payment_required(
                content, proxy_handle, headers=headers, gen_ui=accepts_html)
        except NoOpenChannel as e:
            print('reply_payment_required', 3)
            return self.reply_payment_required(content, proxy_handle,
                                               headers={header.NONEXISTING_CHANNEL: 1},
                                               gen_ui=accepts_html)
        except InvalidBalanceAmount as e:
            print('reply_payment_required', 4)
            # balance sent to the proxy is less than in the previous proof
            return self.reply_payment_required(content, proxy_handle, headers, gen_ui=accepts_html)
        except InvalidBalanceProof as e:
            print('reply_payment_required', 5)
            return self.reply_payment_required(content, proxy_handle,
                                               headers={header.INVALID_PROOF: 1},
                                               gen_ui=accepts_html)

        # set the headers to reflect actual state of a channel
        headers = self.generate_headers(channel, proxy_handle)
        try:
            self.channel_manager.register_payment(
                channel.sender,
                data.open_block_number,
                data.balance,
                data.balance_signature)
        except InvalidBalanceAmount as e:
            # balance sent to the proxy is less than in the previous proof
            print('reply_payment_required', 6)
            return self.reply_payment_required(content, proxy_handle, headers, gen_ui=accepts_html)
        except InvalidBalanceProof as e:
            print('reply_payment_required', 7)
            return self.reply_payment_required(content, proxy_handle, headers, gen_ui=accepts_html)

        # all ok, return premium content
        return self.reply_premium(content, proxy_handle, headers)

    def generate_headers(self, channel: Channel, proxy_handle: PaywalledContent):
        assert channel.sender is not None
        assert channel.balance >= 0
        headers = {
            header.GATEWAY_PATH: config.API_PATH,
            header.RECEIVER_ADDRESS: self.receiver_address,
            header.CONTRACT_ADDRESS: self.contract_address,
            header.PRICE: proxy_handle.price,
            header.SENDER_ADDRESS: channel.sender,
            header.SENDER_BALANCE: channel.balance,
        }
        if channel.last_signature is not None:
            headers.update({header.BALANCE_SIGNATURE: channel.last_signature})
        return headers

    def reply_premium(self, content, proxy_handle, headers):
        response = proxy_handle.get(content)
        if isinstance(response, Response):
            return response
        else:
            data, status_code = response
            return data, status_code, headers

    def reply_payment_required(self, content, proxy_handle, headers=None, gen_ui=False):
        print('reply_payment_required**********', gen_ui)
        if headers is None:
            headers = {}
        assert isinstance(headers, dict)
        assert isinstance(gen_ui, bool)
        if callable(proxy_handle.price):
            price = proxy_handle.price(content)
        elif isinstance(proxy_handle.price, int):
            price = proxy_handle.price
        else:
            return "Invalid price attribute", 500
        headers.update({
            header.GATEWAY_PATH: config.API_PATH,
            header.CONTRACT_ADDRESS: self.contract_address,
            header.RECEIVER_ADDRESS: self.receiver_address,
            header.PRICE: price,
            header.TOKEN_ADDRESS: self.channel_manager.get_token_address()
        })
        if gen_ui is True:
            return self.get_webUI_reply(content, proxy_handle, price, headers)
        else:
            return make_response('', 402, headers)

    # web response return
    def get_webUI_reply(self, content: str, proxy_handle: PaywalledContent,
                        price: int, headers: dict):
        headers.update({
            "Content-Type": "text/html",
        })
        data = proxy_handle.get_paywall(
            content,
            self.receiver_address,
            price,
            self.channel_manager.get_token_address()
        )
        reply = make_response(data, 402, headers)
        for hdr in (header.GATEWAY_PATH,
                    header.CONTRACT_ADDRESS,
                    header.RECEIVER_ADDRESS,
                    header.PRICE,
                    header.NONEXISTING_CHANNEL,
                    header.TOKEN_ADDRESS):
            if hdr in headers:
                reply.set_cookie(hdr, str(headers[hdr]))
        return reply
=======
    def price(self):
        if callable(self._price):
            return self._price()
        else:
            return self._price
>>>>>>> 2a92e01c5e38ea782c596f4d50f74d529cfad0e5
