
# Blockchain Network Setup Script for Hyperledger Fabric
# This script sets up a basic 3-organization network for product traceability

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} Hyperledger Fabric Network Setup${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if running in correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/6] Checking prerequisites...${NC}"

# Download Hyperledger Fabric binaries and samples
if [ ! -d "fabric-samples" ]; then
    echo -e "${YELLOW}[2/6] Downloading Hyperledger Fabric samples...${NC}"
    curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
    ./install-fabric.sh docker samples binary
else
    echo -e "${GREEN}Fabric samples already exist${NC}"
fi

# Set environment variables
export PATH=${PWD}/fabric-samples/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/fabric-samples/config/

echo -e "${YELLOW}[3/6] Setting up network configuration...${NC}"

# Create network directory structure
mkdir -p network/organizations/{ordererOrganizations,peerOrganizations}
mkdir -p network/organizations/peerOrganizations/{farmer.example.com,distributor.example.com,retailer.example.com}
mkdir -p network/organizations/ordererOrganizations/example.com

# Generate crypto material using cryptogen
echo -e "${YELLOW}[4/6] Generating certificates and keys...${NC}"

# Create crypto-config.yaml
cat > network/crypto-config.yaml << EOF
OrdererOrgs:
  - Name: Orderer
    Domain: example.com
    Specs:
      - Hostname: orderer

PeerOrgs:
  - Name: Farmer
    Domain: farmer.example.com
    EnableNodeOUs: true
    Template:
      Count: 1
    Users:
      Count: 1

  - Name: Distributor
    Domain: distributor.example.com
    EnableNodeOUs: true
    Template:
      Count: 1
    Users:
      Count: 1

  - Name: Retailer
    Domain: retailer.example.com
    EnableNodeOUs: true
    Template:
      Count: 1
    Users:
      Count: 1
EOF

# Generate certificates
cd network
../fabric-samples/bin/cryptogen generate --config=./crypto-config.yaml --output="organizations"

echo -e "${YELLOW}[5/6] Creating genesis block and channel configuration...${NC}"

# Create configtx.yaml
cat > configtx.yaml << EOF
Organizations:
  - &OrdererOrg
      Name: OrdererMSP
      ID: OrdererMSP
      MSPDir: organizations/ordererOrganizations/example.com/msp
      Policies:
        Readers:
          Type: Signature
          Rule: "OR('OrdererMSP.member')"
        Writers:
          Type: Signature
          Rule: "OR('OrdererMSP.member')"
        Admins:
          Type: Signature
          Rule: "OR('OrdererMSP.admin')"
      OrdererEndpoints:
        - orderer.example.com:7050

  - &Farmer
      Name: FarmerMSP
      ID: FarmerMSP
      MSPDir: organizations/peerOrganizations/farmer.example.com/msp
      Policies:
        Readers:
          Type: Signature
          Rule: "OR('FarmerMSP.admin', 'FarmerMSP.peer', 'FarmerMSP.client')"
        Writers:
          Type: Signature
          Rule: "OR('FarmerMSP.admin', 'FarmerMSP.client')"
        Admins:
          Type: Signature
          Rule: "OR('FarmerMSP.admin')"
        Endorsement:
          Type: Signature
          Rule: "OR('FarmerMSP.peer')"

  - &Distributor
      Name: DistributorMSP
      ID: DistributorMSP
      MSPDir: organizations/peerOrganizations/distributor.example.com/msp
      Policies:
        Readers:
          Type: Signature
          Rule: "OR('DistributorMSP.admin', 'DistributorMSP.peer', 'DistributorMSP.client')"
        Writers:
          Type: Signature
          Rule: "OR('DistributorMSP.admin', 'DistributorMSP.client')"
        Admins:
          Type: Signature
          Rule: "OR('DistributorMSP.admin')"
        Endorsement:
          Type: Signature
          Rule: "OR('DistributorMSP.peer')"

  - &Retailer
      Name: RetailerMSP
      ID: RetailerMSP
      MSPDir: organizations/peerOrganizations/retailer.example.com/msp
      Policies:
        Readers:
          Type: Signature
          Rule: "OR('RetailerMSP.admin', 'RetailerMSP.peer', 'RetailerMSP.client')"
        Writers:
          Type: Signature
          Rule: "OR('RetailerMSP.admin', 'RetailerMSP.client')"
        Admins:
          Type: Signature
          Rule: "OR('RetailerMSP.admin')"
        Endorsement:
          Type: Signature
          Rule: "OR('RetailerMSP.peer')"

Capabilities:
  Channel: &ChannelCapabilities
    V2_0: true
  Orderer: &OrdererCapabilities
    V2_0: true
  Application: &ApplicationCapabilities
    V2_0: true

Application: &ApplicationDefaults
  Organizations:
  Policies:
    Readers:
      Type: ImplicitMeta
      Rule: "ANY Readers"
    Writers:
      Type: ImplicitMeta
      Rule: "ANY Writers"
    Admins:
      Type: ImplicitMeta
      Rule: "MAJORITY Admins"
    LifecycleEndorsement:
      Type: ImplicitMeta
      Rule: "MAJORITY Endorsement"
    Endorsement:
      Type: ImplicitMeta
      Rule: "MAJORITY Endorsement"
  Capabilities:
    <<: *ApplicationCapabilities

Orderer: &OrdererDefaults
  OrdererType: etcdraft
  Addresses:
    - orderer.example.com:7050
  EtcdRaft:
    Consenters:
    - Host: orderer.example.com
      Port: 7050
      ClientTLSCert: organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
      ServerTLSCert: organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
  BatchTimeout: 2s
  BatchSize:
    MaxMessageCount: 10
    AbsoluteMaxBytes: 99 MB
    PreferredMaxBytes: 512 KB
  Organizations:
  Policies:
    Readers:
      Type: ImplicitMeta
      Rule: "ANY Readers"
    Writers:
      Type: ImplicitMeta
      Rule: "ANY Writers"
    Admins:
      Type: ImplicitMeta
      Rule: "MAJORITY Admins"
    BlockValidation:
      Type: ImplicitMeta
      Rule: "ANY Writers"

Channel: &ChannelDefaults
  Policies:
    Readers:
      Type: ImplicitMeta
      Rule: "ANY Readers"
    Writers:
      Type: ImplicitMeta
      Rule: "ANY Writers"
    Admins:
      Type: ImplicitMeta
      Rule: "MAJORITY Admins"
  Capabilities:
    <<: *ChannelCapabilities

Profiles:
  TraceabilityOrdererGenesis:
    <<: *ChannelDefaults
    Orderer:
      <<: *OrdererDefaults
      Organizations:
        - *OrdererOrg
      Capabilities: *OrdererCapabilities
    Application:
      <<: *ApplicationDefaults
      Organizations:
        - *Farmer
        - *Distributor
        - *Retailer
      Capabilities: *ApplicationCapabilities
EOF

# Generate genesis block
../fabric-samples/bin/configtxgen -profile TraceabilityOrdererGenesis -channelID system-channel -outputBlock ./system-genesis-block/genesis.block
mkdir -p system-genesis-block

echo -e "${YELLOW}[6/6] Network setup completed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN} Setup Summary:${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "✅ Hyperledger Fabric binaries downloaded"
echo -e "✅ Crypto material generated for 3 organizations"
echo -e "✅ Genesis block created"
echo -e "✅ Network configuration ready"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Start the network: ${GREEN}docker-compose -f docker-compose.full.yml up -d${NC}"
echo -e "2. Deploy chaincode: ${GREEN}./deploy-chaincode.sh${NC}"
echo -e "3. Start the application: ${GREEN}npm start${NC}"
echo ""
echo -e "${GREEN}Network setup completed successfully!${NC}"

cd ..
