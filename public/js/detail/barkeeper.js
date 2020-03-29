var barkeeperDetailTemplate = Handlebars.getTemplate('detail/barkeeper-template');

$(
    function() {

        $(document).on("click", ".barkeeper_card", function () {
            var address = $(this).data('address');

            var person = getPerson(address);
            var context = {
                role: 'owner',
                person: person,
                persons: persons()
            };
            var html = barkeeperDetailTemplate(context);

            $( '#person_detail' ).html(html);
        });

        $(document).on("click", "#open-bar-submit", function () {
            var sender_address = $(this).closest(".card").data('address');

            songVotingContractInstance.openBar.estimateGas({from: sender_address}, function(error, result) {
                if (error) {
                    $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                } else {
                    songVotingContractInstance.openBar({from: sender_address}, showError);
                }
            });
        });

        $(document).on("click", "#close-bar-submit", function () {
            var sender_address = $(this).closest(".card").data('address');

            songVotingContractInstance.closeBar.estimateGas({from: sender_address}, function(error, result) {
                if (error) {
                    $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                } else {
                    songVotingContractInstance.closeBar({from: sender_address}, showError);
                }
            });
        });

        $(document).on("click", "#serve-beer-submit", function () {
            var sender_address = $(this).closest(".card").data('address');
            var recipient_address = $(this).closest(".card").find("#serve-beer-recipient-select").val();
            var amount = $(this).closest(".card").find("#serve-beer-quantity").val();

            songVotingContractInstance.serveBeer.estimateGas(recipient_address, amount, {from: sender_address}, function(error, result) {
                if (error) {
                    $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                } else {
                    songVotingContractInstance.serveBeer(recipient_address, amount, {from: sender_address}, showError);
                }
            });
        });

        $(document).on("click", "#renounce-barkeeper-submit", function () {
            var sender_address = $(this).closest(".card").data('address');

            songVotingContractInstance.renounceBarkeeper.estimateGas({from: sender_address}, function(error, result) {
                if (error) {
                    $.notify({message: '<strong>Gas estimation failed:</strong> ' + error},{type: 'danger'});
                } else {
                    songVotingContractInstance.renounceBarkeeper({from: sender_address}, showError);
                }
            });
        });

    }
);
