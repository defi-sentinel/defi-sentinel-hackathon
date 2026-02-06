# Badge Metadata Examples

This directory contains example JSON metadata files for each badge type. These files should be hosted on your server or IPFS and referenced via the `setBaseURI()` or `setTokenURI()` functions in the BadgeNFT contract.

## Metadata Format

Each badge metadata file follows the ERC-1155 metadata standard:

```json
{
  "name": "Badge Name",
  "description": "Badge description",
  "image": "https://your-domain.com/images/badge.png",
  "external_url": "https://your-domain.com/badges/{badgeId}",
  "attributes": [
    {
      "trait_type": "Type",
      "value": "Achievement"
    }
  ]
}
```

## Setting Up Metadata

### Option 1: Base URI (Recommended)

1. Host all metadata files on your server:
   - `https://api.defisentinel.com/badges/1001.json`
   - `https://api.defisentinel.com/badges/2001.json`
   - etc.

2. Set the base URI in the contract:
   ```solidity
   badgeNFT.setBaseURI("https://api.defisentinel.com/badges/");
   ```

3. The contract will automatically construct URIs as: `baseURI + badgeId + ".json"`

### Option 2: Individual Token URIs

For more control, set individual URIs for each badge:

```solidity
badgeNFT.setTokenURI(1001, "https://ipfs.io/ipfs/QmHash/early-adopter.json");
badgeNFT.setTokenURI(2001, "https://ipfs.io/ipfs/QmHash/defi-novice.json");
```

## Badge IDs and Metadata Files

| Badge ID | Name | Metadata File |
|----------|------|---------------|
| 1001 | Early Adopter | `badge-1001.json` |
| 2001 | DeFi Novice | `badge-2001.json` |
| 2002 | DeFi Intermediate | `badge-2002.json` |
| 2003 | DeFi Master | `badge-2003.json` |
| 2004 | Risk Guardian | `badge-2004.json` |
| 3001 | Pro Member | `badge-3001.json` |
| 3002 | Sentinel Elite | `badge-3002.json` |
| 4001 | Scholar | `badge-4001.json` |
| 4002 | Explorer | `badge-4002.json` |

## Image Requirements

- **Format**: PNG, SVG, or WebP
- **Recommended Size**: 512x512px or 1024x1024px
- **Hosting**: Can be hosted on your server, IPFS, or Arweave
- **URL**: Should be a direct link to the image file

## Example: Setting Up Metadata

```javascript
// Using ethers.js
const badgeNFT = await ethers.getContractAt("BadgeNFT", badgeNFTAddress);

// Set base URI (all badges)
await badgeNFT.setBaseURI("https://api.defisentinel.com/badges/");

// Or set individual URIs
await badgeNFT.setTokenURI(1001, "https://ipfs.io/ipfs/QmHash/1001.json");
```

## IPFS Hosting

For decentralized hosting, upload your metadata and images to IPFS:

1. Upload images to IPFS
2. Update metadata JSON files with IPFS image URLs
3. Upload metadata JSON files to IPFS
4. Set token URIs using IPFS hashes:
   ```solidity
   badgeNFT.setTokenURI(1001, "ipfs://QmHash...");
   ```

## Testing

After setting URIs, you can verify them:

```javascript
const uri = await badgeNFT.uri(1001);
console.log("Badge 1001 URI:", uri);
// Should return: "https://api.defisentinel.com/badges/1001.json"
```

