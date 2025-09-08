package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/pkg/statebased" // SBE helper
	//"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Asset struct {
	ID            string   `json:"id"`
	Owner         string   `json:"owner"`
	Status        string   `json:"status"` // "OPEN" | "CLOSED"
	MetadataHash  string   `json:"metadataHash,omitempty"`
	Events        []string `json:"events,omitempty"`
	ClosedAt      string   `json:"closedAt,omitempty"`
	LastScanHash  string   `json:"lastScanHash,omitempty"` // pseudonymous receipt hash
}

// ---------- utils ----------

func (s *SmartContract) assetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	b, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, err
	}
	return b != nil, nil
}

func getClientMSP(ctx contractapi.TransactionContextInterface) (string, error) {
	id := ctx.GetClientIdentity()
	return id.GetMSPID()
}

// ---------- CRUD ----------

func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, id, owner, metadataHash string) error {
	exists, err := s.assetExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("asset %s already exists", id)
	}
	a := Asset{
		ID:           id,
		Owner:        owner,
		Status:       "OPEN",
		MetadataHash: metadataHash,
		Events:       []string{"CREATED"},
	}
	b, _ := json.Marshal(a)
	return ctx.GetStub().PutState(id, b)
}

func (s *SmartContract) UpdateAsset(ctx contractapi.TransactionContextInterface, id, eventJSON string) error {
	b, err := ctx.GetStub().GetState(id)
	if err != nil {
		return err
	}
	if b == nil {
		return fmt.Errorf("asset %s not found", id)
	}
	var a Asset
	if err := json.Unmarshal(b, &a); err != nil {
		return err
	}
	if a.Status == "CLOSED" {
		return fmt.Errorf("asset %s is CLOSED; no further updates allowed", id)
	}
	a.Events = append(a.Events, eventJSON)
	nb, _ := json.Marshal(a)
	return ctx.GetStub().PutState(id, nb)
}

func (s *SmartContract) AppendEvent(ctx contractapi.TransactionContextInterface, id, eventJSON string) error {
	return s.UpdateAsset(ctx, id, eventJSON)
}

// ---------- Finalize (terminal state + SBE) ----------

func (s *SmartContract) FinalizeAsset(ctx contractapi.TransactionContextInterface, id, consumerReceiptHash string) error {
	b, err := ctx.GetStub().GetState(id)
	if err != nil {
		return err
	}
	if b == nil {
		return fmt.Errorf("asset %s not found", id)
	}
	var a Asset
	if err := json.Unmarshal(b, &a); err != nil {
		return err
	}
	if a.Status == "CLOSED" {
		return fmt.Errorf("asset %s already CLOSED", id)
	}

	a.Status = "CLOSED"
	a.LastScanHash = consumerReceiptHash
	a.ClosedAt = time.Now().UTC().Format(time.RFC3339)
	a.Events = append(a.Events, "FINALIZED")

	nb, _ := json.Marshal(a)
	if err := ctx.GetStub().PutState(id, nb); err != nil {
		return err
	}

	evtPayload, _ := json.Marshal(map[string]string{"assetId": id, "status": a.Status})
	if err := ctx.GetStub().SetEvent("AssetFinalized", evtPayload); err != nil {
		return err
	}

	ep, err := statebased.NewStateEP(nil)
	if err != nil {
		return err
	}
	if err := ep.AddOrgs(statebased.RoleTypePeer, "Org1MSP", "Org2MSP"); err != nil {
		return err
	}
	policy, err := ep.Policy()
	if err != nil {
		return err
	}
	if err := ctx.GetStub().SetStateValidationParameter(id, policy); err != nil {
		return err
	}

	return nil
}

// ---------- read helpers ----------

func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*Asset, error) {
	b, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, err
	}
	if b == nil {
		return nil, fmt.Errorf("asset %s not found", id)
	}
	var a Asset
	if err := json.Unmarshal(b, &a); err != nil {
		return nil, err
	}
	return &a, nil
}

func main() {
	cc, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		panic(err)
	}
	if err := cc.Start(); err != nil {
		panic(err)
	}
}
