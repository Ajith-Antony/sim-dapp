// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MockAsset {
    struct Asset {
        uint256 id;
        string name;
        uint256 price;
        string src;
        address owner;
    }

    Asset[] public assets;

    constructor() {
        _generateMockAssets(20);
    }

    function _generateMockAssets(uint256 count) internal {
        for (uint256 i = 1; i <= count; i++) {
            assets.push(
                Asset(
                    i,
                    string(abi.encodePacked("Asset ", uint2str(i))),
                    1000 + (i * 100),
                    string(
                        abi.encodePacked("https://picsum.photos/id/", uint2str(i), "/720")
                    ),
                    address(0)
                )
            );
        }
    }

    function getAssets() external view returns (Asset[] memory) {
        return assets;
    }

    function buy(uint256 assetId) external payable {
    require(assetId > 0 && assetId <= assets.length, "Invalid assetId");
    Asset storage a = assets[assetId - 1];

    require(a.owner == address(0), "Asset already owned");

    if (block.chainid != 31337) {
        require(msg.value >= a.price, "Insufficient payment");
    }

    a.owner = msg.sender;
}

    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }
}
