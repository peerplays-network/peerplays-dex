export const en = {
    "global": {
        "tbd": "TBD"
    },
    "layout": {
        "notifications": "Notifications",
        "notificationsSearch": "Start Typing",
        "searchPlaceholder": "Search",
        "switchAccount": "Switch Account",
        "sidechainAccounts": "Sidechain Accounts"
    },
    "tableHead": {
        "asset": "Asset",
        "available": "Available",
        "priceWithToken": "Price (%(token)s)",
        "amountWithToken": "Amount (%(token)s)",
        "change": "Change (24h)",
        "volume": "Volume (asset/%(token)s)",
        "valueWithToken": "Value (%(token)s)",
        "value": "Value",
        "actions": "Actions",
        "trade": "Trade",
        "orderID": "Order ID",
        "description": "Description",
        "price": "Price",
        "marketPrice": "Market Price",
        "hash": "#",
        "name": "Name",
        "url": "URL",
        "lastBlock": "Last Block",
        "missingBlock": "Missing Block",
        "votes": "Votes",
        "voteCount":"Vote Count",
        "key": "Key",
        "time": "Time",
        "type": "Activity",
        "info": "Info",
        "id": "ID",
        "fee": "Fee",
        "weight": "Weight",
        "webpage": "Webpage",
        "operation": "Operation",
        "standardFee": "Standard Fee (bitUSD)",
        "memberFee": "Member Fee (bitUSD)",
        "blockID": "Block ID",
        "date": "Date",
        "blockTimestamp": "Time",
        "witness": "Witness",
        "transaction": "Transaction",
        "user": "User",
        "details": "Details",
        "issuer": "Issuer",
        "supply": "Supply",
        "maxSupply": "Max Supply",
        "balance": "Balance",
        "debt": "Debt",
        "collateral": "Collateral (%(token)s)",
        "ratio": "Ratio",
        "callPrice": "Call Price",
        "expiration": "Expiration",
        "kill": "Delete",
        "param": "%(param)s",
        "total": "Total (%(token)s)",
        "name_description": "Name / Description",
        "duration": "Duration",
        "funding": "Funding",
        "daily_pay": "Daily Pay",
        "remaining": "Remaining",
        "status": "Status",
        "bidder": "Bidder",
        "bidPrice": "Call Price",
        "included": "Included",
        "publisher": "Publisher",
        "settlementPrice": "Settlement price (%(token)s)",
        "cer": "CER (%(token)s)",
        "mcr": "MCR",
        "mssr": "MSSR",
        "assetType": "Asset Type"
    },
    "tableInfo": {
        "account_create": {
            "title": "Account Creation",
            "description": "%(registrar)s registered the account %(user)s",
        },
        "send": {
            "title": "Send",
            "description": "%(sender)s send %(quantity)s to %(receiver)s",
        },
        "receive": {
            "title": "Receive",
            "description": "%(receiver)s received %(quantity)s from %(sender)s",
        },
        "limit_order_create": {
            "title": "Create Order",
            "description": "%(creator)s placed order #%(id)s at %(marketLink)s to buy %(buy)s for %(sell)s",
        },
        "limit_order_cancel": {
            "title": "Cancel Order",
            "description": "%(user)s cancelled order #%(id)s",
        },
        "fill_order": {
            "title": "Order Filled",
            "description": "%(user)s bought %(pays)s for %(receives)s at %(marketLink)s for order #%(id)s",
        },
        "account_update": {
            "title": "Account Updated",
            "description": "%(user)s updated account data",
        },
        "account_upgrade": {
            "title": "Account Upgraded",
            "description": "%(user)s upgraded account to lifetime member",
        },
        "worker_create": {
            "title": "Worker Created",
            "description": "%(user)s created a worker proposal with daily pay of %(dailyPay)s",
        },
        "proposal_create": {
            "title": "Proposal Create",
            "description": ""
        },
        "balance_claim": {
            "title": "Balance claim",
            "description": ""
        },
        "transfer": {
            "title": "Transfer",
            "description": ""
        },
        "asset_fund_fee_pool": {
            "title": "Fund Asset Fee Pool",
            "description": "%(from)s funded %(symbol)s fee pool with %(amount)s"
        },
        "account_whitelist": {
            "title": "Account Whitelist",
            "description": "%(issuer)s %(status)s the account %(listed)s"
        },
        "asset_create": {
            "title": "Asset Create",
            "description": "%(issuer)s created the asset %(assetName)s"
        },
        "asset_issue": {
            "title": "Issue Asset",
            "description": "%(issuer)s issued %(assetAmount)s to %(receiver)s"
        },
        "asset_update": {
            "title": "Update Asset",
            "description": "%(issuer)s updated asset %(asset)s"
        },
        "asset_claim_pool": {
            "title": "Claim asset fee pool",
            "description": "%(issuer)s claimed %(claimed)s from %(asset)s fee pool"
        },
        "asset_update_issuer": {
            "title": "Update asset issuer",
            "description": "%(issuer)s transferred rights for %(asset)s to %(newOwner)s"
        },
        "asset_update_feed_producers": {
            "title": "Update asset feed producers",
            "description": "%(issuer)s updated the feed producers for the asset %(asset)s"
        }
    },
    "dashboard": {
        "title": "Dashboard",
        "sendForm": {
            "from": "From",
            "quantity": "Quantity",
            "currency": "Currency",
            "to": "To",
            "TEST": "TEST"
        }
    },
    "quickSellBuy": {
        "sell": "Sell",
        "buy": "Buy"
    },
    "block": {
        "general": {
            "title": "General info",
            "type": "Type",
            "precision": "Precision",
            "issuer": "Issuer",
            "backingAsset": "Backing asset",
            "currentSupply": "Current supply",
            "stealthSupply": "Stealth supply",
            "maxFee": "Max market fee",
            "maxSupply": "Max supply"
        },
        "permissions": {
            "title": "Permissions",
            "charge_market_fee": "Enable market fee",
            "white_list": "Require holders to be white-listed",
            "override_authority": "Issuer may transfer asset back to himself",
            "transfer_restricted": "Issuer must approve all transfers",
            "disable_confidential": "Disable force settling",
            "disable_force_settle": "Allow issuer to force a global settling",
            "global_settle": "Disable confidential transactions",
            "witness_fed_asset": "Allow witnesses to provide feeds",
            "committee_fed_asset": "Allow committee members to provide feeds"
        },
        "fee": {
            "title": "Fee Pool",
            "text": "The fee pool is used to pay fees in TEST by converting the fee in BTC to TEST. If the fee pool runs out of funds, fees may no longer be paid in BTC and will default to TEST. The core exchange rate is the price at which BTC are converted to TEST.",
            "coreExchangeRate": "Core exchange rate (CER)",
            "feePool": "Pool balance",
            "unclaimedIssuerIncome": "Unclaimed issuer income"
        },
        "price": {
            "title": "Price Feed",
            "feedPrice": "Feed price (median of witness feeds)",
            "feedLifetime": "Feed lifetime (hours)",
            "minimumFeeds": "Minimum Feeds",
            "maintenanceCollateralRatio": "Maintenance collateral ratio (MCR)",
            "maximumShortSqueezeRatio": "Maximum short squeeze ratio (MSSR)"
        },
        "settlement": {
            "title": "Settlement",
            "text": "Unfortunately, this asset is in Global Settlement. During this time there is no delay in asset force settlements, which will be covered by the settlement funds at the fixed settlement price. Asset will be revived automatically if auto revive price (bids included) is greater than feed price or all debt is force settled (see Asset actions,  or click here to place a bid).",
            "settlementPrice": "Settlement Price",
            "settlementFunds": "Settlement Funds",
            "settlementFundCollateralRatio": "Settlement Fund Collateral Ratio"
        },
        "priceFeedData": {
            "title": "Price Feed Data"
        },
        "collateralBids": {
            "title": "Collateral Bids"
        },
        "quickSellBuy": {
            "title": "Quick Sell / Buy"
        },
        "myPortfolio": {
            "title": "My Portfolio"
        },
        "openOrders": {
            "title": "Open Orders"
        },
        "send": {
            "title": "Send"
        },
        "fundTheFeePool": {
            "title": "Fund The Fee Pool",
            "text": "Anyone can add to the fee pool balance"
        },
        "claimFeePoolBalance": {
            "title": "Claim fee pool balance",
            "text": "The asset owner may withdraw funds from the fee pool"
        },
        "assetClaimFees": {
            "title": "Claim asset fees",
            "text": "The asset issuer may claim any accumulated fees here"
        },
        "assetUpdateIssuer": {
            "title": "Update owner",
            "text": "The asset owner may change the owner to another account"
        },
        "publishFeed": {
            "title": "Publish Feed",
            "text": "Approved feed producers may publish a new feed"
        },
        "bidCollateral": {
            "title": "Bid Collateral",
            "text": "Unfortunately, BTC is in Global Settlement. During this time it is possible to bid on the collateral in the Settlement Fund and the debt it covers. When the total outstanding debt is covered by bids, and the additional collateral of each bid plus its share from the settlement fund is greater than the MCR, the asset is automatically revived and a margin position is created for each bid. \n" +
                "Bids will be included on revival sorted by their bid price until the whole debt is covered (last bid might be covered partially). Included bids will be converted into margin positions and receive the residual collateral such that the position reaches MCR from the settlement fund. Not included bids will be reimbursed. A bid can be removed by placing a zero collateral bid."
        },
        "smallCard": {
            "title": "TEST : ETH"
        },
        "graph": {
            "title": "%(token)s"
        },
        "trends": {
            "title": "Trends"
        },
        "todayTradeVolume": {
            "title": "Today Trade Volume"
        },
        "myActivity": {
            "title": "My Activity"
        },
        "myAssets": {
            "title": "My Assets"
        },
        "recentBlocks": {
            "title": "Recent Blocks"
        }
    },
    "exchange": {
        "title": "Exchange",
        "price": "Current Price",
        "change": "Change (24h)",
        "value": "Volume (24h)",
        "feed": "Feed Price",
        "limit": "Call Limit",
        "margin": "Margin Call",
        "buy": "Buy",
        "sell": "Sell",
        "fee": "Fee:",
        "marketFee": "Market Fee (%(percent)s%):",
        "balance": "Balance:"
    },
    "assets": {
        "title": "My Assets"
    },
    "blockchain": {
        "title": "Blockchain",
        "blockchain": {
            "title": "Blockchain",
            "current_block": "Current Block",
            "supply": "Supply (%(currency)s)",
            "active_witnesses": "Active Witnesses",
            "confirmation_time": "Confirmation Time (Sec)",
            "last_irreversible": "Last Irreversible Block",
            "stealth_supply": "Stealth Supply (%(currency)s)"
        },
        "assets": {
            "title": "Assets"
        },
        "witnesses": {
            "title": "Witnesses",
            "currentWitness": "Current Witness",
            "totalMissed": "Total Missed",
            "remainingBudget": "Remaining Budget (%(currency)s)",
            "nextVoteUpdate": "Next Vote Update",
            "active": "Active",
            "pending": "Pending"
        },
        "committee": {
            "title": "Committee"
        },
        "markets": {
            "title": "Markets"
        },
        "workers": {
            "title": "Workers"
        },
        "fees": {
            "title": "Fees"
        }
    },
    "info": {
        "title": "Info"
    },
    "actions": {
        "title": "Actions"
    },
    "assetUpdate": {
        "title": "Update",
        "primarySettings": "Primary Settings",
        "exchangeRate": "Core Exchange Rate",
        "exchangeRateWarning": "Make sure your core exchange rate is higher than the market price, otherwise people will buy your token from the market and drain your fee pool via implicit arbitrage. The core exchange rate should be updated regularly to reflect market pricing of your asset.",
        "description": "Description",
        "permissions": "Permissions",
        "permissionsWarning": "After creation, you may only remove a given permission, you cannot enable a permission that was disabled on creation.",
        "flags": "Flags",
        "smartOptions": "SmartCoin Options",
        "feedProducers": "Feed Producers",
        "whitelist": "Whitelist",
        "whitelistAuthorities": "Whitelist Authorities",
        "blacklistAuthorities": "Blacklist Authorities",
        "whitelistMarket": "Whitelist Market",
        "blacklistMarket": "Blacklist Market",
    },
    "voting": {
        "title": "Voting & Vesting",
        "vestingTitle": "Vesting",
        "votingTitle": "Voting",
        "workers": {
            "title": "Workers"
        },
        "witnesses": {
            "title": "Witnesses"
        },
        "committee": {
            "title": "Committee"
        },
        "son": {
            "title": "SON"
        },
        "performance": {
            "title": "Voting Performance",
            "max": "Max Rewards",
            "great": "Great Rewards",
            "good": "Good Rewards",
            "ok": "OK Rewards",
            "low": "Low Rewards",
            "lower": "Lower Rewards",
            "crit": "Critical Low",
            "none": "No Rewards"
        },
        "percent": "Qualified Reward %",
        "potential": "Estimated Rake Reward %",
        "next_vote": "Next vote update",
        "newGpos":"New GPOS Balance",
        "noGpos":"There is no available GPOS",
        "openGpos":"Opening GPOS Balance",
        "availableGpos":"Available GPOS Balance",
        "powerUp":"power Up",
        "powerDown":"power Down",
    },
    "business": {
        "title": "Business"
    },
    "vesting": {
        "title": "Vesting"
    },
    "settings": {
        "title": "Settings"
    },
    "bitcoin": {
        "title": "Bitcoin Transactions",
        "Generate":"Generate",
        "withdraw": {
            "title": "Withdraw Bitcoin"
        },
        "generateAddress": {
            "title": "Generate Bitcoin Address"
        },
        "updateAddress": {
            "title": "Update Bitcoin Address"
        }
    },
    "hive": {
        "cardTitle": "Withdraw HIVE or HBD to a Hive blockchain account",
        "title": "Withdraw HIVE/HBD",
        "withdraw": {
            "title": "Withdraw Hive"
        },
    },
    "contacts": {
        "title": "Contacts",
        "blacklistedSwitcher": "Blacklisted",
        "myContacts": "My Contacts"
    },
    "help": {
        "title": "Help"
    },
    "general": {
        "title": "General",
        "interface": "User Interface",
        "language": "Language",
        "theme": "Enable Dark Theme",
        "mode": "Enable Advanced Mode",
        "notifications": "Notifications",
        "transferNotifications": "Transfers to my account",
        "faucet": "Faucet"
    },
    "wallet": {
        "title": "Wallet"
    },
    "security": {
        "title": "Security",
        "lock": "Lock Wallet",
        "lockLabel": "Lock Wallet (min)",
        "password": "Password"
    },
    "nodes": {
        "title": "Nodes",
        "autoSelect": "Select nodes automaticaly",
        "listed": "%(nodesAmount)s listed",
        "active": "Active Node",
        "available": "Available Nodes",
        "unavailable": "Unavailable Nodes",
        "latency": "Latency",
        "operator": "Operator",
        "checking": "We are still checking nodes connect time. Please, wait untill it\'s over"
    },
    "createdAssets": {
        "title": "Created Assets",
        "issued": "User Issued Asset",
        "prediction_assets": "Prediction Market Asset",
        "prediction": "Binary prediction market",
        "smart": "SmartCoin"
    },
    "reBackup": {
        "title": "Backup & restore",
        "backup": {
            "title": "Backup",
            "selectTitle": "Backup type",
            "lastBackup": "Last backup %(lastBackup)s",
            "needBackup": "Need to create backup",
            "wallet": {
                "text": "Create local wallet backup",
                "desc": "Clicking on the button below will generate a backup file with a .bin extension. This file is encrypted with your wallet password, and contains all the private keys for your accounts. It can be used to restore your wallet, or move it to a different computer/browser."
            },
            "brainkey": {
                "text": "Create brainkey backup",
                "desc": "Clicking on the button below will decrypt brainkey and show it in modal window. It can be used to restore your wallet on a different computer/browser."
            },
        },
        "restore": {
            "title": "Restore",
            "selectTitle": "Restore type",
            "fromBin": {
                "text": "Restore from a backup file (.bin)",
                "desc": "Please select your backup file in the dialog below. This is completely safe as the file is not uploaded anywhere and never leaves your browser."
            },
            "fromPrivate": {
                "text": "Import a private key",
                "desc": "Clicking on the button below will decrypt brainkey and show it in modal window. It can be used to restore your wallet on a different computer/browser."
            },
            "fromBrain": {
                "text": "Restore using a local wallet brainkey",
                "desc": "Clicking on the button below will decrypt brainkey and show it in modal window. It can be used to restore your wallet on a different computer/browser."
            },
        },
    },
    "userAssets": {
        "title": "Assets"
    },
    "orders": {
        "title": "Open orders",
    },
    "activity": {
        "title": "Activity",
    },
    "positions": {
        "title": "Margin positions",
    },
    "blacklist": {
        "title": "Black List",
    },
    "permissions": {
        "title": "Permissions",
        "threshold": "Threshold",
        "add": "Add Permission",
        "owner": {
            "title": "Account Ownership",
            "subtitle": "Owner permissions define who has control over the account. Owners may overwrite all keys and change any account settings."
        },
        "active": {
            "title": "Assets Management",
            "subtitle": "Active permissions define the accounts that have permission to spend funds for this account."
        },
        "memo": {
            "title": "Memos View",
            "subtitle": "The memo key is where you receive memos, in order to decode the memos you need to control the private key for the public key. By using a public/private key pair without spending authority, you may give read-only access to your memos to third parties."
        },
        "activity": {
            "title": "Permissions Related Activity",
            "subtitle": "Active permissions define the accounts that have permission to spend funds for this account."
        }
    },
    "deposit": {
        "title": "Deposit",
        "address": "%(inputAsset)s sent to this address will show up as %(outputAsset)s: \n %(address)s",
        "memo": "Memo required for proper routing to your account: \n %(memo)s",
    },
    "bridgeData": {
        "warning": "Please, select gateway and asset",
        "minDeposit": "Minimum Deposit: %(minDeposit)s",
        "minDepositComment": "Send only %(inputAsset)s to deposit address. Sending less than %(minDeposit)s or any other currency to this address may result in the loss of your deposit.",
        "assetToDeposit": "Asset to deposit:",
        "assetToWithdraw": "Asset to withdraw:",
        "assetToReceive": "You will receive:",
        "intermediateAccount": "Intermediate account:",
        "senderAccount": "Your account:",
        "currentBalance": "Current balance:"
    },
    "withdraw": {
        "title": "Withdraw"
    },
    "membership": {
        "title": "Membership",
        "upgradeTitle": "Upgrade for 80% Cashback",
        "upgradeDesc": "Lifetime Members get 80% cashback on every transaction fee they pay and qualify to earn referral income from users they register with or refer to the network. A Lifetime Membership is just %(fee)s.",
        "referralTitle": "Your referral link",
        "referralDesc": "Give this to link to people you want to refer to BitShares: %(link)s/?r=%(name)s",
        "allocationTitle": "Fee Allocation",
        "allocationDesc": "Every time < %(name)s > pays a transaction fee, that fee is divided among several different accounts",
        "network": "Network",
        "reviewer": "Lifetime Reviewer",
        "registrar": "Registrar",
        "referrer": "Affiliate Referrer",
        "expiration": "Membership Expiration",
        "statistics": "Fee Statistics",
        "totalFee": "Total Fees Paid",
        "pendingTitle": "Pending Fees",
        "pendingDesc": "Fees paid by < %(name)s > are divided among the network, referrers, and registrars once every maintenance interval (%(interval)s seconds). The next maintenance time is %(nextMaintenance)s.",
        "vestingTitle": "Vesting Fees",
        "vestingDesc": "Most fees are made available immediately, but fees over 100 %(symbol)s (such as those paid to upgrade your membership or register a premium account name) must vest for a total of 90 days."
    },
    "search": {
        "users": "Users",
        "blocks": "Blocks",
        "tokens": "Tokens"
    },
    "exchangeForm": {
        "price": "Price (%(token)s)",
        "quantity": "Quantity (%(token)s)",
        "total": "Total (%(token)s)"
    },
    "field": {
        "labels": {
            "sellAmount": "Sell amount",
            "buyAmount": "Buy amount",
            "login": "Login",
            "publicName": "Public Name",
            "brainkey": "Brainkey",
            "accName": "Account Name",
            "newLogin": "Public Account Name",
            "password": "Password",
            "passwordCheck": "Confirm Password",
            "from": "From",
            "to": "To",
            "hiveAcc": "Enter Hive blockchain account to which the funds are to be sent",
            "hiveAmount": "Enter amount of HIVE/HBD to be withdrawn",
            "hiveCurrency": "Select currency",
            "quantity": "Quantity",
            "memo": "Memo",
            "fee": "Fee",
            "gateFee": "Gate Fee",
            "newWorkerName": "Worker Name",
            "dailyPay": "Daily Pay (TEST)",
            "dateBegin": "Start Date",
            "dateEnd": "End Date",
            "website": "Website",
            "vesting": "Salary Vesting Period (Days)",
            "faucet": "Faucet URL",
            "file": "Key File (%(fileSize)s)",
            "asset": "Asset",
            "gateway": "Gateway",
            "withdrawAmount": "Amount to Withdraw",
            "withdrawAddress": "Withdraw to Address",
            "assetOwner": "Asset Owner",
            "feedProducer": "Feed Producer",
            "forceSettlementPrice": "Force Settlement Price",
            "cer": "CER",
            "mcr": "MCR",
            "mssr": "MSSR",
            "debt": "Debt (%(token)s)",
            "collateral": "Collateral (%(token)s)",
            "name": "Name",
            "newAssetName": "Symbol",
            "maxSupply": "Maximum Supply",
            "decimal": "Decimal Places",
            "exchangeQuote": "Quote Asset Amount %(asset)s",
            "exchangeBase": "Base Asset Amount (%(asset)s)",
            "description": "Description",
            "shortName": "Short Name",
            "pairingAsset": "Preferred Pairing (Symbol)",
            "feedInMinutes": "Feed lifetime in minutes",
            "minNumberOfFeeds": "Minimum number of feeds",
            "forcedSettlementDelay": "Forced Settlement Delay (minutes)",
            "forcedSettlementPercent": "Forced Settlement Percent",
            "forcedSettlementMaxVolume": "Max Forced Settlement Volume (percent per hour)",
            "backingAsset": "Backing Asset",
            "marketFee": "Market Fee (%)",
            "maxMarketFee": "Max Market Fee",
            "issueAmount": "Issue Amount",
            "condition": "Condition (max 60 characters)",
            "resolutionDate": "Market resolution date",
            "depositAddress": "Deposit Address",
            "depositPublicKey": "Deposit Public Key",
            "withdrawPublicKey": "Withdraw Public Key",
            "withdrawAddress": "Withdraw Address"
        },
        "comments": {
            "newLogin": "You can use letters, symbols, etc...",
            "memo": "Only users with a memo key can read your memos",
            "newWorkerName": "Be short and descriptive, e.g. \"Worker Purpose - Account Name\"",
            "dailyPay": "The current best practice is to define a salary in USD/CNY, and commit to burning whatever surplus you receive as a result of the TEST price increasing. As long as your worker is active and has sufficient votes to be above the refund worker, you will receive this daily salary.",
            "faucet": "The faucet address is used to pay the registration fee for new users.",
            "withdrawAmount": "Minimum amount: %(minAmount)s",
            "asset": "Asset",
            "decimal": " Max. 8     (Cannot be changed)",
            "exchangeQuote": " Price: %(number)s %(symbol)s",
            "issueAmount": "Remain supply: %(remainToIssue)s %(symbol)s"
        },
        "radio": {
            "cloud": "Cloud wallet (simple)",
            "local": "Local wallet (advanced)"
        },
        "checkboxes": {
            "remember": "Remember me"
        },
        "upload": {
            "file": "Key File (%(fileSize)s)"
        }
    },
    "errors": {
        "requiredAndnotzero":"This field is required and not zero",
        "withdrawError":"The withdraw amount should be greater than 0",
        "Notexceed":"Value cannot exceed",
        "sendYourself": "You can\'t transfer tokens for yourself",
        "sonNotAvailable": "SON network is not available now",
        "noAcc": "Failed to find this account",
        "noKey": "Failed to find this key",
        "wrongPass": "Password is wrong",
        "required": "This field is required.",
        "invalidKey":"Invalid key.",
        "requiredQuantity": "Quantity is required.",
        "isTooBig": "Value is too big.",
        "isNan": "Amount is not a number.",
        "isNull": "You can't send a null.",
        "isEmptyBalance": "You don't have balance to pay fee.",
        "isEmptyMarketBalance": "You don't have balance to pay market fee.",
        "nullWeight": "Can\'t be null",
        "isNotEnough": "Balance is not enough.",
        "isZero": "Quantity should be greater than 0.",
        "isDecimal": "Quantity should not be decimal.",
        "accUsed": "Account is already in use.",
        "assetUsed": "Asset is already in use.",
        "keyUsed": "Key is already in use.",
        "sameAsset": "Same Assets not allowed",
        "wrongAsset": "Asset isn't valid",
        "needSamePrecision": "That asset does not have the same precision",
        "needPassword": "Please, enter password first",
        "passwordsNotMatch": "Passwords don't match",
        "passwordLength": "Password should be at least 12 characters long",
        "passwordNoBlank": "Password should not contain blank space",
        "usedWorkerName": "Worker name is already in use.",
        "beginFromToday": "Beginning date must start from today",
        "wrongEndDate": "End date must be after beginning",
        "accountIsNotExist": "Account does not exist",
        "sameAccount": "Cannot transfer to your account",
        "invalidFile": "Invalid backup file",
        "decompressingError": "Error decompressing wallet",
        "wrongBrain": "Didn't found accounts for this brainkey",
        "wrongBrainLength": "Brainkey must contain 16 words",
        "belowMinAmount": "Current amount is below minimum",
        "addressIsNotValid": "Address is not valid",
        "wrongDecimal": "Wrong decimal",
        "conditionLength": "Condition is too long",
        "resolutionError": "Select another date",
        "remainIssueNotEnough": "Remain amount of supply isn't enough to issue",
        "sonError": "Server side error!! Try again later.",
        "keyExists": "Key already exists.",
        "newAcc": {
            "noCapital": "Account name should not contain capital letters",
            "longer": "Account name should be longer",
            "shorter": "Account name should be shorter",
            "firstLetter": "Account name should start with a letter",
            "noSpecials": "Account name should have only letters, digits, or dashes",
            "oneDash": "Account name should have only one dash in a row",
            "lastSymbol": "Account name should end with a letter or digit",
            "notCheap": "This is a premium name which is not supported by this faucet. Please enter a regular name containing least one dash, a number or no vowels.",
            "inUse": "Account is already in use."
        },
        "newAccSegment": {
            "firstLetter": "Each account segment should start with a letter",
            "noSpecials": "Each account segment should have only letters, digits, or dashes",
            "oneDash": "Each account segment should have only one dash in a row",
            "lastSymbol": "Each account segment should end with a letter or digit",
        },
        "newAsset": {
            "empty": "Asset name should not be empty.",
            "oneDot": "Asset name should have only one dot.",
            "longer": "Asset name should be longer.",
            "shorter": "Asset name should be shorter.",
            "start": "Asset name should start with a letter",
            "end": "Asset name should end with a letter or number",
            "symbols": "Asset name should contain only letters numbers and perhaps a dot."
        }
    },
    "success":{
        "transCompleted": "Transaction Completed",
        "sidechainUpdated": "Sidechain address has been updated.",
        "sidechainGenerated": "Sidechain address has been generated.",
    },
    "tabs": {
        "orderBook": "Order Book",
        "history": "History",
        "openOrders": "Open orders",
        "orderHistory": "Order History",
        "cloud": "Cloud Wallet",
        "local": "Local Wallet",
        "brain": "Brain Key",
    },
    "modal": {
        "send": {
            "title": "Send"
        },
        "newWorker": {
            "title": "New Worker Proposal",
            "warning": "Parameters cannot be changed once published."
        },
        "newContact": {
            "title": "New Contact",
            "warning": "User is not defined."
        },
        "showBrain": {
            "title": "Your Brain Key"
        },
        "pairSelect": {
            "title": "Select Pair",
            "recent": "Recent Pairs"
        },
        "createUser": {
            "title": "New Account",
            "aboutLogin": "The account name you choose needs to be unique, as it will be registered publicly on the blockchain and will be your identifer for any transactions you make.",
            "referrer": "Note that you'll create new account with reference provided by %(referrer)s",
            "referrerError": "There is no account with %(referrer)s name",
            "referrerMembership": "%(referrer)s must be either a lifetime or annual subscriber."
        },
        "login": {
            "title": "Log in"
        },
        "unlock": {
            "title": "Unlock Profile for %(login)s"
        },
        "binRestore": {
            "title": "Restore account from .bin file"
        },
        "brainRestore": {
            "title": "Restore account from brainkey"
        },
        "warning": {
            "title": "Warning",
            "message": "For this operation you\'ll have to pay %(fee)s fee. Do you want to continue?"
        },
        "accounts": {
            "title": "Account",
            "subtitle": "Select what account to show the activity in the widget"
        },
        "newAssets": {
            "title": "New Asset",
            "smartCoin": "Smart Coin",
            "predictionMarket": "Binary prediction market",
            "exchangeRate": "Core Exchange Rate",
            "exchangeRateSubtitle": "Make sure your core exchange rate is higher than the market price, otherwise people will buy your token from the market and drain your fee pool via implicit arbitrage. The core exchange rate should be updated regularly to reflect market pricing of your asset.",
            "description": "Description",
            "preferredPairing": "Preferred Market Pairing",
            "permissions": "Permissions",
            "permissionsSubtitle": "Makes features available but not activated (see flags below).\n\nAfter creation, you may remove permissions (but not add them).",
            "flags": "Flags",
            "flagsSubtitle": "Flags define which asset features are active or inactive. They can be switched on and off by the asset owner at any time.",
            "smartCoinOptions": "SmartCoin Options",
        },
        "issueAsset": {
            "title": "Issue Asset"
        },
        "deposit": {
            "title": "Deposit %(asset)s"
        },
        "withdraw": {
            "title": "Withdraw %(asset)s"
        },
        "generateAddress": {
            "title": "Generate %(sidechain)s Address"
        }
    },
    "buttons": {
        "ping": "Ping",
        "clear": "Clear List",
        "sendFunds": "Send Funds",
        "deposit": "Deposit",
        "generateBitcoinAddress": "Generate Bitcoin Address",
        "logout": "Logout",
        "newWorker": "+ New Worker",
        "newAsset": "+ New Asset",
        "cancel": "Cancel",
        "close": "Close",
        "send": "Send",
        "submit": "Submit",
        "login": "Log In",
        "create": "Create",
        "publish": "Publish",
        "copyBrain": "Copy Brain",
        "select": "Select",
        "continue": "Continue",
        "createAccount": "Create an account",
        "useAnother": "Use Another",
        "upload": "Upload",
        "unlock": "Unlock",
        "buyMembership": "Buy Lifetime Subscription",
        "withdraw": "Withdraw",
        "showAdditionalData": "Show Additional Data",
        "hideAdditionalData": "Hide Additional Data",
        "newContact": "+ New Contact",
        "update": "Update",
        "generate": "Generate",
    },
    "emptyPage": {
        "default": "No data",
        "empty": "Empty",
        "userOrders": "User haven't open any order",
        "login": "Please sign in to use the %(pageName)s or create a new account",
        "withdraw": "No asset avaliable",
        "allRead": "All Read",
        "activity": "No Data"
    }
};
