function mainSwitch(id) {
  $(".main_switch" + id).show();
  $(".main_switch:not(" + id + ")").hide();
  $(".container").show();
}

function pageReady(contractABI, tokenABI) {

  // ==== BASIC INITIALIZATION ====

  // you can set this variable in a new 'script' tag, for example
  window.uRaidenParams = {
    contract: Cookies.get("RDN-Contract-Address"),
    token: Cookies.get("RDN-Token-Address"),
    receiver: Cookies.get("RDN-Receiver-Address"),
    amount: Cookies.get("RDN-Price"),
  };

  window.uraiden = new microraiden.MicroRaiden(
    window.web3,
    uRaidenParams.contract,
    contractABI,
    uRaidenParams.token,
    tokenABI,
  );

  // ==== MAIN VARIABLES ====

  var $accounts = $("#accounts");
  var autoSign = false;

  // ==== FUNCTIONS ====

  function errorDialog(text, err) {
    var msg = err && err.message ?
      err.message.split(/\r?\n/)[0] :
      typeof err === "string" ?
        err.split(/\r?\n/)[0] :
        JSON.stringify(err);
    return window.alert(text+ ':\n' + msg);
  }

  function refreshAccounts(_autoSign) {

    autoSign = !!_autoSign;
<<<<<<< HEAD
    console.log('first step,refreshAccounts');
    $select.empty();
    uraiden.getAccounts((err, accounts) => {
      if (err || !accounts || !accounts.length) {
        mainSwitch("#no_accounts");
        // retry after 1s
        setTimeout(refreshAccounts, 1000);
      } else {
        mainSwitch("#channel_loading");
        $.each(accounts, (k, v) => {
          const o = $("<option></option>").attr("value", v).text(v);
          $select.append(o);
          if (k === 0) {
            $select.change();
          }
=======

    $accounts.empty();
    // use challenge period to assert configured channel
    // is valid in current provider's network
    uraiden.getChallengePeriod()
      .then(function() { return uraiden.getAccounts(); })
      .then(function(accounts) {
        if (!accounts || !accounts.length) {
          throw new Error('No account');
        }
        mainSwitch("#channel_loading");
        $.each(accounts, function(k,v) {
          var o = $("<option></option>").attr("value", v).text(v);
          $accounts.append(o);
          if (k === 0) {
            $accounts.change();
          };
>>>>>>> 2a92e01c5e38ea782c596f4d50f74d529cfad0e5
        });
      })
      .catch(function(err) {
        if (err.message && err.message.includes('account'))
          mainSwitch("#no_accounts");
        else
          mainSwitch("#invalid_contract");
        // retry after 1s
        setTimeout(refreshAccounts, 1000);
      });
  }

<<<<<<< HEAD
  function signRetry() {
    console.log('signRetry');
    autoSign = false;
    uraiden.incrementBalanceAndSign(uRaidenParams.amount, (err, sign) => {//消费token并签名
      if (err && err.message && err.message.includes('Insuficient funds')) {
        console.error(err);
        const current = +(err.message.match(/current ?= ?([\d.,]+)/i)[1]);
        const required = +(err.message.match(/required ?= ?([\d.,]+)/i)[1]) - current;
        $('#deposited').text(current);
        $('#required').text(required);
        $('#remaining').text(current - uraiden.channel.balance);
        return mainSwitch("#topup");
      } else if (err && err.message && err.message.includes('User denied message signature')) {
        console.error(err);
        $('.channel_present_sign').addClass('green-btn');
        return;
      } else if (err) {
        console.error(err);
        errorDialog("An error occurred trying to sign the transfer", err);
        return refreshAccounts();
      }
      $('.channel_present_sign').removeClass('green-btn');
      console.log("SIGNED!", sign);
      Cookies.set("RDN-Sender-Address", uraiden.channel.account);
      Cookies.set("RDN-Open-Block", uraiden.channel.block);
      Cookies.set("RDN-Sender-Balance", uraiden.channel.balance);
      Cookies.set("RDN-Balance-Signature", sign);
      Cookies.remove("RDN-Nonexisting-Channel");
      //location.reload();
    });
  }

  function closeChannel(closeSign) {
    console.log('closeChannel action');
    uraiden.closeChannel(closeSign, (err, res) => {
      if (err) {
=======
  function signRetry(amount) {
    autoSign = false;
    uraiden.incrementBalanceAndSign(!isNaN(amount) ? amount : uRaidenParams.amount)
      .then(function(proof) {
        $('.channel_present_sign').removeClass('green-btn')
        console.log("SIGNED!", proof);
        Cookies.set("RDN-Sender-Address", uraiden.channel.account);
        Cookies.set("RDN-Open-Block", uraiden.channel.block);
        Cookies.set("RDN-Sender-Balance", proof.balance.toString());
        Cookies.set("RDN-Balance-Signature", proof.sig);
        Cookies.remove("RDN-Nonexisting-Channel");
        mainSwitch("#channel_loading");
        location.reload();
      })
      .catch(function(err) {
        if (err.message && err.message.includes('Insuficient funds')) {
          console.error(err);
          var current = err['current'];
          var missing = err['required'].sub(current);
          $('#deposited').text(uraiden.tkn2num(current));
          $('#required').text(uraiden.tkn2num(missing));
          $('#remaining').text(uraiden.tkn2num(current.sub(uraiden.channel.proof.balance)));
          mainSwitch("#topup");
        } else if (err.message && err.message.includes('User denied message signature')) {
          console.error(err);
          $('.channel_present_sign').addClass('green-btn');
        } else {
          console.error(err);
          errorDialog("An error occurred trying to sign the transfer", err);
          refreshAccounts();
        }
      });
  }

  function closeChannel(closingSig) {
    return uraiden.closeChannel(closingSig)
      .then(function(res) {
        console.log("CLOSED", res);
        refreshAccounts();
        return res;
      })
      .catch(function(err) {
>>>>>>> 2a92e01c5e38ea782c596f4d50f74d529cfad0e5
        errorDialog("An error occurred trying to close the channel", err);
        refreshAccounts();
        throw err;
      });
  }

  // ==== BINDINGS ====

<<<<<<< HEAD
  $select.change(($event) => {
    console.log('second step,load account info');
    const account = $event.target.value;

    console.log('4 step,load store channel');
    uraiden.loadStoredChannel(account, uRaidenParams.receiver);//获取当前开通的channel,localStorage,需要优化

    uraiden.getTokenInfo(account, (err, token) => {
      console.log('5 step,getTokenInfo', token);
      if (err) {
        console.error('Error getting token info', err);
      } else {
        $('.tkn-name').text(token.name);
        $('.tkn-symbol').text(token.symbol);
        $('.tkn-balance').attr("value", `${token.balance || 0} ${token.symbol}`);
        $('.tkn-decimals')
          .attr("min", Math.pow(10, -token.decimals).toFixed(token.decimals));
      }
      console.log('get account balance ', $('.tkn-balance').attr("value"));
=======
  $accounts.change(function($event) {
    var account = $event.target.value;

    uraiden.loadStoredChannel(account, uRaidenParams.receiver);
    if (uraiden.isChannelValid() && Cookies.get("RDN-Balance-Signature")) {
      uraiden.verifyProof({
        balance: new microraiden.BigNumber(Cookies.get("RDN-Sender-Balance")),
        sig: Cookies.get("RDN-Balance-Signature"),
      });
    }

    (uraiden.isChannelValid() ?
      Promise.reject(uraiden.channel) :
      uraiden.loadChannelFromBlockchain(account, uRaidenParams.receiver)
    ).then(
      function() { // resolved == loadFromBlockchain successful, retry page with balance=0
        signRetry(0);
        throw new Error('loadChannelFromBlockchain successful');
      },
      function() { // rejected == isChannelValid or loadChannelFromBlockchain didn't find anything,
        // continue normal loading, for channel creation
        return uraiden.getTokenInfo(account);
      }
    ).then(function(token) {
      $('.tkn-name').text(token.name);
      $('.tkn-symbol').text(token.symbol);
      $('.tkn-balance').attr("value", uraiden.tkn2num(token.balance) + ' ' + token.symbol);
      $('.tkn-decimals')
        .attr("min", Math.pow(10, -token.decimals).toFixed(token.decimals));
      $("#amount").text(uraiden.tkn2num(uRaidenParams["amount"]));

>>>>>>> 2a92e01c5e38ea782c596f4d50f74d529cfad0e5
      if (uraiden.isChannelValid() &&
        uraiden.channel.account === $event.target.value &&
        uraiden.channel.receiver === uRaidenParams.receiver) {
        console.log('channel info', uraiden.channel);

        return uraiden.getChannelInfo()
          .then(function(info) {
            if (Cookies.get("RDN-Nonexisting-Channel")) {
              Cookies.remove("RDN-Nonexisting-Channel");
              window.alert("Server won't accept this channel.\n" +
                "Please, close+settle+forget, and open a new channel");
              $('#channel_present .channel_present_sign').attr("disabled", true);
              autoSign = false;
            }
            return info;
          })
          .catch(function(err) {
            console.error(err);
<<<<<<< HEAD
            info = {state: "error", deposit: 0}
          } else if (Cookies.get("RDN-Nonexisting-Channel")) {
            Cookies.remove("RDN-Nonexisting-Channel");
            window.alert("Server won't accept this channel.\n" +
              "Please, close+settle+forget, and open a new channel");
            $('#channel_present .channel_present_sign').attr("disabled", true);
            autoSign = false;
          }
          console.log('6 step getChannelInfo', info);
          $(`#channel_present .on-state.on-state-${info.state}`).show();
          $(`#channel_present .on-state:not(.on-state-${info.state})`).hide();

          let remaining = 0;
          if (info.deposit > 0 && uraiden.channel && !isNaN(uraiden.channel.balance)) {
            remaining = info.deposit - uraiden.channel.balance;
          }
          console.log('now remaining token ', info.deposit, '-', uraiden.channel.balance);//消费的token存在localStorage里
          $("#channel_present #channel_present_balance").text(remaining);
          $("#channel_present #channel_present_deposit").attr("value", info.deposit);
          $(".btn-bar").show()
          if (info.state === 'opened' && autoSign) {
            //signRetry();
          }
          console.log("channel present");
          mainSwitch("#channel_present");
        });
=======
            return { state: "error", deposit: uraiden.num2tkn(0) };
          })
          .then(function(info) {
            $('#channel_present .on-state.on-state-' + info.state).show();
            $('#channel_present .on-state:not(.on-state-'+ info.state + ')').hide();

            var remaining = 0;
            if (info.deposit.gt(0) && uraiden.channel && uraiden.channel.proof
                && uraiden.channel.proof.balance.isFinite()) {
              remaining = info.deposit.sub(uraiden.channel.proof.balance);
            }
            $("#channel_present #channel_present_balance").text(uraiden.tkn2num(remaining));
            $("#channel_present #channel_present_deposit").attr(
              "value", uraiden.tkn2num(info.deposit));
            $(".btn-bar").show()
            if (info.state === 'opened' && autoSign) {
              signRetry();
            }
            mainSwitch("#channel_present");
          });
>>>>>>> 2a92e01c5e38ea782c596f4d50f74d529cfad0e5
      } else {
        console.log("channel missing");
        mainSwitch("#channel_missing");
      }
    },
    function(err) {
      console.error('Error getting token info', err);
      throw err;
    });
  });

  $("#channel_missing_deposit").bind("input", function($event) {
    if (+$event.target.value > 0) {
      $("#channel_missing_start").attr("disabled", false);
    } else {
      $("#channel_missing_start").attr("disabled", true);
    }
  });
  $("#channel_missing_start").attr("disabled", false);

<<<<<<< HEAD
  $("#channel_missing_start").click(() => {//open channel
    const deposit = +$("#channel_missing_deposit").val();
    const account = $("#accounts").val();
=======
  $("#channel_missing_start").click(function() {
    var deposit = uraiden.num2tkn($("#channel_missing_deposit").val());
    var account = $("#accounts").val();
>>>>>>> 2a92e01c5e38ea782c596f4d50f74d529cfad0e5
    mainSwitch("#channel_opening");
    uraiden.openChannel(account, uRaidenParams.receiver, deposit)
      .then(function(channel) {
        Cookies.remove("RDN-Nonexisting-Channel");
        refreshAccounts(true);
      })
      .catch(function(err) {
        console.error(err);
        errorDialog("An error ocurred trying to open a channel", err);
        refreshAccounts();
      });
  });

  $(".channel_present_sign").click(signRetry);

  $(".channel_present_close").click(function() {
    if (!window.confirm("Are you sure you want to close this channel?")) {
      return;
    }
    console.log('click close channel');
    mainSwitch("#channel_opening");
<<<<<<< HEAD
    // signBalance without balance, sign current balance only if needed
    uraiden.signBalance(null, (err, sign) => {//关闭channel需要最后一次签名，使用当前已使用的token进行签名
      if (err) {
        errorDialog("An error occurred trying to get balance signature", err);
        return refreshAccounts();
      }
      Cookies.set("RDN-Sender-Address", uraiden.channel.account);
      Cookies.set("RDN-Open-Block", uraiden.channel.block);
      Cookies.set("RDN-Sender-Balance", uraiden.channel.balance);
      Cookies.set("RDN-Balance-Signature", sign);
      // call cooperative-close URL, and closeChannel with close_signature data
      $.ajax({
        url: `/api/1/channels/${uraiden.channel.account}/${uraiden.channel.block}`,
        method: 'DELETE',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({'balance': uraiden.channel.balance}),
        success: (result) => {
          let closeSign = null;
=======
    // if cooperative close signature exists, use it (api will fail)
    if (uraiden.channel.closing_sig) {
      return closeChannel(uraiden.channel.closing_sig);
    }
    // signNewProof without balance, sign (if needed) and return current balance
    return uraiden.signNewProof(null)
      .catch(function(err) {
        errorDialog("An error occurred trying to get balance signature", err);
        refreshAccounts();
        throw err;
      })
      .then(function(proof) {
        // call cooperative-close URL, and closeChannel with close_signature data
        return $.ajax({
          url: '/api/1/channels/' + uraiden.channel.account + '/' + uraiden.channel.block,
          method: 'DELETE',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify({ 'balance': proof.balance.toNumber() }),
        })
        .done(function(result) {
          var closingSig = null;
>>>>>>> 2a92e01c5e38ea782c596f4d50f74d529cfad0e5
          if (result && typeof result === 'object' && result['close_signature']) {
            closingSig = result['close_signature'];
          } else {
            console.warn('Invalid cooperative-close response', result);
          }
          return closeChannel(closingSig);
        })
        .fail(function(request, msg, error) {
          console.warn('Error calling cooperative-close', request, msg, error);
<<<<<<< HEAD
          alert('close channel error');
          closeChannel(null);
        }
=======
          return closeChannel(null);
        });
>>>>>>> 2a92e01c5e38ea782c596f4d50f74d529cfad0e5
      });
  });

  $(".channel_present_settle").click(function() {
    if (!window.confirm("Are you sure you want to settle this channel?")) {
      return;
    }
    mainSwitch("#channel_opening");
    uraiden.settleChannel()
      .then(function(res) {
        console.log("SETTLED", res);
        refreshAccounts();
      })
      .catch(function(err) {
        errorDialog("An error occurred trying to settle the channel", err);
        refreshAccounts();
      });
  });

  $(".channel_present_forget").click(function() {
    if (!window.confirm("Are you sure you want to forget this channel?" +
        ($('.on-state-settled').is(':visible') ? "" :
          "\nWarning: channel will be left in an unsettled state."))) {
      return;
    }
    Cookies.remove("RDN-Sender-Address");
    Cookies.remove("RDN-Open-Block");
    Cookies.remove("RDN-Sender-Balance");
    Cookies.remove("RDN-Balance-Signature");
    Cookies.remove("RDN-Nonexisting-Channel");
    uraiden.forgetStoredChannel();//just remove localStorage ,not settled status
    refreshAccounts();
  });

  $("#topup_deposit").bind("input", function($event) {
    if (+$event.target.value > 0) {
      $("#topup_start").attr("disabled", false);
    } else {
      $("#topup_start").attr("disabled", true);
    }
  });

<<<<<<< HEAD
  //store more token ,some to open channel
  $("#topup_start").click(() => {
    const deposit = +$("#topup_deposit").val();
=======
  $("#topup_start").click(function() {
    var deposit = uraiden.num2tkn($("#topup_deposit").val());
>>>>>>> 2a92e01c5e38ea782c596f4d50f74d529cfad0e5
    mainSwitch("#channel_opening");
    uraiden.topUpChannel(deposit)
      .then(function() {
        refreshAccounts(true);
      })
      .catch(function(err) {
        refreshAccounts();
        console.error(err);
        errorDialog("An error ocurred trying to deposit to channel", err);
      });
  });

  $(".token_buy").click(function() {
    var account = $accounts.val();
    mainSwitch("#channel_opening");
    uraiden.buyToken(account)
      .then(refreshAccounts)
      .catch(function(err) {
        console.error(err);
        errorDialog("An error ocurred trying to buy tokens", err);
      });
  });

  // ==== FINAL SETUP ====

<<<<<<< HEAD
  $("#amount").text(uRaidenParams["amount"]);
  $('[data-toggle="tooltip"]').tooltip();
  refreshAccounts(true);//loading account
}
=======
  refreshAccounts(true);
  $('[data-toggle="tooltip"]').tooltip();

};
>>>>>>> 2a92e01c5e38ea782c596f4d50f74d529cfad0e5


mainSwitch("#channel_loading");

$(function() {
  $.getJSON("/api/1/stats").done(function(json) {
    var cnt = 20;
    // wait up to 20*200ms for web3 and call ready()
    var pollingId = setInterval(function() {
      if (Cookies.get("RDN-Insufficient-Confirmations")) {
        Cookies.remove("RDN-Insufficient-Confirmations");
        clearInterval(pollingId);
        $("body").html('<h1>Waiting confirmations...</h1>');
        setTimeout(function() { location.reload(); }, 5000);
      } else if (cnt <= 0 || window.web3) {
        clearInterval(pollingId);
        pageReady(json['manager_abi'], json['token_abi']);
      } else {
        --cnt;
      }
    }, 200);
  });
});
