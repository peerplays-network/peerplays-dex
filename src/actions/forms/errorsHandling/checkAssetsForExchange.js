import { defaultToken } from "../../../params/networkParams";

export const checkAssetsForExchange = async ({sellAsset, buyAsset}) => {
    if (sellAsset === buyAsset) {
        return 'sameAsset';
    }

    if (sellAsset !== defaultToken && buyAsset !== defaultToken) {
        return `assetsShouldBe${defaultToken}`;
    }

    return false
}