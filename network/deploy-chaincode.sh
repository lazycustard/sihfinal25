#!/bin/bash

# Deploy Chaincode Script for Product Traceability
# This script packages and deploys the Go chaincode to the Hyperledger Fabric network

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} Chaincode Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Set environment variables
export PATH=${PWD}/fabric-samples/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/fabric-samples/config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="FarmerMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/network/organizations/peerOrganizations/farmer.example.com/peers/peer0.farmer.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/network/organizations/peerOrganizations/farmer.example.com/users/Admin@farmer.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

CHANNEL_NAME="traceability-channel"
CHAINCODE_NAME="asset_chaincode"
CHAINCODE_VERSION="1.0"
CHAINCODE_SEQUENCE="1"

echo -e "${YELLOW}[1/7] Creating channel...${NC}"

# Create channel transaction
cd network
../fabric-samples/bin/configtxgen -profile TraceabilityOrdererGenesis -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME

# Create channel
../fabric-samples/bin/peer channel create -o localhost:7050 -c $CHANNEL_NAME -f ./channel-artifacts/${CHANNEL_NAME}.tx --outputBlock ./channel-artifacts/${CHANNEL_NAME}.block --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

echo -e "${YELLOW}[2/7] Joining peers to channel...${NC}"

# Join Farmer peer
../fabric-samples/bin/peer channel join -b ./channel-artifacts/${CHANNEL_NAME}.block

# Switch to Distributor peer
export CORE_PEER_LOCALMSPID="DistributorMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/distributor.example.com/peers/peer0.distributor.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/distributor.example.com/users/Admin@distributor.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

../fabric-samples/bin/peer channel join -b ./channel-artifacts/${CHANNEL_NAME}.block

# Switch to Retailer peer
export CORE_PEER_LOCALMSPID="RetailerMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/retailer.example.com/peers/peer0.retailer.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/retailer.example.com/users/Admin@retailer.example.com/msp
export CORE_PEER_ADDRESS=localhost:11051

../fabric-samples/bin/peer channel join -b ./channel-artifacts/${CHANNEL_NAME}.block

cd ..

echo -e "${YELLOW}[3/7] Packaging chaincode...${NC}"

# Package the chaincode
../fabric-samples/bin/peer lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz --path ./chaincode --lang golang --label ${CHAINCODE_NAME}_${CHAINCODE_VERSION}

echo -e "${YELLOW}[4/7] Installing chaincode on all peers...${NC}"

# Install on Farmer peer
export CORE_PEER_LOCALMSPID="FarmerMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/network/organizations/peerOrganizations/farmer.example.com/peers/peer0.farmer.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/network/organizations/peerOrganizations/farmer.example.com/users/Admin@farmer.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

../fabric-samples/bin/peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

# Install on Distributor peer
export CORE_PEER_LOCALMSPID="DistributorMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/network/organizations/peerOrganizations/distributor.example.com/peers/peer0.distributor.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/network/organizations/peerOrganizations/distributor.example.com/users/Admin@distributor.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051

../fabric-samples/bin/peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

# Install on Retailer peer
export CORE_PEER_LOCALMSPID="RetailerMSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/network/organizations/peerOrganizations/retailer.example.com/peers/peer0.retailer.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/network/organizations/peerOrganizations/retailer.example.com/users/Admin@retailer.example.com/msp
export CORE_PEER_ADDRESS=localhost:11051

../fabric-samples/bin/peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

echo -e "${YELLOW}[5/7] Approving chaincode definition...${NC}"

# Get package ID
PACKAGE_ID=$(../fabric-samples/bin/peer lifecycle chaincode queryinstalled --output json | jq -r ".installed_chaincodes[0].package_id")

# Approve for Farmer
export CORE_PEER_LOCALMSPID="FarmerMSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/network/organizations/peerOrganizations/farmer.example.com/users/Admin@farmer.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/network/organizations/peerOrganizations/farmer.example.com/peers/peer0.farmer.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:7051

../fabric-samples/bin/peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --package-id $PACKAGE_ID --sequence $CHAINCODE_SEQUENCE --tls --cafile ${PWD}/network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

# Approve for Distributor
export CORE_PEER_LOCALMSPID="DistributorMSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/network/organizations/peerOrganizations/distributor.example.com/users/Admin@distributor.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/network/organizations/peerOrganizations/distributor.example.com/peers/peer0.distributor.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:9051

../fabric-samples/bin/peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --package-id $PACKAGE_ID --sequence $CHAINCODE_SEQUENCE --tls --cafile ${PWD}/network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

# Approve for Retailer
export CORE_PEER_LOCALMSPID="RetailerMSP"
export CORE_PEER_MSPCONFIGPATH=${PWD}/network/organizations/peerOrganizations/retailer.example.com/users/Admin@retailer.example.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/network/organizations/peerOrganizations/retailer.example.com/peers/peer0.retailer.example.com/tls/ca.crt
export CORE_PEER_ADDRESS=localhost:11051

../fabric-samples/bin/peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --package-id $PACKAGE_ID --sequence $CHAINCODE_SEQUENCE --tls --cafile ${PWD}/network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

echo -e "${YELLOW}[6/7] Committing chaincode definition...${NC}"

../fabric-samples/bin/peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --sequence $CHAINCODE_SEQUENCE --tls --cafile ${PWD}/network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/network/organizations/peerOrganizations/farmer.example.com/peers/peer0.farmer.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/network/organizations/peerOrganizations/distributor.example.com/peers/peer0.distributor.example.com/tls/ca.crt --peerAddresses localhost:11051 --tlsRootCertFiles ${PWD}/network/organizations/peerOrganizations/retailer.example.com/peers/peer0.retailer.example.com/tls/ca.crt

echo -e "${YELLOW}[7/7] Testing chaincode...${NC}"

# Test chaincode invocation
../fabric-samples/bin/peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile ${PWD}/network/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n $CHAINCODE_NAME --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/network/organizations/peerOrganizations/farmer.example.com/peers/peer0.farmer.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/network/organizations/peerOrganizations/distributor.example.com/peers/peer0.distributor.example.com/tls/ca.crt -c '{"function":"GetAllProducts","Args":[]}'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} Chaincode Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "✅ Channel created: ${CHANNEL_NAME}"
echo -e "✅ Chaincode installed on all peers"
echo -e "✅ Chaincode approved by all organizations"
echo -e "✅ Chaincode committed to channel"
echo -e "✅ Chaincode tested successfully"
echo ""
echo -e "${YELLOW}The blockchain network is ready for use!${NC}"
