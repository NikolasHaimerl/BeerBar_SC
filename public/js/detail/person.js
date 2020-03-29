var personDetailTemplate = Handlebars.getTemplate('detail/person-template');

$(
    function() {

        $(document).on("click", ".person_card", function () {
            var address = $(this).data('address');

            var person = getPerson(address);
            var context = {
                role: 'person',
                person: person,
            };
            var html = personDetailTemplate(context);

            $( '#person_detail' ).html(html);
        });


        $(document).on("click", "#buy-beer-submit", function () {
            var sender_address = $(this).closest(".card").data('address');
            var bar_address = $(this).closest("#bar").data('address');
            var amount = $(this).closest(".card").find("#buy-beer-quantity").val();

            if (confirm('Send ' + amount + ' Beertokens from ' + sender_address + ' to ' + bar_address + '?')) {
                beerTokenContractInstance.transfer['address,uint256'].estimateGas(bar_address, parseInt(amount), {from: sender_address}, function(error, result) {
                    if (error) {
                        $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                    } else {
                        beerTokenContractInstance.transfer['address,uint256'](bar_address, parseInt(amount), {from: sender_address}, showError);
                    }
                });

            }
        });

        $(document).on("click", "#cancel-beer-submit", function () {
            var sender_address = $(this).closest(".card").data('address');
            var amount = $(this).closest(".card").find("#cancel-beer-quantity").val();

            songVotingContractInstance.cancelOrder.estimateGas(parseInt(amount), {from: sender_address}, function(error, result) {
                if (error) {
                    $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                } else {
                    songVotingContractInstance.cancelOrder(parseInt(amount), {from: sender_address}, showError);
                }
            });

        });


        $(document).on("click", "#buy-beertoken-submit", function () {
            var sender_address = $(this).closest(".card").data('address');
            var bar_address = $(this).closest("#bar").data('address');
            var amount = $(this).closest(".card").find("#buy-beertoken-quantity").val();

            if (confirm('Send ' + amount + ' ETH from ' + sender_address + ' to ' + bar_address + '?')) {
                songVotingContractInstance.buyToken.estimateGas({from: sender_address, value: web3.toWei(parseFloat(amount), 'ether')}, function(error, result) {
                    if (error) {
                        $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                    } else {
                        songVotingContractInstance.buyToken({from: sender_address, value: web3.toWei(parseFloat(amount), 'ether')}, showError);
                    }
                });

            }
        });

    }
);
