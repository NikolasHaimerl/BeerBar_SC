$(
    function() {

        var barOpenedEvent = songVotingContractInstance.BarOpened({});
        barOpenedEvent.watch(function(error, result){
            console.log('got barOpenedEvent!');
            if(!error) {
                $(".bar-state").html("OPEN");
                $(".bar-state").css("background-color", "#2ECC40");
            }
            else {
                $.notify({message: '<strong>Error:</strong> ' + error},{type: 'danger'});
            }
        });

        var barClosedEvent = songVotingContractInstance.BarClosed({});
        barClosedEvent.watch(function(error, result){
            console.log('got barClosedEvent!');
            if(!error) {
                $(".bar-state").html("CLOSED");
                $(".bar-state").css("background-color", "#FF4136");
            }
            else {
                $.notify({message: '<strong>Error:</strong> ' + error},{type: 'danger'});
            }
        });

        var ownerAddedEvent = songVotingContractInstance.OwnerAdded({});
        ownerAddedEvent.watch(function(error, result){
            console.log('got ownerAddedEvent!');
            if(!error) {
                console.log(result);
                addPersonTemplate("owner", result.args.account);
            }
            else {
                $.notify({message: '<strong>Error:</strong> ' + error},{type: 'danger'});
            }
        });

        var barkeeperAddedEvent = songVotingContractInstance.BarkeeperAdded({});
        barkeeperAddedEvent.watch(function(error, result){
            console.log('got BarkeeperAddedEvent!');
            if(!error) {
                console.log(result);
                addPersonTemplate("barkeeper", result.args.account);
            }
            else {
                $.notify({message: '<strong>Error:</strong> ' + error},{type: 'danger'});
            }
        });

        var ownerRemovedEvent = songVotingContractInstance.OwnerRemoved({});
        ownerRemovedEvent.watch(function(error, result){
            console.log('got ownerRemovedEvent!');
            if(!error) {
                console.log(result);
                removePersonTemplate("owner", result.args.account);
            }
            else {
                $.notify({message: '<strong>Error:</strong> ' + error},{type: 'danger'});
            }
        });

        var barkeeperRemovedEvent = songVotingContractInstance.BarkeeperRemoved({});
        barkeeperRemovedEvent.watch(function(error, result){
            console.log('got barkeeperRemovedEvent!');
            if(!error) {
                console.log(result);
                removePersonTemplate("barkeeper", result.args.account);
            }
            else {
                $.notify({message: '<strong>Error:</strong> ' + error},{type: 'danger'});
            }
        });
/*
        var roleRemovedEvent = songVotingContractInstance.RoleRemoved({});
        roleRemovedEvent.watch(function(error, result){
            console.log('got roleRemovedEvent!');
            if(!error) {
                console.log(result);
                // remove card
                removePersonTemplate(result.args.roleName, result.args.addr);
            }
            else {
                $.notify({message: '<strong>Error:</strong> ' + error},{type: 'danger'});
            }
        });
*/
        // update all ether balances on every block
        // https://ethereum.stackexchange.com/questions/27494/set-watch-for-ethereum-address-transaction-using-web3js
        const filter = web3.eth.filter('latest');
        filter.watch(function(error, result) {
            if (!error) {
                console.log(result);

                // Check if beertoken has changed
                if (beerAddress != songVotingContractInstance.beerTokenContractAddress()) {
                    // refresh whole page
                    window.location.reload(true);
                }

                $(".current-block").html(web3.eth.blockNumber.toString());

                var addresses = [songVotingContractInstance.address].concat(persons());

                addresses.forEach(function (address) {
                    $(".eth-balance-" + address).html(web3.fromWei(web3.eth.getBalance(address), "ether").toString());
                    $(".pending-beertoken-balance-" + address).html(songVotingContractInstance.pendingBeer(address).toString());
                });

                if (beerTokenContractInstance != null) {
                    addresses.forEach(function (address) {
                        $(".beertoken-balance-" + address).html(beerTokenContractInstance.balanceOf(address).toString());
                    });
                }

            }
            else {
                $.notify({message: '<strong>Error:</strong> ' + error},{type: 'danger'});
            }
        });

    }
);
