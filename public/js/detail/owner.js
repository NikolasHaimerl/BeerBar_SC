var ownerDetailTemplate = Handlebars.getTemplate('detail/owner-template');

$(
    function() {

        $(document).on("click", ".owner_card", function () {
            var address = $(this).data('address');

            var beerTokenAddress = "";
            if (beerTokenContractInstance != null) {
                beerTokenAddress = beerTokenContractInstance.address;
            }

            var person = getPerson(address);
            var context = {
                role: 'owner',
                person: person,
                persons: persons(),
                currentBeerPrice: web3.fromWei(songVotingContractInstance.getBeerPrice(), "ether"),
                beerTokenAddress: beerTokenAddress
            };
            var html = ownerDetailTemplate(context);

            $( '#person_detail' ).html(html);
        });

        $(document).on("click", "#supply-beer-submit", function () {
            var sender_address = $(this).closest(".card").data('address');
            var bar_address = $(this).closest("#bar").data('address');
            var amount = $(this).closest(".card").find("#supply-beer-quantity").val();

            if (confirm('Send ' + amount + ' Beertokens from ' + sender_address + ' to ' + bar_address + '?')) {
                beerTokenContractInstance.transfer['address,uint256,bytes'].estimateGas(bar_address, parseInt(amount), web3.toHex('supply'), {from: sender_address}, function(error, result) {
                    if (error) {
                        $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                    } else {
                        beerTokenContractInstance.transfer['address,uint256,bytes'](bar_address, parseInt(amount), web3.toHex('supply'), {from: sender_address}, showError);
                    }
                });

            }
        });

        $(document).on("click", "#set-beer-price-submit", function () {
            var sender_address = $(this).closest(".card").data('address');
            var amount = $(this).closest(".card").find("#set-beer-price-quantity").val();

            songVotingContractInstance.setBeerPrice.estimateGas(web3.toWei(amount, 'ether'), {from: sender_address}, function(error, result) {
                if (error) {
                    $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                } else {
                    songVotingContractInstance.setBeerPrice(web3.toWei(amount, 'ether'), {from: sender_address}, showError);
                }
            });

        });

        $(document).on("click", "#payout-submit", function () {
            var sender_address = $(this).closest(".card").data('address');
            var recipient_address = $(this).closest(".card").find("#payout-recipient-select").val();
            var amount = $(this).closest(".card").find("#payout-quantity").val();

            songVotingContractInstance.payout.estimateGas(recipient_address, web3.toWei(amount, 'ether'), {from: sender_address}, function(error, result) {
                if (error) {
                    $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                } else {
                    songVotingContractInstance.payout(recipient_address, web3.toWei(amount, 'ether'), {from: sender_address}, showError);
                }
            });

        });

        $(document).on("click", "#promote-submit", function () {
            var sender_address = $(this).closest(".card").data('address');
            var recipient_address = $(this).closest(".card").find("#promote-recipient-select").val();
            var role = $(this).closest(".card").find("#promote-role-select").val();

            if (role === "barkeeper") {
                songVotingContractInstance.addBarkeeper.estimateGas(recipient_address, {from: sender_address}, function(error, result) {
                    if (error) {
                        $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                    } else {
                        songVotingContractInstance.addBarkeeper(recipient_address, {from: sender_address}, showError);
                    }
                });
            } else if (role === "owner") {
                songVotingContractInstance.addOwner.estimateGas(recipient_address, {from: sender_address}, function(error, result) {
                    if (error) {
                        $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                    } else {
                        songVotingContractInstance.addOwner(recipient_address, {from: sender_address}, showError);
                    }
                });
            }
        });

        $(document).on("click", "#renounce-owner-submit", function () {
            var sender_address = $(this).closest(".card").data('address');

            songVotingContractInstance.renounceOwner.estimateGas({from: sender_address}, function(error, result) {
                if (error) {
                    $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                } else {
                    songVotingContractInstance.renounceOwner({from: sender_address}, showError);
                }
            });
        });

        $(document).on("click", "#beertoken-address-submit", function () {
            var sender_address = $(this).closest(".card").data('address');
            var beertoken_address = $(this).closest(".card").find("#beertoken-address").val();

            songVotingContractInstance.setBeerTokenContractAddress.estimateGas(beertoken_address, {from: sender_address}, function(error, result) {
                if (error) {
                    $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                } else {
                    songVotingContractInstance.setBeerTokenContractAddress(beertoken_address, {from: sender_address}, showError);
                }
            });

        });

    }
);
